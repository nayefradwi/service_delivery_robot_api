const Nurse = require("../models/Nurse")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const secret = process.env.SECRET || "this is a secret";
const mongoose = require("mongoose");
class NurseRepo {

    async getNurseFromNurseId(nurseId){
        return Nurse.findOne({nurseId:nurseId});
    }

    async login(nurseId, fcmToken, password){
        const nurse = await this.getNurseFromNurseId(nurseId);
        if(!nurse)
            return "nurse could not be found";
        if(nurse.isLoggedIn)
            return "this user is already logged in";
        const isMatch = await bcrypt.compare(password, nurse.password,)
        if (isMatch) {
            nurse.fcmTokens = fcmToken;
            nurse.isLoggedIn = true;
            await nurse.save();
            const payload = {
                _id: nurse._id,
                isRoom: false,
                isNurse:true,
                isAdmin: false,
            };
            return {jwt: await jwt.sign(payload, secret,)};
        } else {
            return "password is incorrect";
        }
    }
}
module.exports = new NurseRepo();