const Joi = require('joi');
const { vendorTypes } = require('../config/vendorTypes');

const createVendor = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    type: Joi.string()
      .required()
      .valid(vendorTypes.RESTAURANT, vendorTypes.FAST_FOOD, vendorTypes.HOMEMADE, vendorTypes.GROCERY),
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

const login = {
  query: Joi.object().keys({
    code: Joi.string()
      .required()
      .regex(/^\d{1,3}$/),
    mobile: Joi.string()
      .required()
      .regex(/^\d{10}$/),
  }),
};

const getVendors = {
  query: Joi.object().keys({
    type: Joi.string().required().valid('restaurant', 'fastFood', 'homemade', 'grocery'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer().default(1),
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

const submitDocuments = {
  params: Joi.object().keys({
    vendorId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  body: Joi.object()
    .keys({
      aadharCard: Joi.object().keys({
        docs: Joi.array().max(3).required(),
        number: Joi.number().required(),
      }),
      panCard: Joi.object().keys({
        docs: Joi.array().max(3).required(),
        number: Joi.number().required(),
      }),
      fssai: Joi.object().keys({
        docs: Joi.array().max(3).required(),
        number: Joi.number().required(),
      }),
      gst: Joi.object().keys({
        docs: Joi.array().max(3).required(),
        number: Joi.number().required(),
      }),
      certificate: Joi.object().keys({
        docs: Joi.array().max(3).required(),
        number: Joi.number().required(),
      }),
      storeFront: Joi.object().keys({
        docs: Joi.array().max(3).required(),
      }),
      bankInfo: Joi.object().keys({
        docs: Joi.array().max(3).required(),
        number: Joi.number().required(),
        acc_name: Joi.string().required(),
        branch_name: Joi.string().required(),
        branch_address: Joi.string().required(),
        ifsc: Joi.string()
          .required()
          .regex(/^[A-Z0-9]{11}$/),
      }),
    })
    .min(1),
};

const updateDocument = {
  params: Joi.object().keys({
    vendorId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  query: Joi.object()
    .keys({
      type: Joi.string().required(),
    })
    .required(),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('pending', 'rejected', 'approved'),
      comments: Joi.string().trim(),
    })
    .min(1),
};

const getDocuments = {
  params: Joi.object().keys({
    vendorId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  query: Joi.object().keys({
    types: Joi.string(),
  }),
};

module.exports = {
  createVendor,
  login,
  getVendors,
  getVendor,
  updateVendor,
  deleteVendor,
  submitDocuments,
  updateDocument,
  getDocuments,
};
