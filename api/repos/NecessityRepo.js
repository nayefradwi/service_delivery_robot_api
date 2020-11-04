const Necessity = require("../models/Necessity")

class NecessityRepo {

    async getNecessityByName(name){
        return Necessity.findOne({name:name})
    }

    async createNecessity(necessity){
        const otherNecessity = await this.getNecessityByName(necessity.name)
        if(otherNecessity)
            return "necessity already exists"
        const necessityCreated = await Necessity.create({
            name:necessity.name,
            iconUrl:necessity.iconUrl,
        })
        if(!necessityCreated)
            return "failed to create";
        return true;
    }
    async delete(id){
        return Necessity.deleteOne({_id:id});
    }
    async getNecessities(){
        return Necessity.find();
    }
}

module.exports = new NecessityRepo();