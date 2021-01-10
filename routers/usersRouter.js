const express = require('express');
const router = express.Router();
const { usersController } = require('../controllers');
const { readToken } = require('../helper/readToken');

// get method
router.post('/regis', usersController.register);
router.get('/login', usersController.login);
router.get('/keepLogin', readToken, usersController.keepLogin);
router.get('/profile/:id', usersController.keepLogin);
router.patch('/verification', readToken, usersController.verification);
// router.get('/keepLogin/:id', readToken, usersController.keepLogin);

router.post('/addToCart', usersController.addToCart);
router.get('/getCart', readToken, usersController.getCart);
router.patch('/updateCartQty/:idcart', usersController.updateQtyInCart);
router.delete('/deleteCart/:idcart', usersController.deleteCart);
router.delete('/deleteMulti', usersController.deleteCartMultipleRow);

module.exports = router;
