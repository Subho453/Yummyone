const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const roleConfig = {
  master: ['managePayment'],
};

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  const hasRequiredRights = ['admin', 'master'].some((role) => role === user.role);
  if (!hasRequiredRights) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
  } else {
    const role = user.role;
    if (requiredRights.length > 0 && roleConfig[role].includes(requiredRights)) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (requiredRights) => async (req, res, next) =>
  new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));

module.exports = auth;
