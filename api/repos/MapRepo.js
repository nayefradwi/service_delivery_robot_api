const Map = require("../models/Map")
class MapRepo {
    async deleteAllMapsByHospitalId(hospitalId){
        return Map.delete({hospital:hospitalId})
    }
}
module.exports = new MapRepo();