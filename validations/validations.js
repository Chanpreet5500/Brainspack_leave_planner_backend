const User = require("../model/user");
const MESSAGE = require("../constant/constant.json");

const registerValidation = async (req, res, next) => {
  const initialEmail = req.body.email; //change this

  const emailExist = await User.findOne({ email: { $eq: initialEmail } });

  if (emailExist) {
    res.status(400).json({
      data: emailExist,
      message: MESSAGE.FAILURE.emailValidation,
    });
  } 

  next();
};

const loginValidation = (req, res, next) => {
  try {

    const initialValues = { //change this
      email: req.body.email,
      password: req.body.password,
    };

    const emailRegex = /^\S+@\S+\.\S+$/;

    const email = initialValues.email

    const text = email.match(emailRegex)

    if (!text) {
      res.status(400).json({
        message: MESSAGE.VALIDATION.emailType,
      })
    } 

    next();

  } catch (err) {
    return error;
  }

};

module.exports = {
  registerValidation,
  loginValidation,
};
