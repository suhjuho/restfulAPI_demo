require("../passport/index"); // kakao passport
require("../passport/google");

const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res, next) {
  res.render("login");
});

router.get(
    "/google",
    passport.authenticate("google", { scope: [ "profile", "email" ] })
  );

router.get(
  "/google/callback",
  passport.authenticate("google", { scope: [ "profile", "email" ], failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/kakao", passport.authenticate("kakao"));

router.get("/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
)

module.exports = router;
