var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  username: String,
  password: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  secretForWebToken: {
    type: String,
    default: ""
  }
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
