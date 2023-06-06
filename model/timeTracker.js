const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectName: {
    type: String,
    require: true,
  },
  taskName: {
    type: String,
    require: true,
  },
  taskDescription: {
    type: String,
    require: true,
  },
  hours: {
    type: String,
    require: true,
  },
  status: {
    type: Number,
    default: 0,
    require: true,
  },
  date: {
    type: Date,
    require: true,
    default: Date.now(),
  },
});

const timetracker = mongoose.model("timetracker", schema);
module.exports = timetracker;
