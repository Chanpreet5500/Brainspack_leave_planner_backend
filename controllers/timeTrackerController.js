const TimeTracker = require("../model/timeTracker");
const User = require("../model/user");
const express = require("express");
const app = express();

// const getData = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // const { startDate, endDate } = req.body;
//     // console.log(req.body);
//     const data = await TimeTracker.findOne(
//       {
//         userId: id,
//       }
//       // ,
//       // {
//       //   $and: [
//       //     {
//       //       $eq: [startDate, endDate],
//       //     },
//       //   ],
//       // }
//     );
//     console.log(data, "data from api");
//     if (data) {
//       res.status(200).json({ data });
//     } else {
//       res.status(400).json({ message: "NO" });
//     }
//   } catch (err) {
//     console.log(err, "ERROR");
//   }
// };

const getData = async (req, res) => {
  const { id } = req.params;

  const data = await TimeTracker.find({ userId: id });
  console.log(data);
  if (data) {
    res.status(200).json({ data });
  } else {
    res.status(400).json({ message: "NO" });
  }
};

const getEditUserData = async (req, res) => {
  const { id } = req.params;
  const data = await TimeTracker.find({ _id: id });
  if (data) {
    res.status(200).json({ data });
  } else {
    res.status(400).json({ message: "NO" });
  }
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

  try {
    const { projectName, taskName, taskDescription, status, hours ,_id} = req.body;
    console.log(req.body)
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
        },
      }
    );
    updateProjectInfo
      ? res.status(200).json({ updateProjectInfo })
      : res.status(400).json({ message: "Something went wrong" });
  } catch (error) {
    console.log(error, "Error from backend line");
  }
};

module.exports = {
  getData,
  deleteData,
  postData,
  updateProjectData,
  getEditUserData
};
