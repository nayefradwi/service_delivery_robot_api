const NurseRepo = require("../repos/NurseRepo");

class NurseMiddleware {
    async getNurse(req, res, next) {
        try {
            const nurse = await NurseRepo.getNurseByObjectId(req.params.nurseId);
            if (!nurse)
                return res.status(400).send("nurse not found");
            req.nurse = nurse;
            return next();
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}

module.exports = new NurseMiddleware()