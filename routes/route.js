const express = require("express");
const passport = require("passport");
const userController = require("../controllers/loginController");
const timeTrackerController = require("../controllers/timeTrackerController");
const validations = require("../validations/validations");
const router = express.Router();

router.post(
  "/register",
  validations.registerValidation,
  userController.registerUser
);
router.post(
  "/loginAdmin",
  validations.loginValidation,
  userController.loginAdmin
);
router.post("/login", validations.loginValidation, userController.loginUser);
router.post("/verify", userController.verifyUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/success",
  })
);
router.get("/success", function (req, res) {
  res.redirect("http://localhost:3000");
  return false;
});
router.get("/failure", function (req, res) {
  res.send("Error in authentication");
});
router.get(
  "/dashboard/:id",
  passport.authenticate("local", { failWithError: false }),
  userController.getAllData
);
router.post("/leave", userController.leaveData);
router.get("/statistic", userController.getStatisticsData);
router.get("/leave-data/:id/:userType", userController.getLeaveDates);
router.get("/leave-data-admin/:id", userController.getLeavesForAdminPanel);
router.delete("/delete-event/:id", userController.deleteUserById);
router.get("/getTimeTrackerData/:id", timeTrackerController.getTimeTrackerData);
router.get("/getDataById/:id", timeTrackerController.getDataById);
router.post("/setTimeTrackerData/:id", timeTrackerController.setTimeTrackerData);
router.delete("/deleteTimeTrackerData/:id", timeTrackerController.deleteTimeTrackerData);
router.patch("/update/:id", timeTrackerController.updateProjectData);
router.patch("/updateCalendar", timeTrackerController.updateCalendarData);
router.get(
  "/weekly-datas/:id/:weekFIrstDay/:weekLastDay",
  timeTrackerController.getDataByWeek
);
router.get("/getEmpList", userController.getEmployeesList);
router.patch("/updateStatus/:id", userController.updateProjectStatus);

module.exports = router;
