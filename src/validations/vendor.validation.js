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
    vendorId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

const getMenu = {
  params: Joi.object().keys({
    vendorId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
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
        // docs: Joi.array().max(3).required(),
        number: Joi.string().required(),
      }),
      panCard: Joi.object().keys({
        // docs: Joi.array().max(3).required(),
        number: Joi.string().required(),
      }),
      fssai: Joi.object().keys({
        // docs: Joi.array().max(3).required(),
        number: Joi.string().required(),
      }),
      gst: Joi.object().keys({
        // docs: Joi.array().max(3).required(),
        number: Joi.string().required(),
      }),
      certificate: Joi.object().keys({
        docs: Joi.array().max(3).required(),
        number: Joi.string().required(),
      }),
      storeFront: Joi.object().keys({
        docs: Joi.array().max(3).required(),
      }),
      bankInfo: Joi.object().keys({
        // docs: Joi.array().max(3).required(),
        number: Joi.string().required(),
        acc_name: Joi.string().required(),
        branch_name: Joi.string(),
        branch_address: Joi.string(),
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
    types: Joi.string().valid('aadharCard', 'panCard', 'fssai', 'gst', 'bankInfo'),
  }),
};

const fssaiVerify = {
  body: Joi.object().keys({
    registration_no: Joi.string()
      .regex(/^[0-9]{14}$/)
      .required(),
  }),
};
const aadharOtpRequest = {
  body: Joi.object().keys({
    aadhaar_number: Joi.string()
      .regex(/^[0-9]{12}$/)
      .required(),
  }),
};
const aadharOtpVerify = {
  body: Joi.object().keys({
    request_id: Joi.string().required(),
    otp: Joi.string()
      .regex(/^[0-9]{6}$/)
      .required(),
  }),
};

const gstVerify = {
  params: Joi.object().keys({
    gst: Joi.string()
      .regex(/^[0-9A-Z]{15}$/)
      .required(),
  }),
};

const bankVerify = {
  query: Joi.object().keys({
    number: Joi.string().required(),
    ifsc: Joi.string()
      .required()
      .regex(/^[A-Z0-9]{11}$/),
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
  fssaiVerify,
  aadharOtpRequest,
  aadharOtpVerify,
  gstVerify,
  bankVerify,
  getMenu,
};
