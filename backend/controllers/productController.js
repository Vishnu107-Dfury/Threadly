const Product = require('../models/Product');
const xlsx = require('xlsx');
const { resolveProductImages } = require('../services/imageService');

// @desc    Get all products with pagination, search, and dynamic multi-attribute filtering
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const skip = (page - 1) * limit;

    let query = {};

    // Free text search across title, style_code, brick, category, brand, and color
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { style_code: searchRegex },
        { brick: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
        { color: searchRegex },
        { 'attributes.material': searchRegex },
        { 'attributes.fit': searchRegex }
      ];
    }

    // Filter by Brick (supports comma-separated multi-select)
    if (req.query.brick) {
      const bricks = req.query.brick.split(',').map(b => b.trim()).filter(Boolean);
      query.brick = bricks.length === 1 ? bricks[0] : { $in: bricks };
    }

    // Filter by Category (supports comma-separated multi-select)
    if (req.query.category) {
      const categories = req.query.category.split(',').map(c => c.trim()).filter(Boolean);
      query.category = categories.length === 1 ? categories[0] : { $in: categories };
    }

    // Filter by Sleeve
    if (req.query.sleeve) {
      const sleeves = req.query.sleeve.split(',').map(s => s.trim()).filter(Boolean);
      query.sleeve = sleeves.length === 1 ? sleeves[0] : { $in: sleeves };
    }

    // Filter by Neck
    if (req.query.neck) {
      const necks = req.query.neck.split(',').map(n => n.trim()).filter(Boolean);
      query.neck = necks.length === 1 ? necks[0] : { $in: necks };
    }

    // Filter by Grade
    if (req.query.grade) {
      const grades = req.query.grade.split(',').map(g => g.trim()).filter(Boolean);
      query.grade = grades.length === 1 ? grades[0] : { $in: grades };
    }

    // Filter by Size (product must include selected size)
    if (req.query.size) {
      const sizes = req.query.size.split(',').map(s => s.trim()).filter(Boolean);
      query.sizes = { $in: sizes };
    }

    // Filter by Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.mrp = {};
      if (req.query.minPrice) query.mrp.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.mrp.$lte = parseFloat(req.query.maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOption = { mrp: 1 };
          break;
        case 'price_desc':
          sortOption = { mrp: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'title_asc':
          sortOption = { title: 1 };
          break;
        case 'title_desc':
          sortOption = { title: -1 };
          break;
        case 'newest':
        default:
          sortOption = { createdAt: -1 };
          break;
      }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dynamic distinct attributes metadata for catalogue filters & ratio levels
// @route   GET /api/products/meta
// @access  Public
const getProductMeta = async (req, res) => {
  try {
    const [bricks, categories, sleeves, necks, grades, sizesResult, priceStats] = await Promise.all([
      Product.distinct('brick'),
      Product.distinct('category'),
      Product.distinct('sleeve'),
      Product.distinct('neck'),
      Product.distinct('grade'),
      Product.distinct('sizes'),
      Product.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$mrp' },
            maxPrice: { $max: '$mrp' },
            totalCount: { $sum: 1 }
          }
        }
      ])
    ]);

    // Distinct sizes sorted cleanly
    const allSizes = Array.from(new Set(sizesResult.flat().filter(Boolean)));
    const sortedSizes = allSizes.sort((a, b) => {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4-5Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'];
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b, undefined, { numeric: true });
    });

    const stats = priceStats[0] || { minPrice: 399, maxPrice: 4999, totalCount: 0 };

    res.json({
      bricks: bricks.filter(Boolean).sort(),
      categories: categories.filter(Boolean).sort(),
      sleeves: sleeves.filter(Boolean).sort(),
      necks: necks.filter(Boolean).sort(),
      grades: grades.filter(Boolean).length > 0 ? grades.filter(Boolean).sort() : ['A', 'B', 'C', 'D'],
      sizes: sortedSizes,
      minPrice: stats.minPrice || 0,
      maxPrice: stats.maxPrice || 5000,
      totalCount: stats.totalCount || 0,
      // Dynamic Ratio levels available based on present attributes
      ratioLevels: [
        { id: 'Brick', label: 'Brick' },
        { id: 'Category', label: 'Category' },
        { id: 'Brick_Neck', label: 'Brick + Neck' },
        { id: 'Brick_Sleeve', label: 'Brick + Sleeve' },
      ]
    });
  } catch (error) {
    console.error('getProductMeta error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID or style_code
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).lean();
    }
    if (!product) {
      product = await Product.findOne({ style_code: id }).lean();
    }

    if (product) {
      // Find related products in the same brick
      const related = await Product.find({
        brick: product.brick,
        _id: { $ne: product._id }
      })
      .limit(4)
      .lean();

      res.json({ ...product, related });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload and parse Excel (.xlsx) or CSV catalogue file dynamically
// @route   POST /api/products/upload
// @access  Public (or Protected)
const uploadCatalogue = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an .xlsx or .csv file' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rawRows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

    if (!rawRows || rawRows.length === 0) {
      return res.status(400).json({ message: 'Uploaded file has no data rows' });
    }

    // Group rows by Style_Code
    const stylesMap = new Map();
    rawRows.forEach((r, idx) => {
      const code = String(r.Style_Code || r.Style_Name || `SKU-${idx}`).trim();
      if (!stylesMap.has(code)) {
        const mrpValue = parseFloat(r.MRP) || 1999;
        const brick = String(r.Brick || 'T-Shirts').trim();
        const { image, gallery } = resolveProductImages(brick, code);

        stylesMap.set(code, {
          style_code: code,
          title: String(r.Style_Name || r.Style_Description || `Style ${code}`).trim(),
          brand: r.Brand_Name ? String(r.Brand_Name).trim() : 'Threadly Signature',
          brick: brick,
          category: String(r.Category || 'Top_Wear').trim(),
          sleeve: String(r.Sleeve || '').trim(),
          neck: String(r.Neck || '').trim(),
          color: String(r.Vendor_Colour_Name || r.IK_Colour_Name || 'Standard').trim(),
          color_code: String(r.IK_Colour_Code || '#1E293B').trim(),
          mrp: mrpValue,
          price: mrpValue,
          currency: String(r.Currency || 'INR').trim(),
          grade: (idx % 3 === 0 ? 'A' : idx % 3 === 1 ? 'B' : 'C'),
          sizesSet: new Set(),
          skus: [],
          image,
          gallery,
          stock: 120,
          rating: Number((4.1 + ((idx % 7) * 0.1)).toFixed(1)),
          reviewCount: 50 + (idx * 13) % 300,
          attributes: {
            material: String(r.Material || r.Fabric || 'Cotton Blend').trim(),
            fit: String(r.Fit || 'Regular').trim(),
            pattern: String(r.Pattern || 'Solid').trim(),
            occasion: String(r.Occasion || 'Casual').trim(),
          }
        });
      }

      const styleObj = stylesMap.get(code);
      const sizeVal = String(r.Size_Code || r.Size_Name || '').trim();
      if (sizeVal) {
        styleObj.sizesSet.add(sizeVal);
        styleObj.skus.push({
          size: sizeVal,
          ean: String(r.EAN_Code || '').trim(),
          stock: 50
        });
      }
    });

    const productDocs = [];
    for (const [code, style] of stylesMap.entries()) {
      const sizesArray = Array.from(style.sizesSet);
      productDocs.push({
        ...style,
        sizes: sizesArray.length > 0 ? sizesArray : ['S', 'M', 'L', 'XL'],
        sizesSet: undefined
      });
    }

    // Upsert into MongoDB
    for (const doc of productDocs) {
      await Product.findOneAndUpdate(
        { style_code: doc.style_code },
        doc,
        { upsert: true, new: true }
      );
    }

    const totalInDb = await Product.countDocuments();
    res.json({
      message: `Successfully processed ${rawRows.length} rows and updated ${productDocs.length} product styles!`,
      importedStyles: productDocs.length,
      totalCatalogueProducts: totalInDb
    });
  } catch (error) {
    console.error('uploadCatalogue error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductMeta,
  getProductById,
  uploadCatalogue
};
