const TimeTracker = require("../model/timeTracker");
const User = require("../model/user");
const express = require("express");
const app = express();

const getData = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "userId");
    const data = await TimeTracker.find({ userId: id });
    console.log(data, "data from api");
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ message: "NO" });
    }
  } catch (err) {
    console.log(err, "ERROR");
  }
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
    if (newData) {
      res.status(200).json({ newData });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

const updateProjectData = async (req, res) => {
  const { id } = req.params;
  const { projectName, taskName, taskDescription, status, hours } = req.body;
  const updateProjectInfo = await TimeTracker.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        projectName,
        taskName,
        taskDescription,
        status,
        hours,
      },
    }
  );
  updateProjectInfo
    ? res.status(200).json({ updateProjectInfo })
    : res.status(400).json({ message: "Something went wrong" });
};

module.exports = {
  getData,
  updateProjectData,
  postData
};
