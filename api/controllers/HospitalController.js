const HospitalRepo = require("../repos/HospitalRepo");

class HospitalController {
    async createHospital(req, res) {
        try {
            const hospitalCreated = await HospitalRepo.createHospital(req.body);
            if (typeof hospitalCreated === "string")
                return res.status(400).send(hospitalCreated)
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async editHospital(req, res) {
        try {
            const hospitalEdited = await HospitalRepo.editHospital(req.hospital, req.body);
            if (typeof hospitalEdited === "string")
                return res.status(400).send(hospitalEdited)
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async getHospital(req, res) {
        try {
            const hospital = await HospitalRepo.getHospitalById(req.params.hospitalId);
            if (!hospital)
                return res.status(400).send("hospital not found")
            return res.json(hospital)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async getListOfHospitals(req, res) {
        try {
            let skip = req.query.skip === undefined ? 0 : req.query.skip;
            let limit = req.query.limit === undefined ? 10 : req.query.limit;
            const hospitals = await HospitalRepo.getListOfHospitals(skip,limit);
            if (typeof hospitals === "string")
                return res.status(400).send(hospitals)
            return res.json(hospitals)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async delete(req,res){
        try {
            const hospitalDeleted = await HospitalRepo.delete(req.params.hospitalId);
            if (typeof hospitalDeleted === "string")
                return res.status(400).send(hospitalDeleted)
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}

module.exports = new HospitalController();