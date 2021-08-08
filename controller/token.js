const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  const [, token] = authorization?.split(' ');
  if (!token) {
    return res.status(400).json({
      status: 'Unauthorized',
      code: 401,
      message: 'Not authorized',
    });
  }

  try {
    const { SECRET_KEY } = process.env;
    const result = jwt.verify(token, SECRET_KEY);

    const user = jwt.decode(token);

    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({
      status: 'Unauthorized',
      code: 401,
      message: 'Not authorized',
    });
  }
};

module.exports = getAuth;
