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

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema(
    {
      title: String,
      body: String,
      published: Boolean,
      commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
  ).method("toJSON",
    () => {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    })
);
module.exports = Comment;
