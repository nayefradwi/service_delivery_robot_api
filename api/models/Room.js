const mongoose = require("mongoose");

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

module.exports = mongoose.model("Room", roomSchema);
