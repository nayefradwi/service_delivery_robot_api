const Room = require("../models/Room")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const secret = process.env.SECRET || "this is a secret";
const mongoose = require("mongoose");
const Hospital = require("../models/Hospital");
const Map = require("../models/Map");

class RoomRepo {

    async getRoomByRoomNumberAndBedNumber(roomNum, bedNum, map) {
        return Room.findOne({$and: [{roomNumber: roomNum}, {bedNumber: bedNum}, {map: map}]});
    }

    async getRoomForLogin(roomNum, bedNum, hospitalName, floorNum) {
        const hospital = await Hospital.findOne({hospitalName: hospitalName});
        if (!hospital)
            return null;
        const map = await Map.findOne({hospital: hospital._id, floorNumber: floorNum})
        if (!map)
            return null;
        return Room.findOne({$and: [{roomNumber: roomNum}, {bedNumber: bedNum}, {map: map._id}]});
    }

    async login(roomLoggingIn) {
        const room = await this.getRoomForLogin(roomLoggingIn.roomNumber, roomLoggingIn.bedNumber,
            roomLoggingIn.hospitalName, roomLoggingIn.floorNumber);
        if (!room)
            return "room not found";
        const isMatch = await bcrypt.compare(roomLoggingIn.password, room.password,)
        if (isMatch) {
            room.fcmTokens.push(roomLoggingIn.fcmToken);
            await room.save();
            const payload = {
                _id: room._id,
                isRoom: true,
                isNurse: false,
                isAdmin: false,
            };
            return {jwt: await jwt.sign(payload, secret,)};
        } else {
            return "password is incorrect";
        }
    }

    async register(room) {
        if (!room.password)
            return "please fill in a password";
        const roomFound = await this.getRoomByRoomNumberAndBedNumber(room.roomNumber, room.bedNumber, room.map);
        if (roomFound)
            return "room already exists";
        const salt = await bcrypt.genSalt(10);
        if (salt) {
            const hash = await bcrypt.hash(room.password, salt);
            if (hash) {
                const roomCreated = await Room.create({
                    map: room.map,
                    roomNumber: room.roomNumber,
                    bedNumber: room.bedNumber,
                    gridDestination: room.gridDestination,
                    password: hash,
                });
                if (!roomCreated)
                    return "failed to register";
                return true;
            }
        }
        return "unknown error";
    }

    async deleteAllWithMapId(id) {
        return Room.delete({map: id});
    }

    async getRoom(roomId) {
        const room = await Room.findOne({_id: roomId}, {password: 0}).populate("map");
        return room.deepPopulate("map.hospital")
    }

    async editRoom(room, newRoom) {
        try {
            room.map = newRoom.map
            room.roomNumber = newRoom.roomNumber
            room.bedNumber = newRoom.bedNumber
            room.gridDestination = newRoom.gridDestination
            const isEdited = await room.save();
            if (!isEdited)
                return null;
            return true;
        } catch (e) {
            return "room for this map already exists"
        }
    }

    async deleteRoom(id){
       return Room.deleteOne({_id:id});
    }

    async getListOfRoomsByMapId(id){
        return Room.find({map:id});
    }
}

module.exports = new RoomRepo()