'use strict';
const mongoose = require("mongoose");
const config = require("../config/env.config");

const mongo = {
    uri : config.DB_URI,
    opt : {
        useNewUrlParser : true,
        useCreateIndex: true
    }
};

module.exports = {

    connect : () => {
        return mongoose.connect(mongo.uri, mongo.opt)
            .then(() => {
                return mongoose.connection
            })
    }

};