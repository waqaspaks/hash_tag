var express = require('express');
var passport = require('passport');
var http = require('http');
var isLogined = require('connect-ensure-login');
//users model
var Account = require("../models/account.js");

//products model
var Products = require("../models/products.js");

//shpify modal
var shopifModal = require("../models/shopify.js");

//mailgun.com /// hashtagdev@yopmail.com || Apple718
var _mailgunDomain = 'sandbox5d2c8c913561474fb4f0c30d2ad7008e.mailgun.org';
var _mailgunApiKey = 'key-c69d257a028b69387a8a8bff55edb4c3';

var mailgun = require('mailgun-js')({
    apiKey: _mailgunApiKey,
    domain: _mailgunDomain
});

//custom Methods --generate the complex key
var helperMethod = require("../custom_modules/helper-methods/index.js");
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
    res.render('register', {
        title: '#mycase :: register'
    });
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
        user: req.user,
        title: '#mycase :: login'
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

router.post('/api/sendUserPasswordInformation', function (req, res) {
    var _emailAddress = req.body.emailaddress;

    Account.findOne({
        username: _emailAddress
    }, function (dbErr, dbRes) {
        if (dbErr) {
            return res.status(500).send("Fatal Error");
        }

        //See if result is not null
        if (dbRes == null) {
            return res.status(404).send({
                message: "No such user exist in our record"
            });
        } else {
            var passwordResetKey = "";
            var generatedDate;
            helperMethod.generateInvitationKey(40, function (resetErr, resetRes) {
                passwordResetKey = resetRes;
                generatedDate = new Date();
                var numberOfDaysToAdd = 1;

                dbRes.resetPasswordKey = passwordResetKey;
                dbRes.resetPasswordExpDate = generatedDate.setDate(generatedDate.getDate() + numberOfDaysToAdd);
                dbRes.save(function (retErr) {
                    if (retErr) {
                        return res.status(500).send("Fatal Error");
                    } else {
                        var resetPasswordGeneratedLink = passwordResetKey + '_' + generatedDate + '_' + _emailAddress;
                        var retEncodeString = Base64.encode(resetPasswordGeneratedLink)
                            if (retEncodeString == null) {
                                return res.status(500).send("Fatal Error");
                            }
                        console.log(retEncodeString);
                            var mailBody = 'Hey, <br/> \n\
                                        here is the link from where you can reset your password. <br/>\n\
                                        <a href="http://localhost:3000/resetPasswordVerification?sourceKey=' + retEncodeString + '"';

                            var dataMail = {
                                from: 'Admin User <admin@sandbox5d2c8c913561474fb4f0c30d2ad7008e.mailgun.org>',
                                to: _emailAddress,
                                subject: 'Request for reset password',
                                text: mailBody
                            };

                            mailgun.messages().send(dataMail, function (error, body) {
                                if (error) {
                                    return res.status(500).send("Fatal Error on mail");
                                }
                                console.log(body);
                                return res.status(201).send({
                                    mailRetRes: body
                                });

                            });
                    }
                });
            });
        }
    });

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

/////////////
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t;
    },
    decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t;
    },
    _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t;
    },
    _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t;
    }
};
module.exports = router;
