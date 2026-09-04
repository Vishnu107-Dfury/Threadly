const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  grade: {
    type: String,
    index: true,
  },
  brick: {
    type: String,
    index: true,
  },
  category: {
    type: String,
    index: true,
  },
  sizes: {
    type: [String],
    default: []
  },
  attributes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  strict: false // Allow unknown fields since we are connecting to an existing collection
});

// If the collection is named 'products', mongoose will automatically map to it.
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
