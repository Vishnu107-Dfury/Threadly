const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/auth/sync
// @desc    Sync Firebase user with MongoDB
// @access  Private
router.post('/sync', protect, async (req, res) => {
  try {
    // req.user is set in authMiddleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error during auth sync' });
  }
});

module.exports = router;
