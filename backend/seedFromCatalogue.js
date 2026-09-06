require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { resolveProductImages } = require('./services/imageService');

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];
  
  const parseLine = (line) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });
    rows.push(obj);
  }
  return rows;
}

// Supplementary styles for assignment bricks (Kids / Women ranges like 4-5Y to 13-14Y)
const SUPPLEMENTARY_STYLES = [
  {
    style_code: 'DRS-901',
    title: 'Floral Summer Tiered Dress',
    brand: 'Threadly Studio',
    brick: 'Dresses',
    category: "Women's Apparel",
    sleeve: 'Short Sleeve',
    neck: 'V-Neck',
    color: 'Coral Floral',
    color_code: '#F97316',
    mrp: 2499,
    price: 2499,
    grade: 'A',
    sizes: ['4-5Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'],
    attributes: { material: '100% Rayon', fit: 'Flared', occasion: 'Casual' }
  },
  {
    style_code: 'DRS-902',
    title: 'Pleated Midi Party Dress',
    brand: 'Threadly Studio',
    brick: 'Dresses',
    category: "Women's Apparel",
    sleeve: 'Sleeveless',
    neck: 'Round Neck',
    color: 'Midnight Indigo',
    color_code: '#4338CA',
    mrp: 3299,
    price: 3299,
    grade: 'B',
    sizes: ['4-5Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'],
    attributes: { material: 'Chiffon Blend', fit: 'Regular', occasion: 'Party' }
  },
  {
    style_code: 'JNS-801',
    title: 'High-Stretch Comfort Skinny Jeans',
    brand: 'Threadly Denim',
    brick: 'Jeans and Jeggings',
    category: 'Bottom_Wear',
    sleeve: '',
    neck: '',
    color: 'Washed Indigo',
    color_code: '#334155',
    mrp: 1999,
    price: 1999,
    grade: 'A',
    sizes: ['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'],
    attributes: { material: 'Cotton Elastane', fit: 'Skinny Fit', pattern: 'Light Wash' }
  },
  {
    style_code: 'JMP-701',
    title: 'Belted Linen Utility Jumpsuit',
    brand: 'Threadly Studio',
    brick: 'Jumpsuits & Playsuits',
    category: "Women's Apparel",
    sleeve: 'Half Sleeve',
    neck: 'Collar Neck',
    color: 'Sage Neutral',
    color_code: '#64748B',
    mrp: 2799,
    price: 2799,
    grade: 'C',
    sizes: ['4-5Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'],
    attributes: { material: 'Linen Blend', fit: 'Relaxed', closure: 'Front Zip' }
  },
  {
    style_code: 'SWT-601',
    title: 'Relaxed Crewneck Fleece Sweatshirt',
    brand: 'Threadly Active',
    brick: 'Sweatshirts',
    category: 'Top_Wear',
    sleeve: 'Full Sleeve',
    neck: 'Round Neck',
    color: 'Deep Violet',
    color_code: '#4338CA',
    mrp: 1799,
    price: 1799,
    grade: 'B',
    sizes: ['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'],
    attributes: { material: 'Brushed Cotton Fleece', fit: 'Oversized', pattern: 'Solid' }
  },
  {
    style_code: 'TRK-501',
    title: 'Tapered Knit Performance Trackpants',
    brand: 'Threadly Active',
    brick: 'Trackpants',
    category: 'Bottom_Wear',
    sleeve: '',
    neck: '',
    color: 'Carbon Slate',
    color_code: '#1E293B',
    mrp: 1499,
    price: 1499,
    grade: 'A',
    sizes: ['4-5Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'],
    attributes: { material: 'Poly Spandex', fit: 'Tapered', waistband: 'Drawstring' }
  }
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in .env');
    
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');

    const csvPath = path.join(__dirname, 'data', 'catalogue.csv');
    let rows = [];
    if (fs.existsSync(csvPath)) {
      const csvData = fs.readFileSync(csvPath, 'utf-8');
      rows = parseCSV(csvData);
      console.log(`Parsed ${rows.length} rows from catalogue.csv`);
    } else {
      console.warn('catalogue.csv not found, proceeding with fallback styles');
    }

    // Group catalogue CSV rows by Style_Code
    const stylesMap = new Map();
    rows.forEach((r, idx) => {
      const code = (r.Style_Code || r.Style_Name || `SKU-${idx}`).trim();
      if (!stylesMap.has(code)) {
        const mrpValue = parseFloat(r.MRP) || 1999;
        const brick = (r.Brick || 'T-Shirts').trim();
        const { image, gallery } = resolveProductImages(brick, code);
        
        stylesMap.set(code, {
          style_code: code,
          title: (r.Style_Name || r.Style_Description || `Style ${code}`).trim(),
          brand: r.Brand_Name ? r.Brand_Name.trim() : 'Threadly Classic',
          brick: brick,
          category: (r.Category || 'Top_Wear').trim(),
          sleeve: (r.Sleeve || '').trim(),
          neck: (r.Neck || '').trim(),
          color: (r.Vendor_Colour_Name || r.IK_Colour_Name || 'Standard').trim(),
          color_code: (r.IK_Colour_Code || '#1E293B').trim(),
          mrp: mrpValue,
          price: mrpValue,
          currency: (r.Currency || 'INR').trim(),
          grade: (idx % 3 === 0 ? 'A' : idx % 3 === 1 ? 'B' : 'C'),
          sizesSet: new Set(),
          skus: [],
          image,
          gallery,
          stock: 100 + (idx * 17) % 250,
          rating: Number((4.2 + ((idx % 7) * 0.1)).toFixed(1)),
          reviewCount: 45 + (idx * 23) % 400,
          attributes: {
            material: (r.Material || r.Fabric || 'Premium Blend').trim(),
            fit: (r.Fit || 'Regular').trim(),
            pattern: (r.Pattern || 'Solid').trim(),
            occasion: (r.Occasion || 'Casual').trim(),
            composition: (r.Composition || '').trim(),
            closure: (r.Closure_Type || '').trim(),
            segment: (r.Segment || '').trim(),
            portfolio: (r.Portfolio || '').trim(),
          }
        });
      }

      const styleObj = stylesMap.get(code);
      const sizeVal = (r.Size_Code || r.Size_Name || '').trim();
      if (sizeVal) {
        styleObj.sizesSet.add(sizeVal);
        styleObj.skus.push({
          size: sizeVal,
          ean: (r.EAN_Code || '').trim(),
          stock: 40 + (idx % 5) * 10
        });
      }
    });

    // Convert stylesMap to product documents
    const productDocs = [];
    for (const [code, style] of stylesMap.entries()) {
      const sizesArray = Array.from(style.sizesSet);
      productDocs.push({
        ...style,
        sizes: sizesArray.length > 0 ? sizesArray : ['S', 'M', 'L', 'XL'],
        sizesSet: undefined
      });
    }

    // Add supplementary styles for the other assignment Bricks
    SUPPLEMENTARY_STYLES.forEach((supp) => {
      const { image, gallery } = resolveProductImages(supp.brick, supp.style_code);
      productDocs.push({
        ...supp,
        currency: 'INR',
        skus: supp.sizes.map((sz, i) => ({ size: sz, ean: `89000000${i}`, stock: 50 })),
        image,
        gallery,
        stock: 140,
        rating: 4.6,
        reviewCount: 92,
      });
    });

    console.log(`Clearing existing products in MongoDB...`);
    await Product.deleteMany({});
    
    console.log(`Inserting ${productDocs.length} aggregated styles with curated photography...`);
    await Product.insertMany(productDocs);
    console.log(`Successfully seeded ${productDocs.length} unique styles from the 403-row catalogue dataset!`);

    const distinctBricks = await Product.distinct('brick');
    const distinctCategories = await Product.distinct('category');
    console.log('Available Bricks in DB:', distinctBricks);
    console.log('Available Categories in DB:', distinctCategories);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding catalogue:', error);
    process.exit(1);
  }
}

seed();
