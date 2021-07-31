const express = require('express');
const Joi = require('joi');

const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
} = require('../../controller/contacts');

router.get('/', listContacts);

router.get('/:contactId', getContactById);

router.delete('/:contactId', validateParamsDel, removeContact);

router.post('/', validateParamsAdd, addContact);

router.put('/:contactId', validateParamsUpdate, updateContact);

router.patch('/:contactId/favorite', validateParamsFavorite, updateStatusContact);

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

function validateParamsFavorite(req, res, next) {
  const validateParam = Joi.object({
    favorite: Joi.boolean().required(),
  });

  const validationResult = validateParam.validate(req.body);

  if (validationResult.error) {
    res.status(400);
  }
  next();
}

module.exports = router;
