const timetracker = require("../model/timeTracker");
const TimeTracker = require("../model/timeTracker");
const User = require("../model/user");
const express = require("express");
const app = express();

const getData = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id, "userId");
    const data = await TimeTracker.find({ userId: id });
    // console.log(data, "data from api");
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
    const data = req.body;
    console.log(data, "data from formik in backend");
    try {
      const sendData = await TimeTracker.insertMany(data);
      if (sendData) {
        res.status(200).json(sendData);
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    } catch (e) {
      console.log(e, "error");
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

const getDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await TimeTracker.find({ _id: id });
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log(error, "Error from backend");
  }
};

const updateProjectData = async (req, res) => {
  const { id } = req.params;
  const { projectName, taskName, taskDescription, status, hours, date } =
    req.body;
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
        date,
      },
    }
  );
  updateProjectInfo
    ? res.status(200).json({ updateProjectInfo })
    : res.status(400).json({ message: "Something went wrong" });
};

const deleteData = async (req, res) => {
  const { id } = req.params;
  console.log(id, "ID FROM DELETE API");
  try {
    if (id) {
      const deleteUser = await TimeTracker.findByIdAndDelete(id);
      console.log(deleteUser);
      res.send(deleteUser);
    } else {
      return res.status(400).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const getDataOfWeek = async (req, res) => {
  try {
    const { id, weekFIrstDay, weekLastDay } = req.params;
    console.log(weekFIrstDay, weekLastDay);

    const filterdUsers = await TimeTracker.find({
      userId: id,
      date: {
        $gte: weekFIrstDay,
        $lt: weekLastDay,
      },
    });
    filterdUsers
      ? res.status(200).json({ filterdUsers })
      : res.status(400).json({ message: "Something went wrong" });
  } catch (error) {}
};

module.exports = {
  getData,
  updateProjectData,
  postData,
  deleteData,
  getDataById,
  getDataOfWeek
};
