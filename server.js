require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth2");
const session = require("express-session");
// const Agenda = require('agenda')
// const AgendaSchema = require('./model/agendaTest')
const route = require("./routes/route");
const port = 5233;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// const connectionForAgenda = 'mongodb://localhost:27017/test'

// const agenda = new Agenda({db : {address : connectionForAgenda}})

// agenda.define('creating values', async (job) => {
//   console.log(job, "BALUES")
//   console.log('after job was created24')
//   await AgendaSchema.create(job.attrs.data)
// });

// (async function(){
//   await agenda.start() ;

// 	//await agenda.schedule('12:28pm', 'creating values', { name : 'two' });
// })();

const controller = require("./controllers/loginController");
const registerationViaEmail = controller.registerViaGoogle;

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.session());
app.use(passport.initialize());

const authUser = (request, accessToken, refreshToken, profile, done) => {
  console.log(request);
  console.log(profile);

  return done(null, profile);
};

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    authUser
  )
);

passport.serializeUser((user, done) => {
  console.log(`\n--------> Serialize User:`);
  console.log(user, "USERRRRRRRRRRRRRRR");
  console.log(user._json, "JASSONNNN");
  const userDetails = user._json;

  registerationViaEmail(userDetails);

  // The USER object is the "authenticated user" from the done() in authUser function.
  // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.

  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("\n--------- Deserialized User:");
  console.log(user);
  // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
  // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.

  done(null, user);
});

mongoose.connect("mongodb://localhost:27017/leave_manager");

app.use(route);

app.listen(port, () => {
  console.log(`You are successfully connected at ${port}`);
});
