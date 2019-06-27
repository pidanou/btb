const jwtSecret = require('../config/env.config').jwt_secret,
    jwtTTL = require("../config/env.config").jwt_expiration_time;
    jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userModel = require ("../models/users.model");
const loggedOutUserModel = require ("../models/loggedOutUsers.model");


module.exports = {

    hasAuthValidFields : (req, res, next) => {
        let errors = [];

        if (req.body) {
            if (!req.body.email) {
                errors.push('Missing email field');
            }
            if (!req.body.password) {
                errors.push('Missing password field');
            }

            if (errors.length) {
                return res.status(400).send({errors: errors.join(', ')});
            } else {
                return next();
            }
        } else {
            return res.status(400).send({errors: 'Missing email and password fields'});
        }
    },

    isPasswordAndUserMatch : async (req, res, next) => {
        let user = await userModel.findByEmail(req.body.email);

        if(!user){
            res.status(404).send("user not found");
        } else {
            let passwordFields = user.password.split("$");
            let salt = passwordFields[0];
            let hash = crypto.createHmac("sha512", salt).update(req.body.password).digest("base64");
            if(hash === passwordFields[1]) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    permissionLevel: user.permissionLevel,
                    provider: "email",
                    name: user.firstName + ' ' + user.lastName
                };
                return next();
            } else {
                return res.status(400).send({errors: ['Invalid email or password']})
            }
        }
    },

    login : (req, res) => {
        try {
            let refreshId = req.body.userId + jwtSecret;
            let salt = crypto.randomBytes(16).toString("base64");
            let hash = crypto.createHmac("sha512", salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            let token = jwt.sign(req.body, jwtSecret, {expiresIn: jwtTTL});
            let b = new Buffer.from(hash);
            let refresh_token = b.toString("base64");
            loggedOutUserModel.removeFromLoggedOut(req.body.userId);
            res.status(200).send({accessToken: token, "expiresIn": jwtTTL,  refresh_token: refresh_token});
        }catch(err){
            res.status(500).send({errors: err});
        }
    },



};