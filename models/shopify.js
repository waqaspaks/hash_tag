"use strict";

var mongoose = require("mongoose");
//var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;


var shopifySchema = new Schema({
  shop_name: String,
  access_token: String,
  collection_id: String,
  isCurrent: Boolean

});

//building models
module.exports = mongoose.model("ShopifyConfig", shopifySchema);
