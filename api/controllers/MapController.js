const MapRepo = require("../repos/MapRepo");
class MapController {
    async createMap(req,res){
        try {
            const mapCreated = await MapRepo.createMap(req.body);
            if (typeof mapCreated === "string")
                return res.status(400).send(mapCreated)
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async getMap(req,res){
        try {
            const map = await MapRepo.getMap(req.params.mapId);
            if (!map)
                return res.status(400).send("map not found")
            return res.send(map)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async editMap(req,res){
        try {
            const mapEdited = await MapRepo.editMap(req.map,req.body);
            if(typeof mapEdited === "string")
                return res.status(400).send(mapEdited)
            if (!mapEdited)
                return res.status(400).send("failed to edit map")
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async deleteMap(req,res){
        try {
            const mapDeleted = await MapRepo.deleteMap(req.params.mapId);
            if (!mapDeleted)
                return res.status(400).send("failed to delete map")
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async getListOfMaps(req,res){
        try {
            const maps = await MapRepo.getListOfMaps(req.params.hospitalId);
            if (!maps)
                return res.status(400).send("failed to delete map")
            return res.send(maps)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }



}
module.exports = new MapController();