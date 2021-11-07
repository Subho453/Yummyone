const httpStatus = require('http-status');
const { Cuisine } = require('../models');
const ApiError = require('../utils/ApiError');

const addCuisine = async (payload) => {
  const cuisine = await Cuisine.findOne({ name: payload.name });
  if (!!cuisine) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cuisine already exists');
  }
  return Cuisine.create(payload);
};

const getCuisines = async (options) => {
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
  let query = Cuisine.find(filter).sort(sortBy);
  const data = {};
  const totalResults = await Cuisine.countDocuments(filter).exec();
  data['totalCount'] = totalResults;
  if (options.page && options.limit) {
    const skip = (options.page - 1) * options.limit;
    query = query.skip(skip);
  }
  if (options.limit) {
    const limit = options.limit;
    query = query.limit(limit);
    data['totalPages'] = Math.ceil(totalResults / limit);
    data['limit'] = limit;
  }
  const cuisines = await query;
  return {
    ...data,
    cuisines,
  };
};

const getCuisineById = async (id) => {
  const Cuisine = await Cuisine.findById(id);
  if (!Cuisine) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cuisine not found');
  }
  return Cuisine;
};

const updateCuisine = async (id, updateBody) => {
  const Cuisine = await Cuisine.findById(id);
  if (!Cuisine) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cuisine not found');
  }
  Object.assign(Cuisine, updateBody);
  await Cuisine.save();
  return Cuisine;
};

const deleteCuisine = async (id) => {
  const Cuisine = await Cuisine.findById(id);
  if (!Cuisine) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cuisine not found');
  }
  await Cuisine.remove();
  return Cuisine;
};

module.exports = {
  addCuisine,
  getCuisines,
  getCuisineById,
  updateCuisine,
  deleteCuisine,
};
