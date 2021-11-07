const httpStatus = require('http-status');
const { Vendor, VendorDocs } = require('../models');
const ApiError = require('../utils/ApiError');
const remove = require('../utils/remove');

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
  console.log(remove(docs, ['_id', 'vendorId', '__v', 'createdAt', 'updatedAt']));
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
      Object.assign(vendordoc, { ...payload[type], status: 'pending', comments: '' });
      await vendordoc.save();
      upload.push(vendordoc);
    } else {
      const data = {
        vendor: vendorId,
        type,
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
};
