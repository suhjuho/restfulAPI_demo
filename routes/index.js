const express = require("express");
const router = express.Router();

const { User } = require("../Models/User");
const { Post } = require("../Models/Post");
const { default: mongoose } = require("mongoose");
const verifyLogin = require("./middleware/verifyLogin");

router.get("/", verifyLogin,  async (req, res, next) => {
  const posts = await Post.find().populate("author");
  console.log(posts);
  res.render("index", { user: req.user,  posts });
});

router.post("/", async (req, res, next) => {
  console.log(req.user);
  const newPost = await Post.create({
    author: req.user.profiles[0],
    content: req.body.postContent,
    comments: [],
  });

  res.redirect("/");
});

module.exports = router;
