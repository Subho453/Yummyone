const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const cuisineValidation = require('../../validations/cuisine.validation');
const cuisineController = require('../../controllers/cuisine.controller');

const router = express.Router();

router.route('/add').post(auth('admin', 'master'), validate(cuisineValidation.addCuisine), cuisineController.addCuisine);

router
  .route('/all')
  .get(auth('vendor', 'admin', 'master'), validate(cuisineValidation.getCuisines), cuisineController.getCuisines);

router
  .route('/:id')
  .get(auth('admin', 'master'), validate(cuisineValidation.getCuisineById), cuisineController.getCuisineById)
  .patch(auth('admin', 'master'), validate(cuisineValidation.updateCuisine), cuisineController.updateCuisine)
  .delete(auth('admin', 'master'), validate(cuisineValidation.deleteCuisine), cuisineController.deleteCuisine);

module.exports = router;
