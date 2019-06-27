const mongoose = require ("mongoose");
const ticketModel = require ("./tickets.model");

const Schema = mongoose.Schema;

const roomSchema = new Schema({

    campus : {
        enum : ["NDC", "NDL"],
        type : String,
        default : "NDC"
    },
    name : {
        type : String,
        unique : true
    },

});

const roomModel = mongoose.model("rooms", roomSchema);

module.exports = {

    roomModel: mongoose.model("rooms", roomSchema),

    insert : async (roomData)=> {
        try {
            const room = new roomModel(roomData);
            await room.save();
        } catch (err) {
            return err
        }
    },

    findById : async (id) => {
      try{
          let room = await roomModel.findById(id).select("-__v");
          room = room.toJSON();
          return room
      }  catch (err) {
          return err
      }
    },

    findByName : async (name) => {
        try {
            return await roomModel.findOne({name : name})
        }  catch (err) {
            return false
        }
    },

    list : async (perPage, page) => {
        return await roomModel.find()
            .limit(perPage).skip(perPage * (page-1));
    },

    patchById : async (id, roomData) => {
        try {
            let room = await roomModel.findById(id);
            for(let i in roomData){
                room[i] = roomData[i]
            }
            await room.save();
        } catch (err) {
            return err
        }
    },

    deleteRoom : async (id) => {
        try{
            await ticketModel.ticketModel.deleteMany({room : id});
            return await roomModel.findOneAndDelete({_id : id});
        } catch (err) {
            return err
        }
    }

};