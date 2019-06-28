const loginController = require("../controllers/login.controller");
const authValidation = require ("../middlewares/auth.validation");

module.exports = {

    authRoutesConfig : (app) => {
        app.post('/login', [
            loginController.hasAuthValidFields,
            loginController.isPasswordAndUserMatch,
            authValidation.verifyIfVerifiedAccount,
            loginController.login
        ]);

        app.post("/logout",[
            authValidation.validJWTNeeded,
            authValidation.setUserToLoggedOut
        ]);


    }

};