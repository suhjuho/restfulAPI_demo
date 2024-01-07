require("../passport");
const express = require("express");
const router = express.Router();
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("login");
});

router.get("/kakao", passport.authenticate("kakao"));

router.get("/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("카카오");
    res.redirect("/index");
  }
)

module.exports = router;
