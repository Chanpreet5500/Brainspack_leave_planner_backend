const mongoose = require("mongoose");

const schema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verificationToken: {
    type: String,
  },
});

const admin = mongoose.model("Admin", schema);
module.exports = admin;
