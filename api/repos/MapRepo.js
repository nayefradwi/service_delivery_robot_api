const Map = require("../models/Map")
const RoomRepo = require("../repos/RoomRepo")
class MapRepo {

    async deleteAllMapsByHospitalId(hospitalId) {
        return Map.delete({hospital: hospitalId})
    }

    async createMap(map) {
        try {
            const hospitalCreated = await Map.create({
                imageUrl: map.imageUrl,
                floorNumber: map.floorNumber,
                hospital: map.hospital,
            });
            if (!hospitalCreated)
                return "failed to create hospital";
            return true;
        } catch (e) {
            return "map for this floor already exists"
        }
    }

    async getMap(mapId) {
        return Map.findOne({_id: mapId}).populate("hospital");
    }

    async editMap(map, newMap) {
        try {
            map.imageUrl = newMap.imageUrl
            map.floorNumber = newMap.floorNumber
            map.hospital = newMap.hospital
            const isEdited = await map.save();
            if (!isEdited)
                return null;
            return true;
        } catch (e) {
            return "map for this floor already exists"
        }
    }

    async deleteMap(mapId) {
        await RoomRepo.deleteAllWithMapId(mapId)
        return Map.deleteOne({_id: mapId});
    }

    async getListOfMaps(hospitalId) {

        return Map.find({hospital: hospitalId})
    }
}

module.exports = new MapRepo();