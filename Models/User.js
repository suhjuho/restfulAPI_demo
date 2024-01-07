const mongoose = require("mongoose");
const { Schema } = mongoose;

const profileSchema = new mongoose.Schema({
  profileId: { type: mongoose.ObjectId },
  nickname: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.ObjectId },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profiles: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  birth: { type: String, required: true },
  provider: { type: String },
});

exports.Profile = mongoose.model("Profile", profileSchema);
exports.User = mongoose.model("User", userSchema);
