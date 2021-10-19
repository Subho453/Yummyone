const httpStatus = require('http-status');
const { Vendor } = require('../models');
const ApiError = require('../utils/ApiError');

const createVendor = async (vendorBody) => {
  if ((await Vendor.isEmailTaken(vendorBody.email)) || (await Vendor.isEmailTaken(vendorBody.mobile))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Vendor already exists');
  }
  return Vendor.create(vendorBody);
};

const getVendors = async (options) => {
  const limit = options.limit;
  const filter = { type: options.type };
  const skip = (options.page - 1) * limit;
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
  const vendors = await Vendor.find(filter).sort(sortBy).skip(skip).limit(limit);
  const totalPages = Math.ceil(totalResults / limit);
  return {
    count: totalResults,
    totalPages,
    page: options.page,
    limit,
    vendors: vendors.map((ele) => ({
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

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendorById,
  deleteVendorById,
};
