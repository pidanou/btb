const roomController = require ("../controllers/rooms.controller");
const authValidation = require ("../middlewares/auth.validation");
const authPermission = require ("../middlewares/auth.permission");
const config = require ("../config/env.config");

const ADMIN_ROLE = config.permissionLevels.ADMIN;
const STAFF_ROLE = config.permissionLevels.STAFF;
const USER_ROLE = config.permissionLevels.USER;

module.exports = {

    roomsRouteConfig : (app) => {

        app.post("/room",[
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.minimumPermission(STAFF_ROLE),
            roomController.validRoomFields,
            roomController.insert
        ]);

        app.get("/room/:roomId",[
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            roomController.getById
        ]);

        app.get("/rooms",[
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            roomController.list
        ]);

        app.patch("/room/:roomId",[
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.minimumPermission(ADMIN_ROLE),
            roomController.patchById
        ]);

        app.delete("/room/:roomId", [
            authValidation.validJWTNeeded,
            authValidation.verifyIfNotLoggedOut,
            authPermission.minimumPermission(ADMIN_ROLE),
            roomController.delete
        ])
    }

};