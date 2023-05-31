const mongoose = require("mongoose");

const schema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  designation: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Number,
    default : 0
  },
  verificationToken : {
    type : String,
  },
  isActive : {
    type : Boolean,
    default : false
  },
  oldPassword : {
    type : String
  },
  newPassword : {
    type : String
  },
  leaveAvailable : {
    type : Number,
    default : 12
  },
  leaveTaken : {
    type : Number,
    default : 0
  },
  leaveType: {
    type : String
  },
  startDate : {
    type : String
  },
  endDate : {
    type : String
  },
  description : {
    type : String
  },
  birthDate : {
    type : String
  },
  role: {
    type: String,
    default: "client"
  }
});

const user = mongoose.model("User", schema);
module.exports = user;
