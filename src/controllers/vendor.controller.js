const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { vendorService, tokenService } = require('../services');

const create = catchAsync(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);
  const tokens = await tokenService.generateAuthTokens(vendor);
  res.status(httpStatus.CREATED).send({ vendor, tokens });
});

const getVendors = catchAsync(async (req, res) => {
  const result = await vendorService.getVendors(req.query);
  res.send(result);
});

const getVendor = catchAsync(async (req, res) => {
  const result = await vendorService.getVendorById(req.params.vendorId);
  res.send(result);
});

const updateVendor = catchAsync(async (req, res) => {
  const result = await vendorService.updateVendorById(req.params.vendorId, req.body);
  res.send({ message: 'Vendor details updated', result });
});

const deleteVendor = catchAsync(async (req, res) => {
  await vendorService.deleteVendorById(req.params.vendorId);
  res.send({ message: 'Vendor deleted' });
});

module.exports = {
  create,
  getVendors,
  getVendor,
  updateVendor,
  deleteVendor,
};
