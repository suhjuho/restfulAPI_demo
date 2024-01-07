const mongoose = require("mongoose");
const { Schema } = mongoose;

const profileSchema = new mongoose.Schema({
  profileId: { type: mongoose.ObjectId },
  nickname: { type: String, required: true, unique: true },
  // 이 닉네임이 변경되면 (즉, update()하면) 아래 Posts, Comments의 닉네임도 변경이 되는지 여부
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.ObjectId },
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profiles: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  birth: { type: String, required: true },
});

exports.Profile = mongoose.model("Profile", profileSchema);
exports.User = mongoose.model("User", userSchema);
