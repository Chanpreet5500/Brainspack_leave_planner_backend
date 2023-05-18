const TimeTracker = require("../model/timeTracker");
const User = require("../model/user");
const express = require("express");
const app = express();

const getData = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;
    console.log(req.body);
    const data = await TimeTracker.findOne(
      {
        userId: id,
      },
      {
        $and: [
          {
            $eq: [startDate, endDate],
          },
        ],
      }
    );
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
};
