const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { foodService } = require('../services');

const addFood = catchAsync(async (req, res) => {
  const food = await foodService.addFoodItem(req.body);
  res.status(httpStatus.CREATED).send(food);
});

const getFoods = catchAsync(async (req, res) => {
  const result = await foodService.getFoods(req.query);
  res.send(result);
});

const getFoodById = catchAsync(async (req, res) => {
  const result = await foodService.getFoodById(req.params.id);
  res.send(result);
});

const updateFood = catchAsync(async (req, res) => {
  const result = await foodService.updateFood(req.params.id, req.body);
  res.send({ message: 'Food item updated', result });
});

const deleteFood = catchAsync(async (req, res) => {
  await foodService.deleteFood(req.params.id);
  res.send({ message: 'Food deleted' });
});

module.exports = {
  addFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
};
