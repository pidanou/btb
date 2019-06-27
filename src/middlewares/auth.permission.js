const jwt = require('jsonwebtoken'),
    secret = require('../config/env.config').jwt_secret;

module.exports = {

    minimumPermission : (permission) => {
        return (req, res, next) => {
            let userPermissionLevel = req.jwt.permissionLevel;
            if(permission <= userPermissionLevel){
                return next();
            } else {
                return res.status(403).send()
            }
        }
    },

    hasPermissionOrIsSameUser : (permission) => {
        return (req, res, next) => {
            let userPermissionLevel = req.jwt.permissionLevel;
            let userId = req.jwt.userId;
            if(userPermissionLevel>=permission){
                return next()
            } else {
                if(req.params && req.params.userId && userId === req.params.userId){
                    return next()
                } else {
                    res.status(403).send()
                }
            }
        }
    },

    onlySameUser : (req, res, next) => {
        let userId = req.jwt.userId;
        if(req.params && req.params.userId && userId === req.params.userId){
            return next()
        } else {
            res.status(403).send()
        }
    }

}


