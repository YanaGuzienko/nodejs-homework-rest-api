const express = require('express');
const { verify, reVerify } = require('../../controller/verify');
const validationEmail = require('../../middlware/validationEmail');

const router = express.Router();

router.get('/:verificationToken', verify);
router.post('/', validationEmail, reVerify);

module.exports = router;
