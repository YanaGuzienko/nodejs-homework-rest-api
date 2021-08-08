const Jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const User = require('../model/user');
const dotenv = require('dotenv');

dotenv.config();

const { PORT } = process.env;

const avatarUpdate = async (req, res) => {
  console.log(req.user);
  const tempDir = path.join(process.cwd(), '/public/avatars');

  const { path: filePath } = req.file;
  const { id } = req.user;

  try {
    if (!req.user) {
      return res.status(400).json({
        status: 'Unauthorized',
        code: 400,
        message: 'Not authorized',
      });
    }
    const newAvatar = await Jimp.read(filePath)
      .then((avatar) => {
        return avatar.resize(250, 250).write(filePath);
      })
      .catch((err) => {
        console.error(err);
      });

    const newName = `${id}.` + newAvatar.getExtension();

    const newPath = path.join(tempDir, newName);

    fs.rename(filePath, newPath).catch((error) => console.log(error));

    const url = path.join(`http://localhost:${PORT}/public/avatars/${newName}`);

    await User.findOneAndUpdate({ _id: id }, { avatarURL: url }, { new: true });

    res.status(200).json({
      status: 'ok',
      code: 200,
      avatarURL: 'avatar',
    });
  } catch (error) {
    fs.unlink(filePath);

    console.log(error);
  }
};

module.exports = { avatarUpdate };
