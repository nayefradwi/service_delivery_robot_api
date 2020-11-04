const Room = require("../models/Room")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const secret = process.env.SECRET || "this is a secret";
const mongoose = require("mongoose");

class RoomRepo {
    async getRoomByRoomNumberAndBedNumber(roomNum,bedNum){
        return Room.findOne({$and:[{roomNumber:roomNum},{bedNumber:bedNum}]});
    }

    async login(roomLoggingIn){
        const room = await this.getRoomByRoomNumberAndBedNumber(roomLoggingIn.roomNumber,roomLoggingIn.bedNumber);
        if (!room)
            return "room and bed combination not found";
        const isMatch = await bcrypt.compare(roomLoggingIn.password, room.password,)
        if (isMatch) {
            room.fcmTokens.push(roomLoggingIn.fcmToken);
            await room.save();
            const payload = {
                _id: room._id,
                isRoom: true,
                isNurse:false,
                isAdmin: false,
            };
            return {jwt: await jwt.sign(payload, secret,)};
        } else {
            return "password is incorrect";
        }
    }

    async register(room){
        if(!room.password)
            return "please fill in a password";
        const roomFound = await this.getRoomByRoomNumberAndBedNumber(room.roomNumber,room.bedNumber);
        if(roomFound)
            return "nurse id already exists";
        const salt = await bcrypt.genSalt(10);
        if(salt){
            const hash = await bcrypt.hash(room.password, salt);
            if(hash){
                const roomCreated = await Room.create({
                    map:room.map,
                    roomNumber:room.roomNumber,
                    bedNumber:room.bedNumber,
                    gridDestination:room.gridDestination,
                    password:hash,
                });
                if(!roomCreated)
                    return "failed to register";
                return true;
            }
        }
        return "unknown error";

    }
}
module.exports = new RoomRepo()