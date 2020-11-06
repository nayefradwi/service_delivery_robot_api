const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);
roomSchema = new mongoose.Schema({
    map: {
        type: mongoose.Types.ObjectId,
        ref: "Map",
    },
    roomNumber: Number,
    bedNumber: {
        type: Number,
        default: 0,
    },
    gridDestination: {
        x: Number,
        y: Number,
    },
    password: {
        type: String,
        required: true,
    },
    fcmTokens: [String],
});

roomSchema.index({map:1,roomNumber:1,bedNumber:1, gridDestination:1},{unique:true});
roomSchema.plugin(deepPopulate)

module.exports = mongoose.model("Room", roomSchema);
