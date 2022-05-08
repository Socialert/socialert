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

const Campaign = mongoose.model(
  "Campaign",
  new mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean,
      followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
      catagories: [String],
      roles: [{type: mongoose.Schema.Types.ObjectId,ref: "Role"}]
    },
    { timestamps: true }
  ).method("toJSON",
    () => {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    })
);
module.exports = Campaign;
