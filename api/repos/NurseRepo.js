const Nurse = require("../models/Nurse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secret = process.env.SECRET || "this is a secret";
const mongoose = require("mongoose");

class NurseRepo {
  async getNurseFromNurseId(nurseId) {
    return Nurse.findOne({ nurseId: nurseId });
  }

  async login(nurseLoggingIn) {
    const nurse = await this.getNurseFromNurseId(nurseLoggingIn.nurseId);
    if (!nurse) return "nurse could not be found";
    // if (nurse.isLoggedIn)
    //     return "this user is already logged in";
    const isMatch = await bcrypt.compare(
      nurseLoggingIn.password,
      nurse.password
    );
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
      return { jwt: await jwt.sign(payload, secret) };
    } else {
      return "password is incorrect";
    }
  }

  async register(nurse) {
    if (!nurse.password) return "please fill in a password";
    const nurseFound = await this.getNurseFromNurseId(nurse.nurseId);
    if (nurseFound) return "nurse id already exists";
    const salt = await bcrypt.genSalt(10);
    if (salt) {
      const hash = await bcrypt.hash(nurse.password, salt);
      if (hash) {
        const admin = await Nurse.create({
          nurseId: nurse.nurseId,
          hospital: nurse.hospital,
          password: hash,
        });
        if (!admin) return "failed to register";
        return true;
      }
    }
    return "unknown error";
  }

  async edit(nurse, newNurse) {
    if (newNurse.nurseId.toString() !== nurse.nurseId.toString()) {
      const otherNurse = await this.getNurseFromNurseId(newNurse.nurseId);
      if (otherNurse) return "nurse id already exists";
    }
    nurse.nurseId = newNurse.nurseId;
    nurse.hospital = newNurse.hospital;
    const edited = await nurse.save();
    if (!edited) return "failed to edit nurse";
    return true;
  }

  async deleteAllNursesByHospitalId(hospitalId) {
    return Nurse.delete({ hospital: hospitalId });
  }

  async getNurseByObjectId(id) {
    return Nurse.findOne({ _id: id }, { password: 0 }).populate("hospital");
  }

  async getNursesByHospitalId(hospitalId, skip, limit) {
    return Nurse.find({ hospital: hospitalId }, { password: 0, hospital: 0 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
  }

  async delete(id) {
    return Nurse.deleteOne({ _id: id });
  }
}

module.exports = new NurseRepo();
