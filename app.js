require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { User, Profile } = require("./Models/User");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");

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
          profileId: new mongoose.Types.ObjectId(),
          nickname: profile.displayName,
          posts: [],
          comments: [],
        });

        const user = await User.create({
          name: profile.displayName,
          email: profile._json && profile._json.email,
          password: profile.emails[0].value,
          profiles: [newProfile.profileId],
          birth: "0101",
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

const app = express();

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

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);

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
