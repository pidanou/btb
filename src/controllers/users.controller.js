const userModel = require ("../models/users.model");
const crypto = require("crypto");

module.exports = {

    //create methods

    verifyRegistrationFields : async (req, res, next) => {
        let fieldList = {
            "firstName" : false,
            "lastName" : false,
            "email" : false,
            "password" : false,
        }

        if (req.body.firstName){
            fieldList.firstName = true;
        }

        if (req.body.lastName){
            fieldList.lastName = true;
        }

        if (req.body.password.length>6){
            fieldList.password = true;
        }

        if (isEmail(req.body.email)){
            let user = await userModel.searchByEmail(req.body.email);
            if(!user){
                fieldList.email = true;
            }
        }

        if( fieldList.firstName &&  fieldList.lastName && fieldList.password &&  fieldList.email){
            return next()
        }else{
            res.status(422).send(fieldList)
        }

    },
    insert : async (req, res) => {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac("sha512", salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
        let user = await userModel.createUser(req.body);
        res.status(201).send("user created")
    },

    //search methods

    list : async (req, res) => {
        let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
        let page = 1;
        if (req.query){
            if (req.query.page){
                req.query.page = parseInt(req.query.page);
                page = Number.isInteger(req.query.page) ? req.query.page : 1;
            }
        }
        let list = await userModel.list(limit, page);
        res.status(200).send(list);
    },
    getById : async (req, res) => {
        let user = await userModel.findById(req.params.userId);
        res.status(200).send(user);
    },
    getByEmail : async (req, res) => {
        let user = await userModel.searchByEmail(req.params.userEmail);
        if(user){
            res.status(200).send({user})
        } else {
            res.status(404).send({user})
        }
    },
    searchByKeyword : async (req, res) => {
        let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
        let page = 1;
        if (req.query){
            if (req.query.page){
                req.query.page = parseInt(req.query.page);
                page = Number.isInteger(req.query.page) ? req.query.page : 1;
            }
        }
        let user = await userModel.findUserByKeyword(req.params.keyword, limit, page)
        res.status(200).send(user);
    },

    //patch methods

    patchById : async (req, res) => {
        if(req.body.permissionLevel){
            req.body.permissionLevel = req.jwt.permissionLevel;
        }
        if (req.body.password){
            let salt = crypto .randomBytes(16).toString("base64");
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            req.body.password = salt + "$" + hash;
        }
        await userModel.patchUser(req.params.userId, req.body);
        res.status(200).send({"user patched":req.params.userId})
    },
    adminPatchUserById : async (req, res) => {
        if (req.body.password){
            return res.status(403).send("Can't change password of user")
        }
        await userModel.patchUser(req.params.userId, req.body);
        res.status(200).send({"user patched" : req.params.userId})
    },

    //delete methods

    deleteById : async (req, res) => {
        if(req.jwt.userId === req.params.userId && req.jwt.permissionLevel===3){
            return res.status(403).send("admin cannot delete themselves")
        };
        await userModel.deleteUser(req.params.userId);
        res.status(204).send("User deleted");
    }

};

isEmail = (email) => {
    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return EMAIL_REGEX.test(email);
};

