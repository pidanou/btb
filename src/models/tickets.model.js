const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({

    title : {
        type : String,
        required: true
    },
    date : {
        type : Date,
        default: Date.now()
    },
    message : {
        type: String,
        required: true
    },
    image : {
        imageName : String,
        imageURL : String,
        imageId : String,
        postDate : {
            type : Date,
        }
    },
    response : String,
    room : {
        required: true,
        default : "5d137fd5ce943b094cefa2dd",
        type : mongoose.Schema.Types.ObjectId,
        ref : "rooms"

    },
    category : {
        type : String,
        required : true,
        enum : ["Other", "Hygiene", "Technology", "Furniture"],
        default: "Other"
    },
    otherCategory : String,
    status : {
        type : String,
        enum : ["Sumbitted", "Validated", "Ongoing", "Resolved"],
        default : "Sumbitted"
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users",
        default : "5d13809441cc2e094c359017"
    },
    like : {
        number : {
            type : Number,
            default : 0
        },
        userLike : [{
            type : Schema.Types.ObjectId,
            ref : "Users"
        }]
    }

});

const ticketModel =  mongoose.model("tickets", ticketSchema);

module.exports = {

    ticketModel : mongoose.model("tickets", ticketSchema),

    //creation
    createTicket : async (ticketData, userId) => {
        try{
            const ticket = new ticketModel (ticketData);
            ticket.response = "";
            ticket.author = userId;
            return await ticket.save();
        } catch (err) {
            console.log(err);
            return err
        }
    },

    //getting
    findById : async (id) => {
        try{
            return await ticketModel.findById(id)
                .populate("author room", "-password")
                .select("-__v");
        } catch (err){
            return "ticketModel not found"
        }

    },

    list : async (perPage, page) => {
        return ticketModel.find()
            .populate("author room", "-password -__v")
            .select("-__v")
            .limit(perPage)
            .skip(perPage * (page-1))
    },

    //patching
    patchTicket : async (id, ticketData)=> {
        try{
            let ticket = await ticketModel.findById(id).populate("author");
            for(let i in ticketData){
                ticket[i] = ticketData[i];
            }
            ticket.save();
            return ticket._id
        } catch (err) {
            return "ticket not found"
        }

    },

    //deletion
    deleteTicket : async (ticketId) => {
        try{
            await ticketModel.deleteOne({_id : ticketId});
        } catch (err) {
            return err
        }
    },

    deleteImageById : async (ticketId) => {
        let ticket = await ticketModel.findById(ticketId);
        ticket.image = undefined;
        await ticket.save();
    }

};