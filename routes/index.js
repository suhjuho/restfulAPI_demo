const express = require("express");
const router = express.Router();

const { User, Profile } = require("../Models/User");
const { Post } = require("../Models/Post");
const { default: mongoose } = require("mongoose");

router.get("/", async (req, res, next) => {
  const user = await User.findOne().populate("profiles");
  const profile = await Profile.findOne().populate("posts").exec();
  const posts = await Post.find().populate("author");
  res.render("index", { user, profile, posts });
});

router.post("/", async (req, res, next) => {
  const newProfile = await Profile.create({
    profileId: new mongoose.Types.ObjectId(),
    nickname: req.body.nickname,
    posts: [],
    comments: [],
  });

  const newUser = await User.create({
    userId: new mongoose.Types.ObjectId(),
    name: req.body.nickname,
    email: req.body.nickname,
    password: req.body.nickname,
    profiles: [newProfile.profileId],
    birth: req.body.nickname
  });

  res.redirect("/");
});

module.exports = router;
