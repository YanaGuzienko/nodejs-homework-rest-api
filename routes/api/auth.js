const express = require('express');

const { registration, login, logout, getCurrent } = require('../../controller/auth');
const getAuth = require('../../controller/token');
const { avatarUpdate } = require('../../controller/avatar');
const upLoadMiddleware = require('../../middlware/upLoadMiddleware');
const validationEmail = require('../../middlware/validationEmail');

const router = express.Router();

router.post('/signup', validationEmail, registration);
router.post('/login', validationEmail, login);
router.post('/logout', getAuth, logout);
router.get('/current', getAuth, getCurrent);
router.patch('/avatars', getAuth, upLoadMiddleware.single('avatar'), avatarUpdate);

module.exports = router;
