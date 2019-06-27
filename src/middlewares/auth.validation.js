const jwt = require('jsonwebtoken'),
    secret = require('../config/env.config.js').jwt_secret,
    loggedOutUserModel = require("../models/loggedOutUsers.model"),
    userModel = require ("../models/users.model"),
    crypto = require ("crypto"),
    mail = require("../mailers/mail.verif");




module.exports = {

    validJWTNeeded : (req, res, next) => {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    req.jwt = jwt.verify(authorization[1], secret);
                    return next();
                }

            } catch (err) {
                return res.status(403).send();
            }
        } else {
            return res.status(401).send();
        }
    },

    verifyIfNotLoggedOut : async (req, res, next) => {
        if (await loggedOutUserModel.findById(req.jwt.userId)){
            res.status(401).send("disconnected")
        } else {
            return next()
        }
    },

    setUserToLoggedOut : async (req, res) => {
        let data = {
            userId : req.jwt.userId,
            expireAt : req.jwt.iat*1000+7200000
        };
        await loggedOutUserModel.insert(data)
        res.status(200).send("disconnected")
    },

    sendVerifToken : async (req, res, next) => {
        let verifToken = crypto.createHmac("sha512", req.body.password).update(req.body.email).digest("base64");
        req.body.verifToken = verifToken;

        mail.sendVerifMail(req.body);

        return next()
    },

    verifyIfVerifiedAccount : async (req, res, next) => {
        let user = await userModel.findByEmail(req.body.email);
        if(user.permissionLevel === 0){
            return res.status(403).send("email is not verified")
        } else {
            return next()
        }
    }

};

