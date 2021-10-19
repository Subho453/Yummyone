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
  servers: [
    {
      url: config.env === 'development' ? `http://localhost:${config.port}/api` : 'http://api.yummyone.online/api',
    },
  ],
};

module.exports = swaggerDef;
