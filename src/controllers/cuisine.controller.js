const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { cuisineService } = require('../services');

const addCuisine = catchAsync(async (req, res) => {
  const food = await cuisineService.addCuisine(req.body);
  res.status(httpStatus.CREATED).send(food);
});

const getCuisines = catchAsync(async (req, res) => {
  const result = await cuisineService.getCuisines(req.query);
  res.send(result);
});

const getCuisineById = catchAsync(async (req, res) => {
  const result = await cuisineService.getCuisineById(req.params.id);
  res.send(result);
});

const updateCuisine = catchAsync(async (req, res) => {
  const result = await cuisineService.updateCuisine(req.params.id, req.body);
  res.send({ message: 'Cuisine updated', result });
});

const deleteCuisine = catchAsync(async (req, res) => {
  await cuisineService.deleteCuisine(req.params.id);
  res.send({ message: 'Cuisine deleted' });
});

module.exports = {
  addCuisine,
  getCuisines,
  getCuisineById,
  updateCuisine,
  deleteCuisine,
};
