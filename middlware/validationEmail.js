const Joi = require('joi');

const validationEmail = (req, res, next) => {
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
};

module.exports = validationEmail;
