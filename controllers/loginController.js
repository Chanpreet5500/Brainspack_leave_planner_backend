const User = require("../model/user");
const Leave = require("../model/leave");
const TimeTracker = require("../model/timeTracker");
const passport = require("passport");
const express = require("express");
const app = express();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const strategy = require("passport-jwt").Strategy;
const extract_jwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const MESSAGE = require("../constant/constant.json");
const userRole = require("../model/userRole");
const user = require("../model/user");

const passwordComparison = async (bodyValue, storedValue) => {
  return bcrypt.compare(bodyValue, storedValue);
};

const registerUser = async (req, res) => {
  const reqPassword = req.body.password;

  const hashedPassword = await bcrypt.hash(reqPassword, saltRounds);

  const token = await getVerificationToken();

  const role = await userRole.findOne({ role: "client" });

  const userData = await User.create({
    email: req.body.email,
    password: hashedPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    city: req.body.city,
    designation: req.body.designation,
    verificationToken: token,
    birthDate: req.body.birthdate,
    roleId: role._id,
  });

  if (userData) {
    return res.status(200).json({
      message: MESSAGE.SUCCESS.register,
    });
  } else {
    return res.status(400).json({
      message: MESSAGE.FAILURE.register,
    });
  }
};

const getVerificationToken = async () => {
  let tokenn = new Promise(function (resolve, reject) {
    crypto.randomBytes(20, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        const y = buf.toString("hex");
        resolve(y);
      }
    });
  });
  return tokenn;
};

const initialize = () => {
  passport.use("local", getStrategy());
  passport.session();
  return passport.initialize();
};

const getStrategy = () => {
  const params = {
    secretOrKey: "42ka1",
    jwtFromRequest: extract_jwt.fromAuthHeaderWithScheme("jwt"),
    passReqToCallback: true,
  };

  return new strategy(params, (req, res, callback) => {
    User.findOne({ email: res.email }).then((data) => {
      if (!data) {
        return callback(null, false, {
          message: MESSAGE.FAILURE.userError,
        });
      } else {
        return callback(null, data);
      }
    });
  });
};

app.use(initialize());

const createToken = (email) => {
  const tokenn = jwt.sign({ email }, "42ka1");
  return "JWT " + tokenn;
};

const loginUser = async (req, res) => {
  const password = req.body.password;

  const userData = await User.findOne({
    email: req.body.email,
  }).populate("roleId");

  if (password == "") {
    res.status(422).json({
      message: MESSAGE.FAILURE.passwordField,
    });
  } else if (userData?.roleId?.role != req.body.role) {
    if (req.body.role == "admin") {
      res.status(422).json({
        message: MESSAGE.FAILURE.notAnAdmin,
      });
    } else {
      res.status(422).json({
        message: MESSAGE.FAILURE.notAClient,
      });
    }
  } else {
    if (userData) {
      const userEmail = userData.email;

      const userPassword = userData.password;

      let comparePassword = await passwordComparison(password, userPassword);

      if (comparePassword) {
        const token = createToken(userEmail);

        res.status(200).json({
          message: MESSAGE.SUCCESS.login,
          token,
          data: {
            _id: userData._id,
            name: userData.firstName + userData.lastName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            birthDate: userData.birthDate,
            email: userEmail,
            designation: userData.designation,
            role: userData.roleId.role,
          },
        });
      } else {
        res.status(422).json({
          message: MESSAGE.FAILURE.credentials,
        });
      }
    } else {
      res.status(400).json({
        message: MESSAGE.FAILURE.login,
      });
    }
  }
};

const verifyUser = async (req, res) => {
  const userData = await User.findOne({
    email: req.body.email,
    verificationToken: req.body.verificationToken,
  });

  if (userData) {
    let newEntry = await userData.updateOne({
      verificationToken: "",
      isActive: true,
    });

    res.status(200).send({
      message: MESSAGE.SUCCESS.userVerification,
    });
  } else {
    res.status(422).json({
      message: MESSAGE.FAILURE.userVerification,
    });
  }
};

const forgotPassword = async (req, res) => {
  const userEmail = await User.findOne({
    email: req.body.email,
  });

  if (userEmail) {
    let newVerificationToken = await getVerificationToken();

    let userData = await userEmail.updateOne({
      verificationToken: newVerificationToken,
    });

    if (userData) {
      res.status(200).json({
        message: MESSAGE.SUCCESS.passwordReset,
        verifyUrl: `http://localhost:3000/reset-password/${newVerificationToken}`,
      });
    }
  } else {
    res.status(400).json({
      message: MESSAGE.FAILURE.passwordReset,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const newPassword = req.body.newPassword;
    const verificationToken = req.body.token;
    const confirmPassword = req.body.confirmPassword;

    const newUserPassword = await bcrypt.hash(newPassword, saltRounds);

    const userToken = await User.findOne({
      verificationToken: verificationToken,
    });

    if (userToken) {
      const comparePassword = await passwordComparison(
        confirmPassword,
        newUserPassword
      );

      if (comparePassword) {
        const updatedPassword = await userToken.updateOne({
          password: newUserPassword,
          verificationToken: "",
        });

        res.status(200).json({
          message: MESSAGE.SUCCESS.newPassword,
        });
      } else {
        res.status(400).json({
          message: MESSAGE.FAILURE.newPassword,
        });
      }
    }
  } catch (err) {
    return err;
  }
};

const registerViaGoogle = async (data) => {
  const userDetails = data;
  const formData = {
    firstName: userDetails?.given_name,
    lastName: userDetails?.family_name,
    email: userDetails?.email,
  };

  if (formData) {
    const userData = await User.findOne(formData.email);

    if (!userData) {
      const userData = await User.create(formData);
    }
  }
};

const getAllData = async (req, res) => {
  const { id } = req.params;
  const data = await User.findOne({ _id: id });
  if (data) {
    res.status(200).json({
      data: {
        name: data.firstName + " " + data.lastName,
        email: data.email,
        leaveAvailable: data.leaveAvailable,
        birthdate: data.birthDate,
        leaveTaken: data.leaveTaken,
        firstName: data.firstName,
        designation: data.designation,
      },
      message: MESSAGE.SUCCESS.getData,
    });
  } else {
    res.status(400).json({
      message: MESSAGE.FAILURE.getData,
    });
  }
};

const leaveData = async (req, res) => {
  const userData = req.body;

  const userDataFromUser = await User.findOne({ _id: userData.userId });
  if (userDataFromUser) {
    const userAvailableLeaves = userDataFromUser.leaveAvailable;

    const exactDatesOfLeaves = userData.leaveDates.map((e) => e);

    if (userAvailableLeaves > exactDatesOfLeaves.length) {
      const checkUserLeave = await Leave.find({
        userData: {
          $in: [
            {
              leaveDates: exactDatesOfLeaves,
              userId: userData.userId,
            },
          ],
        },
      });

      if (checkUserLeave.length == 0) {
        userData.leaveDates.map((leaves) => {
          const applyForLeave = Leave.create({
            userId: userData.userId,
            leaveType: userData.leaveType,
            leaveDates: leaves,
            description: userData.description,
          });
        });

        const numberOfLeaves = exactDatesOfLeaves.length;

        const updateUserAvaillableLeaves = await userDataFromUser.updateOne({
          leaveAvailable: userDataFromUser.leaveAvailable - numberOfLeaves,
          leaveTaken: userDataFromUser.leaveTaken + numberOfLeaves,
        });

        res.status(200).json({
          message: MESSAGE.SUCCESS.leaveTaken,
        });
      } else {
        res.status(400).json({
          message: MESSAGE.FAILURE.leavePlaced,
        });
      }
    }
  } else {
    res.status(422).json({
      message: MESSAGE.FAILURE.notEnoughLeave,
    });
  }
};

const getStatisticsData = async (req, res) => {
  const data = await User.find();
  if (data) {
    res.status(200).json({
      data: {
        name: data.firstName + data.lastName,
        email: data.email,
        firstName: data.firstName,
      },
      data,
      message: MESSAGE.SUCCESS.leaveTaken,
    });
  } else {
    res.status(400).json({
      message: MESSAGE.FAILURE.leaveTaken,
    });
  }
};

const getLeaveDates = async (req, res) => {
  const userId = req.params.id;
  const userType = req.params.userType;
  if (userId) {
    if (userType === "my_leave") {
      const data = await Leave.find({ userId: userId }).populate("userId");

      if (data) {
        res.status(200).json({
          message: MESSAGE.SUCCESS.login,
          data,
        });
      }
    } else {
      const data = await Leave.find().populate("userId");
      if (data) {
        res.status(200).json({
          message: MESSAGE.SUCCESS.login,
          data,
        });
      }
    }
  } else {
    res.status(400).json({
      message: MESSAGE.FAILURE.login,
    });
  }
};

const getLeavesForAdminPanel = async (req, res) => {
  const userId = req.params.id;

  if (userId != "all-users") {
    const data = await Leave.find({ userId: userId }).populate("userId");

    if (data) {
      res.status(200).json({
        message: MESSAGE.SUCCESS.login,
        data,
      });
    } else {
      res.status(400).json({
        message: MESSAGE.FAILURE.login,
      });
    }
  } else {
    const employeesRoleId = await userRole.find({ role: "client" });
    const employeesList = await user.find({ roleId: employeesRoleId[0]._id });
    let employeeArr = [];

    for (let i = 0; i < employeesList.length; i++) {
      const data = await Leave.find({ userId: employeesList[i]._id }).populate(
        "userId"
      );
      employeeArr.push(...data);
    }
    if (employeeArr) {
      res.status(200).json({
        message: MESSAGE.SUCCESS.fetchedLeave,
        data: employeeArr,
      });
    } else {
      res.status(400).json({
        message: MESSAGE.FAILURE.fetchedLeave,
      });
    }
  }
};

const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  const userData = await Leave.findOne({ _id: userId }).populate("userId");

  const userDataId = userData?.userId?._id;

  const loggedInUser = await User.findOne({ _id: userDataId });

  const data = await Leave.deleteOne({ _id: userId });

  if (data) {
    const updatedUserLeaves = await loggedInUser.updateOne({
      leaveTaken: loggedInUser.leaveTaken - data.deletedCount,
      leaveAvailable: loggedInUser.leaveAvailable + data.deletedCount,
    });

    if (updatedUserLeaves) {
      res.status(200).json({
        message: MESSAGE.SUCCESS.deleteEvent,
      });
    }
  } else {
    res.status(400).json({
      message: MESSAGE.FAILURE.deleteEvent,
    });
  }
};

const loginAdmin = async (req, res) => {
  const password = req.body.password;

  const adminData = await User.findOne({
    email: req.body.email,
  });

  if (password == "") {
    res.status(422).json({
      message: MESSAGE.FAILURE.passwordField,
    });
  } else {
    if (adminData) {
      const adminEmail = adminData.email;
      const adminPassword = adminData.password;

      let comparePassword = await passwordComparison(password, adminPassword);

      if (comparePassword) {
        const token = createToken(adminEmail);

        res.status(200).json({
          message: MESSAGE.SUCCESS.login,
          token,
          data: {
            _id: adminData._id,
            name: adminData.firstName + adminData.lastName,
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            email: adminEmail,
            role: adminData.role,
          },
        });
      } else {
        res.status(422).json({
          message: MESSAGE.FAILURE.credentials,
        });
      }
    } else {
      res.status(400).json({
        message: MESSAGE.FAILURE.login,
      });
    }
  }
};

const getEmployeesList = async (req, res) => {
  try {
    const userAuth = await userRole.find({ role: "client" });
    const userList = await User.find({
      roleId: userAuth[0]._id,
    });
    if (userList) {
      res.status(200).json({ userList });
    } else {
      res.status(404).json({ message: MESSAGE.FAILURE.userNotFound });
    }
  } catch (error) {
    return error;
  }
};

const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updateProjectInfo = await TimeTracker.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          status,
        },
      }
    );
    if (updateProjectInfo) {
      res.status(200).json({ message: MESSAGE.SUCCESS.statusUpdated });
    } else {
      res.status(422).json({ message: MESSAGE.FAILURE.statusUpdateFailed });
    }
  } catch (error) {
    return error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  verifyUser,
  forgotPassword,
  resetPassword,
  registerViaGoogle,
  getAllData,
  leaveData,
  getStatisticsData,
  getLeaveDates,
  deleteUserById,
  getEmployeesList,
  updateProjectStatus,
  getLeavesForAdminPanel,
};
