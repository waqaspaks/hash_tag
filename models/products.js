"use strict";

var mongoose = require("mongoose");
//var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;


var productsSchema = new Schema({
  userEmail: String,
  productId: String,
  productName: String,
  productType: String,
  productDetails: String,
  createdOn: {
    type: Date,
    default: Date.now
  },
  publishedOn: {
    type: Date,
    default: Date.now
  },
  vandor: String,
  color: String,
  tag_type: String,
  logo: String,
  design_image: String,
  landingPageHeading: String,
  landingPageDetails: String,
  landingPageLogoUrl: String,
  langingPageBgColor: String

});

//building models
module.exports = mongoose.model("Products", productsSchema);
