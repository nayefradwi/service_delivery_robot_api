const AdminRepo = require("../repos/AdminRepo")
class AdminController {

    async login(req,res){
        try {
            const reply = await AdminRepo.login(req.body.email,req.body.password);
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

    async register(req,res){
        try {
            const reply = await AdminRepo.register(req.body.email, req.body.password);
            if(typeof reply === "string")
                return res.status(400).send(reply);
            return res.send(reply);
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}

module.exports = new AdminController();