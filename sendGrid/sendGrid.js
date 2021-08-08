const sgMail = require('@sendgrid/mail');

require('dotenv').config();

const { SEND_GRID } = process.env;

sgMail.setApiKey(SEND_GRID);

const sendMail = async ({ email, text }) => {
  const mail = {
    to: email,
    from: 'advan@ukr.net',
    subject: 'Sending whith SandGrid is Fun',
    text,
  };
  try {
    const answer = await sgMail.send(mail);
    return answer;
  } catch (error) {
    console.log(error.response.body);
  }
};

module.exports = sendMail;
