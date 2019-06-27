const roomModel = require("../models/rooms.model");

module.exports = {

    //creating
    validRoomFields : (req, res, next) => {

        let fieldList = {
            campus : false,
            name : false
        };

        if (roomModel.roomModel.schema.path("campus").enumValues.includes(req.body.campus)){
            fieldList.campus = true;
        }

        if (req.body.name){
            fieldList.name = true;
        }

        if(fieldList.campus && fieldList.name){
            return next()
        } else {
            res.status(422).send(fieldList)
        }
    },
    insert : async (req, res) => {
        try {
            if(!await roomModel.findByName(req.body.name)){
                await roomModel.insert(req.body);
                res.status(200).send("created");
            } else {
                res.status(409).send("already existing")
            }
        } catch (err) {
            return err
        }
    },

    //getting
    getById : async (req, res) => {
        let room = await roomModel.findById(req.params.roomId);
        res.status(200).send(room);
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
        let list = await roomModel.list(limit, page);
        res.status(200).send(list);
    },

    //patching
    patchById : async (req, res) => {
        await roomModel.patchById(req.params.roomId, req.body);
        res.status(200).send("room patched")
    },

    //delete
    delete : async (req, res) => {
        await roomModel.deleteRoom(req.params.roomId);
        res.status(200).send("deleted")
    }


};

