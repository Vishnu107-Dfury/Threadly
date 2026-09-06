const express = require('express');
const multer = require('multer');
const { getProducts, getProductMeta, getProductById, uploadCatalogue } = require('../controllers/productController');
const { optionalProtect, protect } = require('../middleware/authMiddleware');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

router.route('/')
  .get(optionalProtect, getProducts);

router.route('/meta')
  .get(optionalProtect, getProductMeta);

router.route('/upload')
  .post(protect, upload.single('file'), uploadCatalogue);

router.route('/:id')
  .get(optionalProtect, getProductById);

module.exports = router;
