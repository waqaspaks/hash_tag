var express = require('express');
var passport = require('passport');
var http = require('http');
var isLogined = require('connect-ensure-login');
//users model
var Users = require("../models/account.js");

//products model
var Products = require("../models/products.js");

//shpify modal
var shopifModal = require("../models/shopify.js");
var router = express.Router();

//main root
router.get('/', isLogined.ensureLoggedIn(), function (req, res) {
    console.log(req.user.username);
    Products.find({
        userEmail: req.user.username
    }, function (prodErr, prodRes) {
        if (prodErr) {}
        console.log("result for the products");
        console.log(prodRes);
        res.render('dashboard', {
            user: req.user,
            title: 'dashboard',
            products: prodRes
        });
    });
});


router.get('/dashboard', isLogined.ensureLoggedIn(), function (req, res) {
    console.log(req.user.username);
    Products.find({
        userEmail: req.user.username
    }, function (prodErr, prodRes) {
        if (prodErr) {}
        console.log("result for the products");
        console.log(prodRes);
        res.render('dashboard', {
            user: req.user,
            title: 'dashboard',
            products: prodRes
        });
    })

});


router.get('/register', function (req, res) {
    res.render('register', {});
});

router.post('/register', function (req, res) {
    Account.register(new Account({
        username: req.body.username
    }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {
                account: account,
                errorMessage: 'Sorry. That username already exists. Try another one.'
            });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login', {
        user: req.user
    });
});

/*router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});*/
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('login', {
                username: user,
                errMessage: 'invalid username or password'
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/casedesign', isLogined.ensureLoggedIn(), function (req, res) {
    res.render('casedesign', {
        user: req.user,
        title: '#mycase'
    });
});

router.get('/affiliate', function (req, res) {
    res.render('affiliate', {
        user: req.user,
        title: '#mycase'
    });
});

router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

module.exports = router;
