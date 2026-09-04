const express = require('express');
const { getProducts, getProductMeta, getProductById } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getProducts);
router.route('/meta').get(protect, getProductMeta);
router.route('/:id').get(protect, getProductById);

module.exports = router;
