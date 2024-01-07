require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
// const logger = require("morgan");
const createError = require("http-errors");
const path = require("path");

const index = require("./routes/index");
const users = require("./routes/users");
const login = require("./routes/login");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

