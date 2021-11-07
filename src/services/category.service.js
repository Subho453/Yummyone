const httpStatus = require('http-status');
const { Category, Vendor } = require('../models');
const ApiError = require('../utils/ApiError');

const addCategory = async (payload) => {
  const vendor = await Vendor.findById(payload.vendor);
  const category = await Category.find({ name: payload.name, vendor: payload.vendor });
  if (!vendor) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vendor doesn't exists");
  } else if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category already exists');
  }
  return Category.create(payload);
};

const getCategories = async (options) => {
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
  const totalResults = await Category.countDocuments(filter).exec();
  const data = {};
  let query = Category.find(filter).sort(sortBy);
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
  const categories = await query;
  return {
    ...data,
    categories,
  };
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

const updateCategory = async (id, updateBody) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.remove();
  return category;
};

module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
