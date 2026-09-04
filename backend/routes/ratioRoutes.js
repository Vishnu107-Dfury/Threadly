const express = require('express');
const { getRatios, getRatioById, createRatio, updateRatio, deleteRatio } = require('../controllers/ratioController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getRatios)
  .post(protect, createRatio);

router.route('/:id')
  .get(protect, getRatioById)
  .put(protect, updateRatio)
  .delete(protect, deleteRatio);

module.exports = router;
