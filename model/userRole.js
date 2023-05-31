const mongoose = require("mongoose");

const schema = mongoose.Schema({
  role: {
    type: String,
  },
  status: {
    type: Boolean,
  }
})

const userRole = mongoose.model("UserRole", schema);
module.exports = userRole;