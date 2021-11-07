const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const addCategory = catchAsync(async (req, res) => {
  const food = await categoryService.addCategory(req.body);
  res.status(httpStatus.CREATED).send(food);
});

const getCategories = catchAsync(async (req, res) => {
  const result = await categoryService.getCategories(req.query);
  res.send(result);
});

const getCategoryById = catchAsync(async (req, res) => {
  const result = await categoryService.getCategoryById(req.params.id);
  res.send(result);
});

const updateCategory = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategory(req.params.id, req.body);
  res.send({ message: 'Category updated', result });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.send({ message: 'Category deleted' });
});

module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
