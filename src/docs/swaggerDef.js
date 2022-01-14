const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'YummyOne API documentation',
    version,
    license: {
      name: 'MIT',
    },
  },
};

module.exports = swaggerDef;
