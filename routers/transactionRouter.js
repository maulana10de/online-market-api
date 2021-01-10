const express = require('express');
const router = express.Router();
const { transactionController } = require('../controllers');
const { readToken } = require('../helper/readToken');

// get method
// router.post('/', transactionController.postDataToTransaction);
router.post('/', transactionController.addTransaction);
router.get('/', readToken, transactionController.getTransaction);
router.patch('/:idtransaction', transactionController.updateStatusTransaction);

module.exports = router;
