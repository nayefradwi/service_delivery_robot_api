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


}

module.exports = new RoomController();