const Product = require('../models/Product');

// @desc    Get all products with pagination and filtering
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.search) {
      query.$or = [
        { Style_Name: { $regex: req.query.search, $options: 'i' } },
        { Brick: { $regex: req.query.search, $options: 'i' } },
        { Category: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.grade) query.Segment = req.query.grade;
    if (req.query.brick) query.Brick = req.query.brick;
    if (req.query.category) query.Category = req.query.category;

    // Use aggregation to group by Style_Name to collect sizes
    const pipeline = [
      { $match: query },
      { 
        $group: {
          _id: "$Style_Name",
          originalId: { $first: "$_id" },
          Style_Code: { $first: "$Style_Code" },
          Brick: { $first: "$Brick" },
          Segment: { $first: "$Segment" },
          Category: { $first: "$Category" },
          sizes: { $addToSet: "$Size_Code" },
          doc: { $first: "$$ROOT" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }]
        }
      }
    ];

    const result = await Product.aggregate(pipeline);
    const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
    const products = result[0].data.map(p => ({
      _id: p.originalId,
      title: p._id || p.Style_Code || 'Unknown Product',
      grade: p.Segment || '',
      brick: p.Brick || '',
      category: p.Category || '',
      sizes: p.sizes,
      attributes: p.doc
    }));

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductMeta = async (req, res) => {
  try {
    const grades = await Product.distinct('Segment');
    const bricks = await Product.distinct('Brick');
    const categories = await Product.distinct('Category');
    const sizes = await Product.distinct('Size_Code');
    
    res.json({
      grades: grades.filter(Boolean),
      bricks: bricks.filter(Boolean),
      categories: categories.filter(Boolean),
      sizes: sizes.filter(Boolean),
      attributes: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductMeta,
  getProductById
};
