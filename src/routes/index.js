const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const vendorRoute = require('./vendor.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/vendors',
    route: vendorRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
