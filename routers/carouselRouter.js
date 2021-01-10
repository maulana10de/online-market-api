const express = require('express');
const router = express.Router();
const { carouselController } = require('../controllers');

// get method
router.get('/', carouselController.getCarousel);
router.post('/', carouselController.addCarousel);
router.delete('/delete/:id', carouselController.deleteCarousel);
router.patch('/update/:id', carouselController.updateCarousel);

module.exports = router;
