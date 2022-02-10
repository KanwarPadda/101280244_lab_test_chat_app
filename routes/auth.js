const express = require('express');
const router = express.Router();
const { validateRegister, validateLogin } = require('../validate');
const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controller/auth');

router.route('/register').post(validateRegister, registerUser);

router.route('/login').post(validateLogin, loginUser);

router.route('/logout').get(logoutUser);

module.exports = router;
