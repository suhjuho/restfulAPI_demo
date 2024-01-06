const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
  commentId: { type: mongoose.ObjectId },
  author: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  date: { type: Date, default: new Date(), auto: true },
  contents: { type: String, required: true },
});

const postSchema = new mongoose.Schema({
  postId: { type: mongoose.ObjectId },
  author: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  content: { type: String, required: true },
  private: { type: Boolean, default: false },
  date: { type: Date, default: new Date(), auto: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

exports.Comment = mongoose.model("Comment", commentSchema);
exports.Post = mongoose.model("Post", postSchema);
