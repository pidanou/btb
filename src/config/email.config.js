const nodemailer = require("nodemailer");
const config = require ("./env.config");

let transport = nodemailer.createTransport({

    service : config.MAIL_SERVICE,
    auth: {
        user : config.MAIL_USERNAME,
        pass : config.MAIL_PASSWORD
    }

});

module.exports = {

    transport,

    sendMail : (options) => {
        transport.sendMail(options, (err, info)=>{
            if(err) {
                console.log(err)
            }
            if(info){
                console.log(info)
            }
            return null;
        })
    }

};