const Joi = require('joi');

const addCategory = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    image: Joi.string(),
    vendor: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),

    is_active: Joi.boolean(),
  }),
};

const getCategories = {
  query: Joi.object()
    .keys({
      name: Joi.string().trim(),
      vendor: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .min(1),
};

const getCategoryById = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const deleteCategory = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required().trim(),
      image: Joi.string(),
      vendor: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      is_active: Joi.boolean(),
    })
    .min(1),
};

module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
