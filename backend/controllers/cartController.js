const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.firebaseUid }).populate('items.productId');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user.firebaseUid, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.user.firebaseUid });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.firebaseUid, items: [] });
    }

    // Check if already in cart
    const alreadyExists = cart.items.find(item => item.productId.toString() === productId);
    
    if (!alreadyExists) {
      cart.items.push({ productId });
      await cart.save();
    }
    
    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.firebaseUid });
    if (cart) {
      cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('items.productId');
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.firebaseUid });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
