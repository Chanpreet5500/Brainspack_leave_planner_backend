const TimeTracker = require("../model/timeTracker");
const User = require("../model/user");
const express = require("express");
const app = express();

const getData = async (req, res) => {
  const { id } = req.params;
  console.log(req.params, 'Body console');
  try {
    if (id) {
      const data = await TimeTracker.findOne({ _id: id });
      console.log(data, "data from api");
    }
  } catch (err) {
    res.status(400).send(err)
  }
};


const deleteData = async (req, res) => {
  const { id } = req.params;
  console.log(id, "ID FROM DELETE API")
  try {
    if (id) {
      const deleteUser = await TimeTracker.findByIdAndDelete(id)
      console.log(deleteUser)
      res.send(deleteUser)
    } else {
      return res.status(400).send()
    }
  } catch (err) {
    res.status(500).send(err)
  }

}
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
  deleteData,
  postData,
};
