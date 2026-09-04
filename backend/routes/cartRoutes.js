const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .delete(protect, clearCart);
  
router.route('/items')
  .post(protect, addToCart);

router.route('/items/:productId')
  .delete(protect, removeFromCart);

module.exports = router;
