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