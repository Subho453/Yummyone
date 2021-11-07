const Joi = require('joi');

const addFood = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    type: Joi.string().required(),
    image: Joi.string(),
    mrp: Joi.number().precision(2).required(),
    price: Joi.number().precision(2).required(),
    vendor: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    category: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    cuisine: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    portions: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        price: Joi.number().precision(2).required(),
      })
    ),
    addons: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        price: Joi.number().precision(2).required(),
      })
    ),
  }),
};

const getFoods = {
  query: Joi.object().keys({
    type: Joi.string(),
    vendor: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    cuisine: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    sortBy: Joi.string(),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  }),
};

const getFoodById = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const deleteFood = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const updateFood = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required().trim(),
      description: Joi.string().required().trim(),
      type: Joi.string().required(),
      image: Joi.string(),
      mrp: Joi.number().precision(2).required(),
      price: Joi.number().precision(2).required(),
      vendor: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      category: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      cuisine: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      portions: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          price: Joi.number().precision(2).required(),
        })
      ),
      addons: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          price: Joi.number().precision(2).required(),
        })
      ),
      is_active: Joi.boolean(),
    })
    .min(1),
};

module.exports = {
  addFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
};
