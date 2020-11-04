const RoomRepo = require("../repos/RoomRepo");

class RoomController {

    async login(req, res) {
        try {
            const reply = await RoomRepo.login(req.body.room.roomNumber, req.body.room.bedNumber, req.body.fcmToken, req.body.room.password);
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


}

module.exports = new RoomController();