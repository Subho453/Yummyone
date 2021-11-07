const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const foodValidation = require('../../validations/food.validation');
const foodController = require('../../controllers/food.controller');

const router = express.Router();

router.route('/add').post(auth('vendor', 'admin', 'master'), validate(foodValidation.addFood), foodController.addFood);

router.route('/all').get(auth('vendor', 'admin', 'master'), validate(foodValidation.getFoods), foodController.getFoods);

router
  .route('/:id')
  .get(auth('vendor', 'admin', 'master'), validate(foodValidation.getFoodById), foodController.getFoodById)
  .patch(auth('vendor', 'admin', 'master'), validate(foodValidation.updateFood), foodController.updateFood)
  .delete(auth('vendor', 'admin', 'master'), validate(foodValidation.deleteFood), foodController.deleteFood);

module.exports = router;
