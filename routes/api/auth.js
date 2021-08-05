const express = require('express');
const Joi = require('joi');

const { registration, login, logout, getCurrent } = require('../../controller/auth');
const getAuth = require('../../controller/token');
const { avatarUpdate } = require('../../controller/avatar');
const upLoadMiddleware = require('../../middlware/upLoadMiddleware');

const router = express.Router();

router.post('/signup', validateParamsReg, registration);
router.post('/login', validateParamsReg, login);
router.post('/logout', getAuth, logout);
router.get('/current', getAuth, getCurrent);
router.patch('/avatars', getAuth, upLoadMiddleware.single('avatar'), avatarUpdate);

function validateParamsReg(req, res, next) {
  const validateParams = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: Joi.string().required(),
  });

  const validationResult = validateParams.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: validationResult.error,
    });
  }
  next();
}

module.exports = router;
