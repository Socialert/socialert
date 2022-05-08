// ========================================================================== //
// MODELS
// ========================================================================== //
// these are the models that are used in the database, from these models we
// can call CRUD operations from them, ie: model.find(), model.findOne(), etc...
// ========================================================================== //

// ========================================================================== //
// Schemas
// ========================================================================== //
// these enforce the data structure so we stricyly enforce them to avoid
// inconsistent data on the datbase
const mongoose = require('mongoose');

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    title: String,
    body: String,
    published: Boolean,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }]
  },
    { timestamps: true }
  ).method("toJSON",
    () => {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    })
);
module.exports = Post;