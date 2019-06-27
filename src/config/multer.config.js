const multer = require ("multer");
const jwt = require ("jsonwebtoken");
const config = require ("../config/env.config");
const ticketModel = require("../models/tickets.model");

function verifyAdminForPatch (req) {
    if (req.params.ticketId) {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return false
                } else {

                    let userPermission = jwt.verify(authorization[1], config.jwt_secret).permissionLevel;
                    if (userPermission > 2) {
                        return true
                    }
                }
                return false
            } catch (err) {
                return false
            }
        }
    } else {
        return false
    }
}

async function verifyIfSameUser(req){
    let author = await ticketModel.findById(req.params.ticketId).author;
    if (req.params.ticketId) {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return false
                } else {

                    let userId = jwt.verify(authorization[1], config.jwt_secret).userId;
                    if (userId === author) {
                        return true
                    }
                }
                return false
            } catch (err) {
                return false
            }
        }
    } else {
        return false
    }
}

function isLoggedIn(req) {

    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return false
            } else {
                if (jwt.verify(authorization[1], config.jwt_secret)) {
                    req.body.userId = jwt.verify(authorization[1], config.jwt_secret).userId;
                    return true
                }
            }
        } catch (err) {
            return false
        }
    } else {
        return false
    }

}

function verifField (req) {
    let fieldList = {
        title : false,
        message : false,
        category : false,
        response : false
    };

    if(req.body.title && req.body.title.trim() !== ""){
        fieldList.title = true;
    }

    if(req.body.message && req.body.message.trim() !== ""){
        fieldList.message = true;
    }

    if(req.body.category && ticketModel.ticketModel.schema.path("category").enumValues.includes(req.body.category)){
        fieldList.category = true;
    }

    if(!req.body.response){
        fieldList.response = true;
    }
    console.log("fieldlist", fieldList)

    return fieldList.title &&  fieldList.message && fieldList.category && fieldList.response
}

async function isValid (req, file) {
    /*if (req.params.ticketId){
        if(verifyAdminForPatch(req)){
            return true
        } else {

        }
    }

    else {
        if(isLoggedIn(req)){
            return true
        }
    }*/
    console.log("same user", await verifyIfSameUser(req));
    return false//isLoggedIn(req) && verifField(req) && file.mimetype.match(/jpe|jpeg|png|gif$i/)
}


const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb (null, './src/images')
    },

    filename : function (req, file, cb) {
        cb(null, file.originalname);
    },

});

module.exports = {
    upload : multer({
        storage : storage,
        fileFilter : async (req, file, cb) => {
            cb(null, await isValid(req, file))
        }
    })
} ;


