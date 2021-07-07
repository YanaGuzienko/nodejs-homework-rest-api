const express = require('express');
const Joi = require('joi');

const router = express.Router();
const shortid = require('shortid');

const { listContacts, getContactById, addContact, updateContact, removeContact } = require('../../model/index');

router.get('/', async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    code: 200,
    data: await listContacts(),
    message: 'Success',
  });
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;

  const findId = await getContactById(contactId);

  if (!findId) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: 'This user does not find',
    });
    return;
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    data: findId,
    message: 'Success',
  });
});

router.post('/', validateParamsAdd, async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: 'missing required name field',
    });
  } else {
    const newContact = {
      id: shortid.generate(),
      ...req.body,
    };
    addContact(newContact);
    res.status(201).json({
      status: 'success',
      code: 201,
      newContact,
    });
  }
});

router.delete('/:contactId', validateParamsDel, async (req, res, next) => {
  const { contactId } = req.params;
  const id = await removeContact(contactId);

  if (id === -1) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Not found',
    });
  } else {
    res.json({
      status: 'success',
      code: 200,
      message: 'contact deleted',
    });
  }
});

router.patch('/:contactId', validateParamsUpdate, async (req, res, next) => {
  const { contactId } = req.params;
  const { phone } = req.body;

  if (!req.body) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: 'missing fields',
    });
  } else if (isNaN(phone)) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: 'phone must be a numbers',
    });
  } else {
    const findId = await getContactById(contactId);

    if (!findId) {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: 'This user does not find',
      });
    } else {
      const contact = await updateContact(contactId, req.body);
      res.json({
        status: 'success',
        code: 200,
        data: contact,
      });
    }
  }
});

function validateParamsAdd(req, res, next) {
  const validateParam = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    phone: Joi.number().required(),
  });

  const validationResult = validateParam.validate(req.body);

  if (validationResult.error) {
    res.status(400);
  }
  next();
}

function validateParamsDel(req, res, next) {
  const validateParam = Joi.object({
    contactId: Joi.string().required(),
  });

  const validationResult = validateParam.validate(req.params);

  if (validationResult.error) {
    res.status(400);
  }
  next();
}

function validateParamsUpdate(req, res, next) {
  const validateParam = Joi.object({
    contactId: Joi.string().required(),
  });

  const validateParamBody = Joi.object({
    name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.number(),
  });

  const validationResult = validateParam.validate(req.params);

  const validationResultBody = validateParamBody.validate(req.body);

  if (validationResultBody.error || validationResult.error) {
    res.status(400);
  }
  next();
}

module.exports = router;
