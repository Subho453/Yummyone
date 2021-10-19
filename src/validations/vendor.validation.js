const Joi = require('joi');
const { vendorTypes } = require('../config/vendorTypes');

const createVendor = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    type: Joi.string().required().valid('restaurant', 'fastFood', 'homemade', 'grocery'),
    mobile: Joi.string()
      .required()
      .regex(/^(\+\d{1,3})\d{10}$/),
    city: Joi.string(),
    state: Joi.string(),
    address: Joi.string().required(),
    open_time: Joi.string()
      .required()
      .regex(/^([0-9]{2})\:([0-9]{2})$/),
    close_time: Joi.string()
      .required()
      .regex(/^([0-9]{2})\:([0-9]{2})$/),
    commission: Joi.number().precision(2),
  }),
};

const getVendors = {
  query: Joi.object().keys({
    type: Joi.string().valid('restaurant', 'fastFood', 'homemade', 'grocery'),
    sortBy: Joi.string(),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer(),
  }),
};

const getVendor = {
  params: Joi.object().keys({
    vendorId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const updateVendor = {
  params: Joi.object().keys({
    vendorId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      mobile: Joi.string(),
      type: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      address: Joi.string(),
      open_time: Joi.string(),
      close_time: Joi.string(),
      commission: Joi.number().precision(2),
      is_active: Joi.boolean(),
      is_online: Joi.boolean(),
    })
    .min(1),
};

const deleteVendor = {
  params: Joi.object().keys({
    vendorId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

module.exports = {
  createVendor,
  getVendors,
  getVendor,
  updateVendor,
  deleteVendor,
};
