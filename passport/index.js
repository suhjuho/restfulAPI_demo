const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const { User, Profile } = require("../Models/User");

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      callbackURL: "http://localhost:3000/login/kakao/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile._json
          && profile._json.kakao_account_email,
          provide: "kakao"
        });

        if (existingUser) {
          done(null, existingUser);
        } else {
          const newProfile = await Profile.create({
            nickname: profile.displayName,
            posts: [],
            comments: [],
          })

          const newUser = await User.create({
            name: profile.displayName,
            email: profile.displayName + "@daum.net",
            password: profile.id,
            profiles: [newProfile._id],
            birth: "2000.01.01",
          });

          done(null, newUser);
        }
      } catch (err) {
          console.error(err);

          done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
})

