const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketModel = require ("./tickets.model");

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required : true,
        unique : true
    },
    password: String,
    permissionLevel: {
        type: Number,
        required : true,
        enum : [0,1,2,3],
        default : 0
    },
    verifToken : String
});

userSchema.index({'$**': 'text'});

const userModel = mongoose.model('Users', userSchema);

module.exports = {

    userModel : mongoose.model('Users', userSchema),

    //creation

    createUser : async (userData) => {
        const user = new userModel(userData);
        return await user.save();
    },

    //getting

    findUserByKeyword : async (keyword, perPage, page) => {
        try {
            let userArray = await userModel.find({$text: {$search:keyword}})
                .select(["-password", "-__v"])
                .limit(perPage)
                .skip(perPage*(page-1))
            return userArray;
        } catch (err){
            return err
        }
    },

    findById : async (id) => {
        try{
            let user = await userModel.findById(id);
            user = user.toJSON();
            delete user.password;
            delete user.__v;
            return user;
        } catch (err) {
            return err
        }

    },

    findByEmail : async (email) => {
        let user =  await userModel.findOne({"email" : email});
        if(user){
            user = user.toJSON();
            delete user._v;
            return user;
        }
    },

    searchByEmail : async (email) => {
        let user =  await userModel.findOne({"email" : email});
        if(user){
            user = user.toJSON();
            delete user.password;
            delete user.__v;
            return user;
        }
    },

    list : async (perPage, page) => {
        let list = await userModel.find()
            .select(["-password", "-__v"])
            .limit(perPage)
            .skip(perPage*(page-1))
        return list;
    },

    //patching

    patchUser : async (id, userData) => {
        try{
            let user = await userModel.findById(id, userData);
            for (let i in userData){
                user[i] = userData[i];
            }
            user.save();
        } catch(err){
            return err;
        }
    },

    setVerify : async (id) => {
        try {
            let user = await userModel.findById(id);
            user.verifToken = undefined;
            user.save();
            return "ok";
        }  catch (err) {
            return err
        }
    },


    //deleting

    deleteUser : async (id) => {
        try{
            await ticketModel.ticketModel.deleteMany({author : id})
            await userModel.deleteOne({_id: id})
        } catch(err){
            return err
        }
    }

};

