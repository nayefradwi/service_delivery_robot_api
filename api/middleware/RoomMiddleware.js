const RoomRepo = require("../repos/RoomRepo")

class RoomMiddleware {
    async getRoom(req, res, next) {
        try {
            const room = await RoomRepo.getRoom(req.params.roomId);
            if (!room)
                return res.status(400).send("map not found")
            req.room = room;
            return next();
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}

module.exports = new RoomMiddleware();