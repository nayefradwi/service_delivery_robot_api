const NurseRepo = require("../repos/NurseRepo")

class NurseController {

    async login(req, res) {
        try {
            const reply = await NurseRepo.login(req.body);
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
            const registered = await NurseRepo.register(req.body);
            if (typeof registered === "string")
                return res.status(400).send(registered);
            return res.send(true);
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async getNurseByObjectId(req,res){
        try {
            const nurse = await NurseRepo.getNurseByObjectId(req.params.nurseId);
            if (!nurse)
                return res.status(400).send("nurse not found");
            return res.json(nurse);
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async edit(req,res){
        try {
            const registered = await NurseRepo.edit(req.nurse,req.body);
            if (typeof registered === "string")
                return res.status(400).send(registered);
            return res.send(true);
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async getNursesByHospitalId(req,res){
        try {
            let skip = req.query.skip === undefined ? 0 : req.query.skip;
            let limit = req.query.limit === undefined ? 10 : req.query.limit;
            const nurse = await NurseRepo.getNursesByHospitalId(req.params.hospitalId, skip,limit);
            if (!nurse)
                return res.status(400).send("nurses not found");
            return res.json(nurse);
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async delete(req,res){
        try {
            const deleted = await NurseRepo.delete(req.params.nurseId);
            if (!deleted)
                return res.status(400).send("failed to delete");
            return res.send(true);
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}

module.exports = new NurseController();