var express = require('express');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require.main.require('./config'); // get our config file
var User = require.main.require('./app/models/user'); // get our mongoose models
var crypto = require('crypto');


module.exports = function (mongoose, app, apiRoutes) {


    apiRoutes.post('/register', function (req, res) {
        //generate a new salt
        var salt = crypto.randomBytes(16).toString('base64');

        var user = new User({
            email: req.body.email,
            password_hash: this.hash(req.body.password, salt),
            salt: salt,
            admin: false
        });

        user.save(function (err) {
            if (err) throw err;

            console.log("User " + user.email + " successfull");
            res.json({success: true});
        })

    });


    apiRoutes.post('/login', function (req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {

            if (err) throw err;

            if (!user) {
                res.json({success: false, message: 'Authentification failed. User not found'})
            } else if (user) {
                //password match
                if (user.password_hash != this.hash(req.body.password, user.salt)) {
                    res.json({success: false, message: 'Authentification failed. Wrong password'})
                } else {
                    //password correct, generate token
                    var token = jwt.sign({user_id: user._id}, app.get('superSecret'), {
                        expiresIn: 60 * 60
                    });

                    res.json({
                        success: true,
                        message: 'Authentification succeed',
                        token: token

                    });
                }


            }

        });

    });

//route middleware to verify token
    apiRoutes.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    console.log(err);
                    return res.json({success: false, message: 'Failed to authentificate token'})
                } else {
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided'
            });
        }
    });

    apiRoutes.get('/test', function (req, res) {
        res.json({
            user_id: req.decoded.user_id
        });

    });

    apiRoutes.get('/users', function (req, res) {
        User.find({}, function (err, users) {
            res.json(users);
        })
    });

    hash = function (pw, salt) {
        var hash = crypto.createHash('sha512').update(pw + salt).digest('base64');
        return hash;
    }

};