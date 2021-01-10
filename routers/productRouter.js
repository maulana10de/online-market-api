const express = require('express');
const router = express.Router();
const { productController } = require('../controllers');

// get method
router.get('/', productController.getProducts);
router.post('/', productController.addProduct);
router.post('/addMulti', productController.multipleInsert);

module.exports = router;
