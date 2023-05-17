const TimeTracker = require("../model/timeTracker");
const User = require('../model/user')
const express = require("express");
const app = express();

const getData = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const data = await TimeTracker.find({});
  console.log(data, "data from api");
};

module.exports = {
  getData,
};
