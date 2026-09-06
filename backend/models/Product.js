const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  style_code: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    index: true,
  },
  brand: {
    type: String,
    default: 'Threadly Signature',
    index: true,
  },
  brick: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  sleeve: {
    type: String,
    default: '',
    index: true,
  },
  neck: {
    type: String,
    default: '',
    index: true,
  },
  color: {
    type: String,
    default: 'Classic',
  },
  color_code: {
    type: String,
    default: '#1E293B',
  },
  mrp: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  grade: {
    type: String,
    default: 'A',
    index: true,
  },
  sizes: {
    type: [String],
    default: [],
  },
  skus: [{
    size: String,
    ean: String,
    stock: { type: Number, default: 50 },
  }],
  image: {
    type: String,
    required: true,
  },
  gallery: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    default: 120,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  reviewCount: {
    type: Number,
    default: 128,
  },
  attributes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  strict: false
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
