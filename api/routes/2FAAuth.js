const Express = require("express");
const AuthArmorSDK = require("autharmor-node-sdk");
const Bcrypt = require("bcrypt");
const User = require("../models/user");
const Router = Express.Router();

AuthArmorSDK.init({ clientId: "", clientSecret: "" });

Router.post("/basic/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username
    }).select("+password");

    if (!user) {
      throw {
        code: 404,
        field: "username",
        message: "Invalid username/password combination"
      };
    }

    const correctPassword = await Bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw {
        code: 404,
        field: "username",
        message: "Invalid username/password combination"
      };
    }

    req.session.pendingAuth = user;

    return user;
  } catch (err) {
    console.error(err);
    res.status(err.code).json(err);
  }
});

Router.post("/basic/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = User.findOne({
      username
    });

    if (existingUser) {
      throw {
        code: 403,
        field: "username",
        message: "Username is taken"
      };
    }

    if (!password || password.length < 8) {
      throw {
        code: 400,
        field: "password",
        message: "Password must be in between 8-32 characters"
      };
    }

    const salt = Bcrypt.genSalt();
    const encryptedPassword = await Bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      password: encryptedPassword
    });

    return user;
  } catch (err) {
    console.error(err);
    res.status(err.code).json(err);
  }
});

Router.post("/basic/confirmLogin", async (req, res) => {
  try {
    const { pendingAuth } = req.session;

    if (!pendingAuth) {
      throw {
        code: 404,
        field: "pendingAuth",
        message: "Please login before verifying 2fa"
      };
    }

    const user = await User.findById(pendingAuth._id);

    if (!user) {
      throw {
        code: 404,
        field: "pendingAuth",
        message: "An unknown error has occurred"
      };
    }

    await AuthArmorSDK.authenticate({
      nickname: user.nickname,
      action_name: "Login",
      short_msg: "Someone is trying to login to the sample demo"
    });

    req.session.user = user;

    return true;
  } catch (err) {
    console.error(err);
    res.status(err.code).json(err);
  }
});

module.exports = Router;
