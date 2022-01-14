const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Vendor, VendorDocs, Food, Category } = require('../models');
const ApiError = require('../utils/ApiError');
const remove = require('../utils/remove');
const config = require('../config/config');
const axios = require('axios');

const ObjectId = mongoose.Types.ObjectId;

const zoopRequest = axios.create({
  baseURL: config.zoop.endpoint,
  headers: {
    'api-key': config.zoop.apiKey,
    'app-id': config.zoop.appId,
  },
  timeout: 90000,
});

const createVendor = async (vendorBody) => {
  if ((await Vendor.isEmailTaken(vendorBody.email)) || (await Vendor.isMobileExist(vendorBody.mobile))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Vendor already exists');
  }
  return Vendor.create(vendorBody);
};

const getVendors = async (options) => {
  const filter = { type: options.type };
  let sortBy = 'createdAt';
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push((order === 'desc' ? '-' : '') + key);
    });
    sortBy = sortingCriteria.join(' ');
  }
  const totalResults = await Vendor.countDocuments(filter).exec();
  const data = {};
  let query = Vendor.find(filter).sort(sortBy);
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
  const vendors = await query;
  return {
    ...data,
    vendors: vendors.map((ele, i) => ({
      key: i + 1,
      id: ele.id,
      name: ele.name,
      email: ele.email,
      mobile: ele.mobile,
      is_online: ele.is_online,
      is_active: ele.is_active,
    })),
  };
};

const getVendorById = async (id) => {
  const vendor = await Vendor.findById(id);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  return vendor;
};

const getMenu = async (id) => {
  const vendor = await getVendorById(id);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  const categories = await Category.aggregate([
    { $match: { vendor: ObjectId(id), is_active: true } },
    { $project: { image: 1, name: 1 } },
  ]);
  const result = categories.map(async (item) => ({
    ...item,
    foods: await Food.aggregate([
      { $match: { category: ObjectId(item._id), is_active: true } },
      { $project: { __v: 0, createdAt: 0, updatedAt: 0 } },
    ]),
  }));
  const res = await Promise.all(result);
  return res;
};

const getVendorByMobile = async (mobile) => {
  const vendor = await Vendor.findOne({ mobile });
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  return vendor;
};

const updateVendorById = async (vendorId, updateBody) => {
  const vendor = await getVendorById(vendorId);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  if (updateBody.email && (await Vendor.isEmailTaken(updateBody.email, vendorId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist');
  }
  if (updateBody.mobile && (await Vendor.isMobileExist(updateBody.mobile, vendorId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile Number already exist');
  }
  Object.assign(vendor, updateBody);
  await vendor.save();
  return vendor;
};

const deleteVendorById = async (vendorId) => {
  const vendor = await getVendorById(vendorId);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  await vendor.remove();
  return vendor;
};

const getDocuments = async (vendor, types = []) => {
  let docs;
  if (types.length > 0) {
    docs = await VendorDocs.find({ vendor, type: { $in: types.split(',') } });
  } else {
    docs = await VendorDocs.find({ vendor });
  }
  return remove(docs, ['_id', 'vendorId', '__v', 'createdAt', 'updatedAt']);
};

const submitDocuments = async (vendorId, payload) => {
  const vendor = await getVendorById(vendorId);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  const insert = [];
  const upload = [];
  const promise = Object.keys(payload).map(async (type) => {
    const vendordoc = await VendorDocs.isDocExist(vendorId, type);
    if (!!vendordoc) {
      Object.assign(vendordoc, { ...payload[type], status: 'approved', comments: '' });
      await vendordoc.save();
      upload.push(vendordoc);
    } else {
      const data = {
        vendor: vendorId,
        type,
        status: 'approved',
        ...payload[type],
      };
      insert.push(data);
    }
  });
  await Promise.all(promise);
  let result = {};
  if (insert.length > 0) {
    const values = await VendorDocs.insertMany(insert);
    result = remove(values, ['_id', 'vendor', '__v', 'createdAt', 'updatedAt']);
  }
  if (upload.length > 0) {
    result = { ...result, ...remove(upload, ['_id', 'vendor', '__v', 'createdAt', 'updatedAt']) };
  }
  return result;
};

const updateDocument = async (vendorId, type, payload) => {
  const vendordoc = await VendorDocs.isDocExist(vendorId, type);
  if (!vendordoc) {
    throw new ApiError(httpStatus.NOT_FOUND, `Vendor ${type} not found`);
  }
  Object.assign(vendordoc, payload);
  await vendordoc.save();
  return vendordoc;
};

const fssaiVerify = async (data) => {
  const options = {
    method: 'POST',
    url: 'https://verification-solutions.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_fssai',
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-host': 'verification-solutions.p.rapidapi.com',
      'x-rapidapi-key': 'a4aa9525d5mshe2c9d76bf35e572p105448jsnb4c612a14aa5',
    },
    data: {
      task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1',
      group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e',
      data: data,
    },
  };
  const response = await axios(options);
  if (response.status === 200) {
    if (response.data.result.source_output.status === 'id_not_found') {
      throw new ApiError(httpStatus.NOT_FOUND, `Fssai Number not found`);
    }
    return response.data.result.source_output.company_details;
  } else {
    throw new ApiError(response.status);
  }
};

const aadharOtpRequest = async (aadhar) => {
  try {
    const response = await zoopRequest.post('/in/identity/okyc/otp/request', {
      data: {
        customer_aadhaar_number: aadhar,
        consent: 'Y',
        consent_text: 'I hear by declare my consent agreement for fetching my information via ZOOP API.',
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const aadharOtpVerify = async (id, otp) => {
  try {
    const response = await zoopRequest.post('/in/identity/okyc/otp/verify', {
      data: {
        request_id: id,
        otp: otp,
        consent: 'Y',
        consent_text: 'I hear by declare my consent agreement for fetching my information via ZOOP API.',
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const gstVerify = async (gst) => {
  try {
    const response = await zoopRequest.post('/api/v1/in/merchant/gstin/lite', {
      data: {
        business_gstin_number: gst,
        consent: 'Y',
        consent_text: 'I hear by declare my consent agreement for fetching my information via ZOOP API',
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const bankVerify = async (accNumber, ifsc) => {
  console.log(accNumber, ifsc);
  try {
    const response = await zoopRequest.post('/api/v1/in/financial/bav/lite', {
      data: {
        account_number: accNumber,
        ifsc: ifsc,
        consent: 'Y',
        consent_text: 'I hear by declare my consent agreement for fetching my information via ZOOP API',
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  getVendorByMobile,
  updateVendorById,
  deleteVendorById,
  submitDocuments,
  getDocuments,
  updateDocument,
  fssaiVerify,
  aadharOtpRequest,
  aadharOtpVerify,
  gstVerify,
  bankVerify,
  getMenu,
};
