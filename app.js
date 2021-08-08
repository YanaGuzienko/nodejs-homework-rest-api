const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const contactsRouter = require('./routes/api/contacts');
const userRouter = require('./routes/api/auth');
const verifyRouter = require('./routes/api/verify');
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(express.json());

app.use(cors());
const { DB_HOST } = process.env;
const PORT = process.env.PORT || 5555;

mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database connection successful'))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Started listen on ${PORT}`);
});

app.use('/api/contacts', contactsRouter);
app.use('/users/verify', verifyRouter);
app.use('/users', userRouter);

// app.use(express.static('public'));

app.use('/avatars', express.static(__dirname + '/public/avatars'));
console.log(__dirname);
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
