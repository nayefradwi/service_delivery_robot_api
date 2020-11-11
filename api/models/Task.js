const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);
taskSchema = new mongoose.Schema({
    room: {
        type: mongoose.Types.ObjectId,
        ref: "Room",
    },
    orderType: {
        type: String,
        enum: ["delivery", "receive"],
        default: "delivery"
    },
    necessity: {
        type: mongoose.Types.ObjectId,
        ref: "Necessity",
    },
    status: {
        type: String,
        enum: ["pending", "waiting for approval", "completed", "robot status", "accepted", "rejected"],
        default: "waiting for approval"
    },
    description: String,
    creationDate: {
        type: Date,
        default: Date.now(),
    },
    lastTimeStatusUpdated: {
        type: Date,
        default: Date.now(),
    },
});
taskSchema.plugin(deepPopulate,{
    populate:{
        "room.map":{
            select:['_id','imageUrl','floorNumber']
        },
        "room":{
            select: ["bedNumber","map","gridDestination","roomNumber", "fcmTokens"]
        }
    }
})

module.exports = mongoose.model("Task", taskSchema);