const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// ========================================================================== //
// Base models
// ========================================================================== //
db.user = require("./user.model");
db.role = require("./role.model");
db.comment = require("./comment.model");
db.campaign = require("./campaign.model");
db.post = require("./post.model"); 

// ========================================================================== //
// Properties
// ========================================================================== //
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;