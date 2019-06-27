const ticketModel = require("../models/tickets.model");
const userModel = require("../models/users.model");
const roomModel = require("../models/rooms.model");

const cloudinary = require("../config/cloudinary.config");
const multer = require('../config/multer.config');

module.exports = {



    //creation
    verifyTicketFields : (req, res, next) => {



        let fieldList = {
            title : false,
            message : false,
            category : false,
            response : false
        };

        if(req.body.title && req.body.title.trim() !== ""){
            fieldList.title = true;
        }

        if(req.body.message && req.body.message.trim() !== ""){
            fieldList.message = true;
        }

        if(req.body.category && ticketModel.ticketModel.schema.path("category").enumValues.includes(req.body.category)){
            fieldList.category = true;
        }

        if(!req.body.response){
            fieldList.response = true;
        }

        if(fieldList.title &&  fieldList.message && fieldList.category && fieldList.response){
            return next()
        } else {
            res.status(422).send(fieldList)
        }
    },
    insert : async (req, res) => {
        let user = req.jwt.userId;
        await ticketModel.createTicket(req.body, user);
        res.status(201).send()
    },

    //getting
    getById : async (req, res) => {
        let ticket = await ticketModel.findById(req.params.ticketId);
        res.status(200).send(ticket)
    },

    list : async (req, res) => {
        let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
        let page = 1;
        if (req.query){
            if (req.query.page){
                req.query.page = parseInt(req.query.page);
                page = Number.isInteger(req.query.page) ? req.query.page : 1;
            }
        }
        let ticketList = await ticketModel.list(limit, page);
        res.status(200).send(ticketList);
    },

    //patching
    patchTicket : async (req, res) => {
        try{
            let ticketUpdated = await ticketModel.patchTicket(req.params.ticketId, req.body);
            res.status(200).send({"ticket updated" : ticketUpdated});
        } catch (err) {
            res.status(422).send(err)
        }
    },

    addLike : async (req, res) => {
        try {
            let ticket = await ticketModel.findById(req.params.ticketId);
            let user = req.jwt.userId;

            if(ticket.like.userLike.includes(user)){
                 res.status(409).send("Liked already")
            } else {
                let like = ticket.like;
                like.number ++;
                like.userLike.push(user);
                await ticketModel.patchTicket(req.params.ticketId, {"like" : like});
                res.status(200).send();
            }
        }  catch (err) {
          res.status(422).send(err);
          console.log(err)
          return err
        }
    },

    //deletion
    deleteById : async (req, res) => {
        await ticketModel.deleteTicket(req.params.ticketId);
        res.status(204).send("ticket deleted");
    },

    deleteImageById : async (req, res) => {
        await ticketModel.deleteImageById(req.params.ticketId)
    }

}