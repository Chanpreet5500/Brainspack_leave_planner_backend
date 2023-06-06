const mongoose = require("mongoose");

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  leaveDates: {
    type: String,
  },

  leaveType: {
    type: String,
  },

  description: {
    type: String,
  },

  isDeleted: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Number,
    default: 0,
    required: true,
  },
});

const leave = mongoose.model("LeaveReason", schema);
module.exports = leave;
