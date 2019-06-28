const fs = require ("fs");
const handlebars = require ("handlebars");
const mail = require ("../config/email.config");
const config = require ("../config/env.config");

const url = config.API_ENDPOINT;

const source = fs.readFileSync("public/mails/emailVerif.hbs", "utf8");

const template = handlebars.compile(source);


const options = (email, locals) => {
    return {
        from : {
            name : "CQFD",
            address : "no-reply@cqfd-uplife.com"
        },
        to : email,
        subject : "Welcome to CQFD. Confirm your account.",
        html : template(locals)
    }
};

module.exports = {

    sendVerifMail :  (body) => {
        const token = body.verifToken;
        mail.sendMail(options(body.email, {token,url}))
    }

};