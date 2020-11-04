const NurseRepo = require("../repos/NurseRepo")

class NurseController {

    async login(req,res){
        try {
            const reply = await NurseRepo.login(req.body.nurse.nurseId, req.body.fcmToken, req.body.nurse.password);
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
}

module.exports = new NurseController();