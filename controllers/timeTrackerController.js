const TimeTracker = require("../model/timeTracker");
const message = require("../constant/response.json");

const getTimeTrackerData = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await TimeTracker.find({ userId: id });
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ message: message.errorMessage });
    }
  } catch (error) {
    return error;
  }
};

const setTimeTrackerData = async (req, res) => {
  try {
    const data = req.body;
    try {
      const userData = await TimeTracker.insertMany(data);
      if (userData) {
        res.status(200).json({
          message: message.dataUpdated,
        });
      } else {
        res.status(500).json({ message: message.errorMessage });
      }
    } catch (error) {
      return error;
    }
  } catch (error) {
    res.status(400).json({ message: message.errorMessage });
  }
};

const getDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await TimeTracker.find({ _id: id });
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ message: message.errorMessage });
    }
  } catch (error) {
    return error;
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
    : res.status(400).json({ message: message.errorMessage });
};

const getDataByWeek = async (req, res) => {
  try {
    const { id, weekFIrstDay, weekLastDay } = req.params;

    const filterdUsers = await TimeTracker.find({
      userId: id,
      date: {
        $gte: weekFIrstDay,
        $lt: weekLastDay,
      },
    });
    filterdUsers
      ? res.status(200).json({ filterdUsers })
      : res.status(400).json({ message: message.errorMessage });
  } catch (error) {
    return error;
  }
};

const updateCalendarData = async (req, res) => {
  try {
    const { projectName, taskName, taskDescription, status, hours, date, _id } =
      req.body;
    const updateProjectInfo = await TimeTracker.updateOne(
      {
        _id: _id,
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
      : res.status(400).json({ message: message.errorMessage });
  } catch (error) {
    return error;
  }
};

const deleteTimeTrackerData = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const deleteUser = await TimeTracker.findByIdAndDelete(id);
      res.send(deleteUser);
    } else {
      return res.status(400).json({
        message: message.errorMessage,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: message.errorMessage,
    });
  }
};

module.exports = {
  getTimeTrackerData,
  updateProjectData,
  setTimeTrackerData,
  deleteTimeTrackerData,
  getDataById,
  getDataByWeek,
  updateCalendarData,
};
