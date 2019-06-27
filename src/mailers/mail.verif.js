const fs = require ("fs");
const handlebars = require ("handlebars");
const mail = require ("../config/email.config");

const source = fs.readFileSync("public/mails/emailVerif.hbs", "utf8");

const template = handlebars.compile(source);

const options = (email, locals) => {
    return {
        from : {
            name : "B.T.B.",
            address : "no-reply@btb-uplife.com"
        },
        to : email,
        subject : "Welcome to B.T.B. Confirm your account",
        html : template(locals)
    }
};

module.exports = {

    sendVerifMail :  (body) => {
        const token = body.verifToken;
        mail.sendMail(options("pidanoueang@gmail.com"), {token})
    }

};