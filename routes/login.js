const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res, next) {
  res.render("login", { title: "Express" });
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

module.exports = router;
