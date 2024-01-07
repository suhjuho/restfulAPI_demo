const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { User, Profile } = require("../Models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URI,
    },
    async function (token, tokenSecret, profile, done) {
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