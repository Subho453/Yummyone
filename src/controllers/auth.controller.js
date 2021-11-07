const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService } = require('../services');

const register = catchAsync(async (req, res) => {
  const admin = await authService.createAdmin(req.body);
  const tokens = await tokenService.generateAuthTokens(admin);
  res.status(httpStatus.CREATED).send({
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      is_active: admin.is_active,
    },
    tokens,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const admin = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(admin);
  res.send({
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      is_active: admin.is_active,
    },
    tokens,
  });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.send({ message: 'Logged out Successfully' });
});

const refreshTokens = catchAsync(async (req, res) => {
  const data = await authService.refreshAuth(req.body.refreshToken);
  const admin = data.user;
  res.send({
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      is_active: admin.is_active,
    },
    tokens: data.tokens,
  });
});

const loginCheck = catchAsync(async (req, res) => {
  const admin = req.user;
  res.send({
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      is_active: admin.is_active,
    },
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  loginCheck,
};
