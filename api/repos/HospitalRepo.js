const mongoose = require("mongoose");
const Hospital = require("../models/Hospital");
const NurseRepo = require("../repos/NurseRepo");
const MapRepo = require("../repos/MapRepo");
class HospitalRepo {

    async getHospitalById(hospitalId){
        return Hospital.findOne({_id:hospitalId});
    }
    async createHospital(hospital){
        const hospitalCreated = Hospital.create({
            hospitalName:hospital.hospitalName,
            logoUrl:hospital.logoUrl,
        });
        if(!hospitalCreated)
            return "failed to create hospital";
        return true;
    }

    async editHospital(hospital, newHospital){
        hospital.hospitalName = newHospital.hospitalName;
        hospital.logoUrl = newHospital.logoUrl;
        const edited = await hospital.save();
        if(!edited)
            return "failed to edit hospital";
        return edited;
    }

    async getListOfHospitals(skip, limit){
        return Hospital.find().skip(parseInt(skip)).limit(parseInt(limit));
    }

    async delete(hospitalId){
        await NurseRepo.deleteAllNursesByHospitalId(hospitalId);
        await MapRepo.deleteAllMapsByHospitalId(hospitalId);
        return Hospital.deleteOne({_id:hospitalId});
    }
}

module.exports = new HospitalRepo();