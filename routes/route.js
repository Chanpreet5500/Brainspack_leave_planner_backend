const express = require('express')
const passport = require('passport')
const userController = require('../controllers/loginController') 
const validations = require('../validations/validations')
const router = express.Router();
 
router.post("/register", validations.registerValidation,userController.registerUser);
router.post('/login', validations.loginValidation, userController.loginUser);
router.post('/verify', userController.verifyUser);
router.post('/forgot-password', userController.forgotPassword)
router.post('/reset-password', userController.resetPassword)
router.get('/google', passport.authenticate('google', {scope : ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google', {failureRedirect : '/failure', successRedirect: '/success'}))
router.get('/success', function (req, res){

 res.redirect('http://localhost:3000')
 return false
})
router.get('/failure', function (req, res){
    res.send('Error in authentication')
})
router.get('/dashboard/:id', passport.authenticate('local', {failWithError : false}),userController.getAllData)
router.post('/leave', userController.leaveData)
router.get('/statistic', userController.getStatisticsData)
router.get('/leave-data/:id/:userType', userController.getLeaveDates)
router.delete('/delete-event/:id', userController.deleteUserById)

module.exports = router