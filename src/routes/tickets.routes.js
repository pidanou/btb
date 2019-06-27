const ticketController = require("../controllers/tickets.controller");
const authValidation = require ("../middlewares/auth.validation");
const authPermission = require ("../middlewares/auth.permission");
const config = require("../config/env.config");

const multer = require ("../config/multer.config");
const cloudinary = require("../config/cloudinary.config");

const adminRole = config.permissionLevels.ADMIN;
const staffRole = config.permissionLevels.STAFF;
const userRole = config.permissionLevels.USER;

module.exports = {

    ticketRoutesConfig : (app) => {



        //creating
        /*app.post("/ticket", multer.upload.single("image"),(req, res) => {
            //send to cloudinary
            if(req.file){
                cloudinary.uploads(req.file.path).then((result)=>{
                    let imageData = {
                        imageURL: result.url,
                        imageId : result.id,
                        imageName : result.originalName,
                    };
                    req.body.image = imageData;
                }).then((result)=> {
                    ticketController.insert(req, res);
                    res.send({"ticket created": req.body})
                }).catch((err)=> {
                    console.log(err)
                })
            } else {
                ticketController.insert(req, res);
                res.send({"ticket created": req.body})
            }
        })*/                      //creating with images
        app.post("/ticket",[
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            ticketController.verifyTicketFields,
            ticketController.insert
        ]);

        //getting
        app.get("/ticket/:ticketId",
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            ticketController.getById
        );
        app.get("/tickets",[
            // authValidation.validJWTNeeded
            //authValidation.verifyIfNotLoggedOut,
            ticketController.list
        ])

        //patching
        app.patch("/ticket/:ticketId", [
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.hasPermissionOrIsSameUser(adminRole),
            ticketController.patchTicket
        ]);

        /*app.patch("/ticket2/:ticketId",
            multer.upload.single("image"),
            (req, res) => {
                //send to cloudinary
                if(req.file){
                    cloudinary.uploads(req.file.path).then((result)=>{
                        let imageData = {
                            imageURL: result.url,
                            imageId : result.id,
                            imageName : result.originalName,
                        };
                        req.body.image = imageData;
                        console.log("req body in post", req.body)
                    }).then((result)=> {
                        ticketController.patchTicket(req, res);
                    }).catch((err)=> {
                        console.log(err)
                    })
                } else {
                    ticketController.deleteImageById(req, res);
                    ticketController.patchTicket(req, res)
                }
            }


        );*/                   //patching with images

        app.patch("/ticket/like/:ticketId",[
           authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
           ticketController.addLike
        ]);

        //deleting
        app.delete("/ticket/:ticketId", [
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.hasPermissionOrIsSameUser(staffRole),
            ticketController.deleteById
        ]);



    }

}
