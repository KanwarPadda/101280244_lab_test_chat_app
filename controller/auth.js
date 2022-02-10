const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");

exports.registerUser = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, username, password } = req.body;
  
    const emailExists = await User.findOne({ username });
  
    if (emailExists) {
      res.status(400);
      throw new Error("A user with that email already exists");
    }
  
    const user = await User.create({
      firstName,
      lastName,
      username,
      password,
    });
  
    if (user) {
      const token = generateToken(user._id);
      const secondsInWeek = 604800;
  
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: secondsInWeek * 1000
      });
  
      res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isDogSitter: user.isDogSitter,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
});

exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    const user = 
      await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      const secondsInWeek = 604800;
  
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: secondsInWeek * 1000
      });
  
      res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
});


exports.logoutUser = asyncHandler(async (req, res, next) => {
    res.clearCookie("token");
  
    res.send("You have successfully logged out");
  });
  
