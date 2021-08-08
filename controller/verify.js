const User = require('../model/user');
const { nanoid } = require('nanoid');
const sendMail = require('../sendGrid/sendGrid');

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  console.log(req.params);

  try {
    const user = await User.findOne({ verifyToken: verificationToken });

    if (!user) {
      return res.status(404).json({
        status: 'Not Found',
        code: 404,
        message: 'User not found',
      });
    }

    await User.findOneAndUpdate({ _id: user._id }, { verify: true, verifyToken: null }, { new: true });

    res.status(200).json({
      status: 'Ok',
      code: 200,
      message: 'Verification successful',
    });
  } catch (error) {
    console.log(error);
  }
};

const reVerify = async (req, res) => {
  const { email } = req.body;
  const verifyToken = nanoid();
  const text = `http://localhost:5000/users/verify/${verifyToken}`;

  try {
    if (!email) {
      res.status(400).json({
        status: 'Not found',
        code: 400,
        message: 'missing required field email',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'Not found',
        code: 404,
        message: 'User not found',
      });
    }
    if (!user.verify) {
      await sendMail({ email, text });
      return res.status(200).json({
        status: 'Ok',
        code: 200,
        message: 'Verification email sent',
      });
    }

    return res.status(400).json({
      status: 'Bad Request',
      code: 400,
      message: 'Verification has already been passed',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verify, reVerify };
