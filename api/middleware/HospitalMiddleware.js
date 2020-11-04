const HospitalRepo = require("../repos/HospitalRepo")

class HospitalMiddleware {

    async getHospital(req, res, next) {
        try {
            const hospital = await HospitalRepo.getHospitalById(req.params.hospitalId);
            if (!hospital)
                return res.status(400).send("hospital not found")
            req.hospital = hospital;
            return next();
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}

module.exports = new HospitalMiddleware();