const fs = require('fs/promises');

const path = require('path');
const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  try {
    const response = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(response);
    return contacts;
  } catch (error) {
    return error;
  }
};

const getContactById = async (contactId) => {
  try {
    const response = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(response);
    const contactById = contacts.find((item) => item.id.toString() === contactId);

    return contactById;
  } catch (error) {
    return error;
  }
};

const removeContact = async (contactId) => {
  try {
    console.log(typeof contactId);
    const response = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(response);
    const correctId = contacts.findIndex((item) => item.id.toString() === contactId);
    console.log(correctId);
    if (correctId === -1) {
      console.log('Id is not correct');
    } else {
      const deleteContact = contacts.filter((item) => item.id.toString() !== contactId);
      const newContacts = JSON.stringify(deleteContact);
      await fs.writeFile(contactsPath, newContacts);
    }
    return correctId;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const response = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(response);
    const newArr = JSON.stringify([...contacts, body]);

    const newContactsArr = await fs.writeFile(contactsPath, newArr);
  } catch (error) {
    return error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const response = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(response);
    const contactByIndex = contacts.findIndex((item) => item.id.toString() === contactId);
    const contactById = contacts.find((item) => item.id.toString() === contactId);

    if (contactByIndex === -1) {
      return console.log('User not found');
    }

    const newContact = (contacts[contactByIndex] = {
      ...contactById,
      ...body,
    });

    const newArr = JSON.stringify([...contacts, newContact]);

    const updateContact = await fs.writeFile(contactsPath, newArr);

    return newContact;
  } catch (error) {
    return error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
