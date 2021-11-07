const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router
  .route('/add')
  .post(auth('vendor', 'admin', 'master'), validate(categoryValidation.addCategory), categoryController.addCategory);

router
  .route('/all')
  .get(auth('vendor', 'admin', 'master'), validate(categoryValidation.getCategories), categoryController.getCategories);

router
  .route('/:id')
  .get(auth('vendor', 'admin', 'master'), validate(categoryValidation.getCategoryById), categoryController.getCategoryById)
  .patch(auth('vendor', 'admin', 'master'), validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth('vendor', 'admin', 'master'), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;
