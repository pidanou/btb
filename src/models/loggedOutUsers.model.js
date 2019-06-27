const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

let loggedOutUsersSchema = new Schema ({

    userId : {
        type : mongoose.Schema.ObjectId,
        ref : "Users"
    },

    expireAt : {
        type : Date,
        expires : 0,
        default : Date.now()
    }

});

const loggedOutUsersModel = mongoose.model("loggedOut", loggedOutUsersSchema);

module.exports = {

    insert : async (data) => {
        let newUser = new loggedOutUsersModel(data);
        await newUser.save();
    },

    findById : async (id) => {
        let user = await loggedOutUsersModel.findOne({"userId" :id});
        if(user === null) {
            return false
        }
        return user;
    },

    removeFromLoggedOut : async (id) => {
        await loggedOutUsersModel.deleteOne({"userId" : id});
    }

}