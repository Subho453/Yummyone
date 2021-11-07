const Joi = require('joi');

const addCuisine = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    is_active: Joi.boolean(),
  }),
};

const getCuisines = {
  query: Joi.object().keys({
    name: Joi.string().trim(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCuisineById = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const deleteCuisine = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const updateCuisine = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required().trim(),
      is_active: Joi.boolean(),
    })
    .min(1),
};

module.exports = {
  addCuisine,
  getCuisines,
  getCuisineById,
  updateCuisine,
  deleteCuisine,
};
