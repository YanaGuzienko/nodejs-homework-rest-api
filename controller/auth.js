const User = require('../model/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registration = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const getUser = await User.findOne({ email: email });

    if (getUser) {
      res.status(409).json({
        status: 'conflict',
        code: 409,
        ResponseBody: {
          message: 'Email in use',
        },
      });
      return;
    }
    const newUser = new User({ email });

    newUser.setPassword(password);
    newUser.save();
    // const createUser = await User.create({ email, password });
    res.status(201).json({
      Status: 'Created',
      code: 201,
      ResponseBody: {
        user: {
          email: email,
          subscription: 'starter',
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ password });

  try {
    const user = await User.findOne({ email });
    if (!user || newUser.comparePassword(password)) {
      res.status(401).json({
        status: 'Unauthorized',
        code: 401,
        message: 'Email or password is wrong',
      });
      return;
    }
    const { SECRET_KEY } = process.env;
    const payload = {
      id: user._id,
    };
    console.log(user._id);

    const token = jwt.sign(payload, SECRET_KEY);
    if (user.token) {
      return res.status(200).json({
        message: 'You already get token',
      });
    }
    await User.findOneAndUpdate({ _id: user._id }, { token: token }, { new: true });
    res.status(200).json({
      status: 'ok',
      code: 200,
      token: token,
      user: {
        email: email,
        subscription: 'starter',
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  const user = req.user;

  try {
    const userUpdate = await User.findOneAndUpdate({ _id: user.id }, { token: null }, { new: true });
    console.log(userUpdate);
    if (!userUpdate) {
      return res.status(401).json({
        code: 401,
        message: 'Not authorized',
      });
    }
    res.status(204).json({
      status: 'No Content',
      code: 204,
      message: 'No content',
    });
  } catch (error) {
    console.log(error);
  }
};

const getCurrent = async (req, res) => {
  const user = req.user;

  try {
    const result = await User.findOne({ _id: user.id });
    if (!result) {
      return res.status(401).json({
        status: 'Unauthorized',
        code: 401,
        message: 'Not authorized',
      });
    }
    res.status(200).json({
      status: 'ok',
      email: result.email,
      subscription: 'starter',
    });

    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registration, login, logout, getCurrent };
