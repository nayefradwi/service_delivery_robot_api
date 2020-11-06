const RoomRepo = require("../repos/RoomRepo");

class RoomController {

    async login(req, res) {
        try {
            const reply = await RoomRepo.login(req.body);
            if (typeof reply == "string")
                return res.status(400).send(reply);
            return res.cookie("jwt", {
                token: reply,
                httpOnly: true,
                secure: true,
            }).json({
                success: true,
                token: reply.jwt,
            })
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async register(req, res) {
        try {
            const registered = await RoomRepo.register(req.body);
            if (typeof registered === "string")
                return res.status(400).send(registered);
            return res.send(true);
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async getRoom(req,res){
        try {
            const room = await RoomRepo.getRoom(req.params.roomId);
            if (!room)
                return res.status(400).send("room not found")
            return res.send(room)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async editRoom(req,res){
        try {
            const room = await RoomRepo.editRoom(req.room,req.body);
            if(typeof room === "string")
                return res.status(400).send(room)
            if (!room)
                return res.status(400).send("failed to edit room")
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async deleteRoom(req,res){
        try {
            const roomDeleted = await RoomRepo.deleteRoom(req.params.roomId);
            if (!roomDeleted)
                return res.status(400).send("failed to delete room")
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async getListOfRoomsByMapId(req,res){
        try {
            const rooms = await RoomRepo.getListOfRoomsByMapId(req.params.mapId);
            if (!rooms)
                return res.status(400).send("failed to fetch rooms")
            return res.send(rooms)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }


}

module.exports = new RoomController();