"use strict";

(function() {
  var shopify = require("../models/shopify.js");

  function seedData() {
    shopify.find({}).count(function(err, count) {
      if (err) {
        console.log(err);
      } else {
        //console.log(count);
        if (count == 0) {
          var shopifyObj = new shopify({
            shop_name: "lp-test-store.myshopify.com",
            access_token: "2a281afc03558e96ab4177cddc7e8508",
            collection_id: "110002115",
            isCurrent: true
          });
          //var userObjStr ='{' + JSON.stringify(userObj) + '}';
          shopifyObj.save(function(errs, res) {
            if (errs) {
              console.log(errs);
            }
          });

        }
      }
    });
  };

  seedData();

})(module.exports);
