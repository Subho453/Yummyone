const express = require('express');
const httpStatus = require('http-status');
const adminRoute = require('./auth.routes');
const docsRoute = require('./docs.routes');
const vendorRoute = require('./vendor.routes');
const foodRouteV1 = require('./food/v1.routes');
const categoryRouteV1 = require('./category/v1.routes');
const cuisineRouteV1 = require('./cuisine/v1.routes');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/admin/v1',
    route: adminRoute,
  },
  {
    path: '/vendors/v1',
    route: vendorRoute,
  },
  {
    path: '/foods/v1',
    route: foodRouteV1,
  },
  {
    path: '/category/v1',
    route: categoryRouteV1,
  },
  {
    path: '/cuisines/v1',
    route: cuisineRouteV1,
  },
];

defaultRoutes.forEach((route) => {
  router.use(
    route.path,
    (req, res, next) => {
      if (!req.headers['api-key'] && route.path !== '/docs') {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Please enter Api-key'));
      } else if (req.headers['api-key'] !== config.apikey && route.path !== '/docs') {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Please enter a valid Api-key'));
      } else {
        next();
      }
    },
    route.route
  );
});

module.exports = router;
