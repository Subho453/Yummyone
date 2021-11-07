const httpStatus = require('http-status');
const { Food, Cuisine, Category, Vendor } = require('../models');
const ApiError = require('../utils/ApiError');
const remove = require('../utils/remove');

const addFoodItem = async (payload) => {
  const vendor = await Vendor.findById(payload.vendor);
  const category = await Category.findById(payload.category);
  const cuisine = await Cuisine.findById(payload.cuisine);
  if (!vendor) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vendor doesn't exists");
  } else if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category doesn't exists");
  } else if (!cuisine) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cuisine doesn't exists");
  }
  return Food.create(payload);
};

const getFoods = async (options) => {
  const limit = options.limit;
  const skip = (options.page - 1) * limit;
  const filter = { ...options };
  ['limit', 'page', 'sortBy'].forEach((ele) => delete filter[ele]);
  let sortBy = 'createdAt';
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push((order === 'desc' ? '-' : '') + key);
    });
    sortBy = sortingCriteria.join(' ');
  }
  const totalResults = await Food.countDocuments(filter).exec();
  const foods = await Food.find(filter).sort(sortBy).skip(skip).limit(limit);
  const totalPages = Math.ceil(totalResults / limit);
  return {
    totalCount: totalResults,
    totalPages,
    limit,
    foods,
  };
};

const getFoodById = async (id) => {
  const food = await Food.findById(id);
  if (!food) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Food not found');
  }
  return food;
};

const updateFood = async (id, updateBody) => {
  const food = await Food.findById(id);
  if (!food) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Food not found');
  }
  Object.assign(food, updateBody);
  await food.save();
  return food;
};

const deleteFood = async (id) => {
  const food = await Food.findById(id);
  if (!food) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Food not found');
  }
  await food.remove();
  return food;
};

module.exports = {
  addFoodItem,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
};
