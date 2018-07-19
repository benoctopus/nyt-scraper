const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    unique: true,
    default: () => uuidv4(),
  },
  user: {
    type: String,
    unique: true,
    required: [true, 'usename is required,'],
    minLength: [3, 'username must be at least 3 characters long.'],
    maxLength: [20, 'username must be less than 20 characters.'],
  },
  pass: {
    type: String,
    required: [true, 'password is required,'],
    minLength: [6, 'password must be at least 3 characters long'],
    maxLength: [20, 'password must be less than 20 characters.'],
  },
  token: {
    type: String,
    required: true,
  },
  saved_articles: Array,
  tokenExpr: {
    type: Number,
    required: true,
    default: () => parseInt(new Date().getTime(), 10) + (96 * 40 * 60 * 1000),
  },
  created: {
    type: Number,
    required: true,
    default: () => parseInt(new Date().getTime(), 10),
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
