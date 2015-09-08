var express = require('express');
var router = express.Router();

//windows shopify sdk
var shopifyAPI = require('shopify-node-api');

//passport
var passport = require('passport');

//
var ensureLogin = require('connect-ensure-login');

//users model
var Users = require("../models/account.js");

//products model
var Products = require("../models/products.js");

//shpify modal
var shopifModal = require("../models/shopify.js");

//helper classes
var helperMethod = require("../custom_modules/helper-methods/index.js");

//URL and its parameters
var url = require('url');

//configuration for the shopify
var shopifyConfig = require("../shopifyConfig.js");

//handle multipart file upoload
//https://www.npmjs.com/package/formidable
var formidable = require("formidable");

//handle multipart file upload
var multiparty = require("multiparty");


/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

//get access token of shopify
router.get("/api/getShopifyAccessToken", function(req, res) {
  shopifModal.findOne({
    'isCurrent': true
  }, function(shopErr, shopRes) {
    if (shopErr) {} else if (shopRes == null) {

    } else {
      shopifyConfig.shop = shopRes.shop_name;
      console.log(shopRes);
      var Shopify = new shopifyAPI(shopifyConfig);

      // Building the authentication url
      var auth_url = Shopify.buildAuthURL();
      //console.log(auth_url);
      res.redirect(auth_url);
      res.end();
    }
  });
});

//callback after the shopify access token
router.get("/api/hashTagApp", function(req, res) {

  console.log(shopifyConfig);
  shopifModal.findOne({
    'isCurrent': true
  }, function(shopErr, shopRes) {
    shopifyConfig.shop = shopRes.shop_name;
    var Shopify = new shopifyAPI(shopifyConfig), // You need to pass in your config here
      query_params = req.query;
    //console.log(req.query);
    Shopify.exchange_temporary_token(query_params, function(err, data) {
      // This will return successful if the request was authentic from Shopify
      // Otherwise err will be non-null.
      // The module will automatically update your config with the new access token
      // It is also available here as data['access_token']
      if (err) {
        console.log("here:" + err);
      } else {
        console.log(data.access_token);
        //setTimeout(function () {
        helperMethod.generateInvitationKey(20, function(retErr, key) {
          res.redirect("/casedesign?st=" + data.access_token +
            "&id=" + key);
        });
        //}, 10000);
      }

    });
  });
});

//save the access token of shopify in the db
router.post("/api/saveshopifyToken", function(req, res) {
  var _shopifyToken = req.body.shopifyToken;

  shopifModal.findOne({
    'isCurrent': true
  }, function(shopErr, shopRes) {
    if (shopErr) {} else if (shopRes == null) {

    } else {
      console.log('----------------------------------');
      console.log(shopRes);
      shopRes.access_token = _shopifyToken;
      var shopName = shopRes.shop_name;
      shopRes.save(function(invResErr) {
        if (invResErr)
          console.log(invResErr.message);
        else {
          console.log("updated");
          return res.status(201).send({
            accessToken: _shopifyToken,
            shopName: shopName
          });
        }
      });
    }
  });
});

//upload and save the product in shopify and then in database
router.post("/api/uploadShopifyProduct", function(req, res) {
  shopifModal.findOne({
    'isCurrent': true
  }, function(shopErr, shopRes) {
    if (shopErr) {} else {
      shopifyConfig.access_token = shopRes.access_token;
      shopifyConfig.shop = shopRes.shop_name;
      var Shopify = new shopifyAPI(shopifyConfig);

      var post_data = {
        "product": {
          "title": req.body.product_name,
          "body_html": req.body.product_detail,
          "vendor": req.body.vandor,
          "product_type": req.body.product_type,
          "published": true,
          "variants": [{
            "option1": "case_price",
            "price": "28.00",
            "requires_shipping": true,
            taxable: false,
            title: req.body.product_name
          }]
        }
      };

      Shopify.post('/admin/products.json', post_data, function(err,
        data, headers) {
        if (err) {
          console.log(err);
        } else {
          var postImg = {
            "image": {
              "attachment": req.body.design_image,
              "filename": 'mainHeadImage.png'
            }
          };
          Shopify.post('/admin/products/' + data.product.id +
            '/images.json', postImg,
            function(ResErr, dataRes, headersRes) {
              if (ResErr) {}

              var putCollection = {
                "custom_collection": {
                  "id": shopRes.collection_id,
                  "collects": [{
                    "product_id": data.product.id,
                    "sort_value": 1
                  }]
                }
              };
              Shopify.put('/admin/custom_collections/' + shopRes.collection_id +
                '.json', putCollection,
                function(colErr, colData, colHeader) {
                  if (colErr) {
                    console.log(colErr);
                  } else {
                    console.log("here is image res");
                    console.log(dataRes);
                    var _userEmail = req.body.user_email;
                    var _product_id = data.product.id;
                    var _product_title = data.product.title;
                    var _product_detail = data.product.body_html;
                    var _product_type = data.product.product_type;
                    var _created_at = data.product.created_at;
                    var _published_at = data.product.published_at;
                    var _vandor = data.product.vandor;
                    var prodImage = dataRes.image.src;



                    var entity = new Products({
                      userEmail: _userEmail,
                      productId: _product_id,
                      productName: _product_title,
                      productType: _product_type,
                      productDetails: _product_detail,
                      createdOn: _created_at,
                      publishedOn: _published_at,
                      vandor: _vandor,
                      color: req.body.color,
                      tag_type: req.body.tag_type,
                      logo: req.body.logo,
                      design_image: prodImage
                    });

                    entity.save(function(prodErr, prodRes) {
                      if (prodErr) {
                        //console.log(prodErr);
                      } else {
                        //console.log(data);
                        return res.status(201).send({
                          data: data
                        });
                      }
                    });

                  }
                });

            });
        }
      });
    }
  });
});
//newneqwjeoqwu

//upload the images in the local server
router.post("/api/fileupload", function(req, res) {
  var TEST_TMP = "d:/";
  var form = new formidable.IncomingForm();
  form.uploadDir = TEST_TMP;
  form.keepExtensions = true;
  form.on('field', function(field, value) {
      //console.log(field, value);
      //fields.push([field, value]);
    })
    .on('file', function(name, file) {

      console.log(file);
      //files.push([name, file]);
    })
    .on('end', function() {
      //console.log('-> upload done');
      //                    res.writeHead(200, {
      //                        'content-type': 'text/plain'
      //                    });
      //                    res.write('received fields:\n\n ' + fields);
      //                    res.write('\n\n');
      res.end();

      //console.log(files);
    });
  form.parse(req);
  //            form.parse(req, function(err, fields, files) {
  //                var retFiles = JSON.stringify(files);
  //                console.log(retFiles);
  //
  //                console.log('---------------------------here is the filels panel --------------------------------------------------');
  //                return;
  //            });



});

//save the landing page in db
router.post("/api/saveLandingPage", function(req, res) {

  var _landingPageProductid = req.body.landingPageProductId,
    _landingPageHeading = req.body.langingPageHeading,
    _landingPageDetails = req.body.landingPagedetails,
    _landingPageLogoUrl = req.body.landingPageLogoUrl,
    _langingPageBgColor = req.body.langingPageBgColor;

  shopifModal.findOne({
    'isCurrent': true
  }, function(shopErr, shopRes) {
    if (shopErr) {} else {
      //post the data to shopify
      shopifyConfig.access_token = shopRes.access_token;
      shopifyConfig.shop = shopRes.shop_name;
      //console.log(config);
      var Shopify = new shopifyAPI(shopifyConfig);

      var post_data = {
        "product": {
          "title": _landingPageHeading,
          "body_html": _landingPageDetails
        }
      };

      Shopify.put('/admin/products/' + _landingPageProductid + '.json',
        post_data,
        function(err, data, headers) {
          if (err) {
            console.log(err);
          } else {
            Products.findOne({
              productId: _landingPageProductid
            }, function(prodErr, prodRes) {
              if (prodErr) {} else if (prodRes == null) {

              } else {
                prodRes.landingPageHeading = _landingPageHeading;
                prodRes.landingPageDetails = _landingPageDetails;
                prodRes.landingPageLogoUrl = _landingPageLogoUrl;
                prodRes.langingPageBgColor = _langingPageBgColor;

                prodRes.save(function(invResErr) {
                  if (invResErr)
                    console.log(invResErr.message);
                  else {
                    console.log("updated");
                    return res.status(201).send({
                      success: true
                    });
                  }
                });
              }
            });
          }
        });
    }
  });
});


router.post("/api/getProductbyProductId", function(req, res) {
  var _productid = req.body.productId;
  shopifModal.findOne({
    'isCurrent': true
  }, function(shopErr, shopRes) {
    if (shopErr) {} else {
      shopifyConfig.access_token = shopRes.access_token;
      shopifyConfig.shop = shopRes.shop_name;
      //console.log(config);
      var Shopify = new shopifyAPI(shopifyConfig);

      Shopify.get('/admin/custom_collections/' + shopRes.collection_id +
        '.json',
        function(ccErr, ccData, ccHeaders) {
          if (ccErr) {
            console.log(ccErr);
          } else {
            Shopify.get('/admin/products/' + _productid + '.json',
              function(err, data, headers) {
                if (err) {
                  console.log(err);
                } else {
                  Products.findOne({
                    productId: _productid
                  }, function(prodErr, prodRes) {
                    if (prodErr) {} else if (prodRes == null) {} else {
                      return res.status(201).send({
                        product: data.product,
                        shop_name: shopRes.shop_name,
                        collection: ccData.custom_collection,
                        prodcolor: prodRes.langingPageBgColor
                      });
                    }
                  });
                }
              });
          }
        });
    }
  });
  //            Products.findOne({
  //                productId: _productid
  //            }, function (prodErr, prodRes) {
  //                if (prodErr) {} else if (prodRes == null) {
  //
  //                } else {
  //                    console.log(prodRes);
  //                    return res.status(201).send({
  //                        success: true,
  //                        product: prodRes
  //                    });
  //                }
  //            });
});

//upload and save the product in shopify and then in database
router.post("/api/getShopifyProduct", function(req, res) {
  shopifModal.findOne({
    'isCurrent': true
  }, function(shopErr, shopRes) {
    if (shopErr) {} else {
      shopifyConfig.access_token = shopRes.access_token;
      shopifyConfig.shop = shopRes.shop_name;
      //console.log(config);
      var Shopify = new shopifyAPI(shopifyConfig);
      Shopify.get('/admin/custom_collections/' + shopRes.collection_id +
        '.json',
        function(ccErr, ccData, ccHeaders) {
          if (ccErr) {
            console.log(ccErr);
          } else {
            Shopify.get('/admin/products.json?collection_id=' +
              shopRes.collection_id,
              function(err, data, headers) {
                if (err) {
                  console.log(err);
                } else {
                  return res.status(201).send({
                    products: data.products,
                    shop_name: shopRes.shop_name,
                    collection: ccData.custom_collection
                  });
                }
              });
          }
        });
    }
  });

});
//end affiliate page apis
module.exports = router;
