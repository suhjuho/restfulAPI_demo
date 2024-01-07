require("dotenv").config();
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const path = require("path");
const app = express();
const index = require("./routes/index");
const users = require("./routes/users");
const login = require("./routes/login");
const { User, Profile } = require("./Models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URI,
    },
    async function (token, tokenSecret, profile, done) {
      console.log(profile);
      try {
      const user = await User.findOne({ email: profile._json && profile._json.email });

      if (!user) {
        const newProfile = await Profile.create({
          nickname: profile.displayName,
          posts: [],
          comments: [],
        });

        const user = await User.create({
          name: profile.displayName,
          email: profile._json && profile._json.email,
          password: profile.emails[0].value,
          profiles: [newProfile._id],
          birth: "2000.01.01",
        });
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/users", users);
app.use("/login", login);

const MONGODB_URI = process.env.MONGODB_URI;
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB 연결 오류:"));
db.once("open", function () {
  console.log("MongoDB 연결 성공!");
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

