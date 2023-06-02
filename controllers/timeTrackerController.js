const TimeTracker = require("../model/timeTracker");

const getData = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await TimeTracker.find({ userId: id });
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ message: "NO" });
    }
  } catch (err) {
    return err;
  }
};

const postData = async (req, res) => {
  try {
    const data = req.body;

    try {
      const sendData = await TimeTracker.insertMany(data);
      console.log(sendData, "SENDDATA");
      if (sendData) {
        res.status(200).json(sendData);
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    } catch (e) {
      return e;
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

const getDataById = async (req, res) => {
  const { id } = req.params;
  console.log(req.params, "Body console");

  try {
    const data = await TimeTracker.find({ _id: id });
    console.log(data);
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ message: "Something went wrong" });
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
    : res.status(400).json({ message: "Something went wrong" });
};

const getDataOfWeek = async (req, res) => {
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
      : res.status(400).json({ message: "Something went wrong" });
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
      : res.status(400).json({ message: "Something went wrong" });
  } catch (error) {}
};

const deleteData = async (req, res) => {
  const { id } = req.params;

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

module.exports = {
  getData,
  updateProjectData,
  postData,
  deleteData,
  getDataById,
  getDataOfWeek,
  updateCalendarData,
};
