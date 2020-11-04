const Nurse = require("../models/Nurse")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const secret = process.env.SECRET || "this is a secret";
const mongoose = require("mongoose");

class NurseRepo {

    async getNurseFromNurseId(nurseId) {
        return Nurse.findOne({nurseId: nurseId});
    }

    async login(nurseLoggingIn) {
        const nurse = await this.getNurseFromNurseId(nurseLoggingIn.nurseId);
        if (!nurse)
            return "nurse could not be found";
        if (nurse.isLoggedIn)
            return "this user is already logged in";
        const isMatch = await bcrypt.compare(nurseLoggingIn.password, nurse.password,)
        if (isMatch) {
            nurse.fcmTokens = nurseLoggingIn.fcmToken;
            nurse.isLoggedIn = true;
            await nurse.save();
            const payload = {
                _id: nurse._id,
                isRoom: false,
                isNurse: true,
                isAdmin: false,
            };
            return {jwt: await jwt.sign(payload, secret,)};
        } else {
            return "password is incorrect";
        }
    }

    async register(nurse) {
        if (!nurse.password)
            return "please fill in a password";
        const nurseFound = await this.getNurseFromNurseId(nurse.nurseId);
        if (nurseFound)
            return "nurse id already exists";
        const salt = await bcrypt.genSalt(10);
        if (salt) {
            const hash = await bcrypt.hash(nurse.password, salt);
            if (hash) {
                const admin = await Nurse.create({
                    nurseId: nurse.nurseId,
                    hospital: nurse.hospital,
                    password: hash,
                });
                if (!admin)
                    return "failed to register";
                return true;
            }
        }
        return "unknown error";
    }

    async deleteAllNursesByHospitalId(hospitalId) {
        return Nurse.delete({hospital: hospitalId});
    }
}

module.exports = new NurseRepo();