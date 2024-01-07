const express = require("express");
const router = express.Router();

const { User, Profile } = require("../Models/User");
const { default: mongoose } = require("mongoose");

router.get("/", async (req, res, next) => {
  res.render("signup");
});

router.post("/", async (req, res, next) => {
  res.redirect("/");
});

module.exports = router;
