var express = require('express');
var router = express.Router();
const { User, Profile } = require("../Models/User");
const { Post } = require("../Models/Post");

/* GET home page. */
router.get('/', async (req, res, next) => {
  const user = await User.findOne().populate("profiles");
  const profile = await Profile.findOne().populate("posts").exec();
  const posts = await Post.find().populate("author");
  res.render('index', { user, profile, posts });
});

router.post("/", async (req, res, next) => {
  const newNickname = req.body.nickname;
  const profile = await Profile.findOne();
  profile.nickname = newNickname;
  profile.save();
  res.redirect("/");
});

module.exports = router;
