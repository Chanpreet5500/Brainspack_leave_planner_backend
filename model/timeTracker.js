const mongoose = require("mongoose");

const schema = mongoose.Schema({
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
    type: Boolean,
    require: true,
  },
  // date: {
  //   type: Date,
  //   require: true,
  // },
});

const timetracker = mongoose.model("TimeTracker", schema);
module.exports = timetracker;
