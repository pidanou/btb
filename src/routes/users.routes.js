const usersController = require ("../controllers/users.controller");
const authValidation = require("../middlewares/auth.validation");
const authPermission = require("../middlewares/auth.permission");
const config = require("../config/env.config");

const adminRole = config.permissionLevels.ADMIN;
const staffRole = config.permissionLevels.STAFF;
const userRole = config.permissionLevels.USER;

module.exports = {

    userRoutesConfig : (app) => {

        //creation routes
        app.post("/register", [
            usersController.verifyRegistrationFields,
            authValidation.sendVerifToken,
            usersController.insert
        ]);

        app.post("/verify", [

        ]);

        //searching routes

        app.get("/users", [
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.minimumPermission(staffRole),
            usersController.list
        ]);
        app.get("/users/byId/:userId", [
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.hasPermissionOrIsSameUser(staffRole),
            usersController.getById
        ]);
        app.get("/users/byEmail/:userEmail",[
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.minimumPermission(staffRole),
            usersController.getByEmail
        ]);
        app.get("/users/byKeyword/:keyword", [
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.minimumPermission(staffRole),
            usersController.searchByKeyword
        ]);

        //patching routes
        app.patch("/users/:userId", [
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.onlySameUser,
            usersController.patchById
        ]);
        app.patch("/users/admin/:userId", [
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.minimumPermission(adminRole),
            usersController.adminPatchUserById
        ]);

        //delete routes
        app.delete("/users/:userId", [
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.hasPermissionOrIsSameUser(adminRole),
            usersController.deleteById
        ]);


    }

}