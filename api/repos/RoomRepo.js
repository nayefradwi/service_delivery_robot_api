const Room = require("../models/Room")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const secret = process.env.SECRET || "this is a secret";
const mongoose = require("mongoose");

class RoomRepo {
    async getRoomByRoomNumberAndBedNumber(roomNum,bedNum){
        return Room.findOne({$and:[{roomNumber:roomNum},{bedNumber:bedNum}]});
    }

    async login(roomNumber, bedNumber, firebase_token, password){
        const room = await this.getRoomByRoomNumberAndBedNumber(roomNumber,bedNumber);
        if (!room)
            return "room and bed combination not found";
        const isMatch = await bcrypt.compare(password, room.password,)
        if (isMatch) {
            room.fcmTokens.push(firebase_token);
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
}
module.exports = new RoomRepo()