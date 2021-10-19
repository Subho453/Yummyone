const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const rfs = require('rotating-file-stream'); // version 2.x
const config = require('./config/config');
const { jwtStrategy } = require('./config/passport');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, '../log'),
});

// setup the logger
const errorResponseFormat = `:remote-addr - :method :url :status - :response-time ms - message: :message`;
morgan.token('message', (req, res) => res.locals.errorStack || '');
app.use(
  morgan(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: accessLogStream,
  })
);

// v1 api routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Welcome to Yummyone');
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
  app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
});
