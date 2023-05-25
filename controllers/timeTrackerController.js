const TimeTracker = require("../model/timeTracker");
const User = require("../model/user");
const express = require("express");
const app = express();

const getData = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;
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
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ message: "NO" });
    }
  } catch (err) {
    console.log(err, "ERROR");
  }
};

const getAllData = async (req, res) => {
  try {
    const empolyeeData = await TimeTracker.find();

    if (empolyeeData) {
      res.status(200).json({
        message: "Data Fetched successfully",
        data: empolyeeData,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to Fetched Data",
      error: err,
    });
  }
};

const deleteData = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const deleteUser = await TimeTracker.findByIdAndDelete(id);
      res.send(deleteUser);
    } else {
      return res.status(400).send();
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to Fetched Data",
      error: err,
    });
  }
};

const getLoggedUserData = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const getUser = await TimeTracker.find({ userId: id });
      res.status(200).json({
        message: "Data Fetched successfully",
        data: getUser,
      });
    }
  } catch (err) {
    res.stat;
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
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

// const updateProjectData = async (req, res) => {
//   try {
//     const { projectName, taskName, taskDescription, status, hours } = req.body;
//     const updateProjectInfo = await TimeTracker.updateOne(
//       {
//         _id: id,
//       },
//       {
//         $set: {
//           projectName,
//           taskName,
//           taskDescription,
//           status,
//           hours,
//         },
//       }
//     );
//     updateProjectInfo
//       ? res.status(200).json({ updateProjectInfo })
//       : res.status(400).json({ message: "Something went wrong" });
//   } catch (error) {
//     console.log(error, "Error from backend line");
//   }
// };

const updateProjectData = async (req, res) => {

  try {
    const { projectName, taskName, taskDescription, status, hours ,date,_id} = req.body;
    const updateProjectInfo = await TimeTracker.updateOne(
      {
        _id:_id ,
      },
      {
        $set: {
          projectName,
          taskName,
          taskDescription,
          status,
          hours,
          date
        },
      }
    );
    updateProjectInfo
      ? res.status(200).json({ updateProjectInfo })
      : res.status(400).json({ message: "Something went wrong" });
  } catch (error) {
  }
};

const getWeekData = async (req, res) => {
  try {
    const { id } = req.params;
    // const { weekFirstDateYear, weekLastDateYear } = req.body
    const { weekFIrstDay, weekLastDay } = req.body;
    const firstDate = weekFIrstDay.formatDate;
    const lastDate = weekLastDay.formatDate;
    const [weekFirstDateYear, weekFirstTime] = firstDate.split("T");
    const [weekLastDateYear, weekLastTime] = lastDate.split("T");

    if (weekFirstDateYear && weekLastDateYear) {
      const filterdUsers = await TimeTracker.find({
        userId: id,
        date: {
          $gte: weekFirstDateYear,
          $lte: weekLastDateYear,
        },
      });
      filterdUsers
        ? res.status(200).json({ filterdUsers })
        : res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) { }
};

const getDataOfWeek = async (req, res) => {
  try {
    const { id, weekFIrstDay, weekLastDay } = req.params;
    console.log(weekFIrstDay, weekLastDay)
   
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
   
  } catch (error) { }
};


const getEditUserData = async (req, res) => {
  const { id } = req.params;
  const data = await TimeTracker.find({ _id: id });
  if (data) {
    res.status(200).json({ data })
  } else {
    res.status(400).json({ message: 'No data' })
  }
}

module.exports = {
  getData,
  deleteData,
  postData,
  updateProjectData,
  getAllData,
  getLoggedUserData,
  getWeekData,
  getDataOfWeek,
  getEditUserData
};
