const NecessityRepo = require("../repos/NecessityRepo");
class NecessityController {

    async createNecessity(req, res){
        try {
            const necessityCreated = await NecessityRepo.createNecessity(req.body);
            if (typeof necessityCreated === "string")
                return res.status(400).send(necessityCreated)
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async delete(req,res){
        try {
            const necessityDeleted = await NecessityRepo.delete(req.params.id);
            if (!necessityDeleted)
                return res.status(400).send("could not delete necessity")
            return res.send(true)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
    async getNecessities(req,res){
        try {
            const necessities = await NecessityRepo.getNecessities();
            if (!necessities)
                return res.status(400).send("could not load necessities")
            return res.send(necessities)
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}
module.exports = new NecessityController();