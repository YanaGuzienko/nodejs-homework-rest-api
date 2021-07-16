const Contact = require('./contact');

const path = require('path');

const listContacts = async (req, res) => {
  try {
    const response = await Contact.find();
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Success',
      data: response,
    });
    return response;
  } catch (error) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Not Found',
    });
  }
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  try {
    const response = await Contact.findOne({ _id: contactId });

    if (!response) {
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
      data: response,
      message: 'Success',
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: 'This user does not find',
    });
  }
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;

  try {
    const response = await Contact.findOneAndDelete({ _id: contactId });

    res.json({
      status: 'success',
      code: 200,
      message: 'contact deleted',
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Not found',
    });
  }
};

const addContact = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    if (!name || !email || !phone) {
      res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing required name field',
      });
      return;
    }
    const response = await Contact.create(req.body);

    res.status(201).json({
      status: 'success',
      code: 201,
      data: response,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateContact = async (req, res) => {
  const id = req.params;

  try {
    if (!req.body) {
      res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing fields',
      });
      return;
    }

    const newContact = await Contact.findOneAndUpdate({ _id: id.contactId }, { ...req.body }, { new: true });
    res.status(200).json({
      status: 'success',
      cod: 200,
      data: newContact,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: 'This user does not find',
    });
  }
};

const updateStatusContact = async (req, res) => {
  const id = req.params;
  console.log(id);

  try {
    if (!req.body) {
      res.status(400).json({ message: 'missing field favorite' });
    }
    const newContact = await Contact.findOneAndUpdate({ _id: id.contactId }, { ...req.body }, { new: true });

    res.status(200).json({
      status: 'success',
      cod: 200,
      data: newContact,
    });
  } catch (error) {
    res.status(404).json({ message: 'Not found' });
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
