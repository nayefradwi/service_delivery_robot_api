const Admin = require("../models/Admin");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const secret = process.env.SECRET || "this is a secret";

class AdminRepo {

    async getAdminByEmail(adminEmail){
        return Admin.findOne({adminEmail:adminEmail});
    }

    async getAdminById(id){
        return Admin.findOne({_id:id}, {adminPassword:0});
    }

    async login(email, password){
        const admin = await this.getAdminByEmail(email);
        if(!admin)
            return "email not found";
        if(admin.isLoggedIn)
            return "this user is already logged in";
        const isMatch = await bcrypt.compare(password, admin.adminPassword,)
        if (isMatch) {
            admin.isLoggedIn = true;
            await admin.save();
            const payload = {
                _id: admin._id,
                isRoom: false,
                isNurse:false,
                isAdmin: true,
            };
            return {jwt: await jwt.sign(payload, secret,)};
        } else {
            return "password is incorrect";
        }
    }

    async register(email, password){
        if(!password)
            return "please fill in a password";
        const admin = await this.getAdminByEmail(email);
        if(admin)
            return "email is already taken";
        const salt = await bcrypt.genSalt(10);
        if(salt){
            const hash = await bcrypt.hash(password, salt);
            if(hash){
                const admin = await Admin.create({
                   adminEmail: email,
                   adminPassword:hash,
                });
                if(!admin)
                    return "failed to register";
                return true;
            }
        }
        return "unknown error";
    }
}

module.exports = new AdminRepo();