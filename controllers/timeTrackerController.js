const TimeTracker = require("../model/timeTracker");
const User = require("../model/user");
const express = require("express");
const app = express();

const getData = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const data = await TimeTracker.find({});
  console.log(data, "data from api");
};

const postData = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { projectName, taskName, taskDescription, hours, status, date } =
      data;
    const newData = await TimeTracker.insertMany({
      userId: id,
      projectName,
      taskName,
      taskDescription,
      hours,
      status,
      date,
    });
    if(newData){
      res.status(200).json({ newData })
    }else{
      res.status(500).json({ message: "Something went wrong" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};


module.exports = {
  getData,
  postData,
};
