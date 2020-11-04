const MapRepo = require("../repos/MapRepo");
class MapMiddleware {
    async getMap(req,res,next){
        try {
            const map = await MapRepo.getMap(req.params.mapId);
            if (!map)
                return res.status(400).send("map not found")
            req.map = map;
            return next();
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}

module.exports = new MapMiddleware();