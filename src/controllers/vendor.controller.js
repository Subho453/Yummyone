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

const login = catchAsync(async (req, res) => {
  const mobile = '+' + req.query.code + req.query.mobile;
  const vendor = await vendorService.getVendorByMobile(mobile);
  const tokens = await tokenService.generateAuthTokens(vendor);
  res.send({ vendor, tokens });
});

const updateVendor = catchAsync(async (req, res) => {
  const result = await vendorService.updateVendorById(req.params.vendorId, req.body);
  res.send({ message: 'Vendor details updated', result });
});

const deleteVendor = catchAsync(async (req, res) => {
  await vendorService.deleteVendorById(req.params.vendorId);
  res.send({ message: 'Vendor deleted' });
});

const submitDocuments = catchAsync(async (req, res) => {
  const docs = await vendorService.submitDocuments(req.params.vendorId, req.body);
  res.status(httpStatus.CREATED).send(docs);
});

const updateDocument = catchAsync(async (req, res) => {
  const result = await vendorService.updateDocument(req.params.vendorId, req.query.type, req.body);
  res.send({ message: 'Vendor document updated', result });
});

const getDocuments = catchAsync(async (req, res) => {
  const results = await vendorService.getDocuments(req.params.vendorId, req.query.types);
  res.send(results);
});

module.exports = {
  create,
  login,
  getVendors,
  getVendor,
  updateVendor,
  deleteVendor,
  submitDocuments,
  updateDocument,
  getDocuments,
};
