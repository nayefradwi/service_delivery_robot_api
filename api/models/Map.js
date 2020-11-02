const mongoose = require("mongoose");

mapSchema = new mongoose.Schema({
    imageUrl: String,
    floorNumber: Number,
    hospital: {
        type: mongoose.Types.ObjectId,
        ref: "Hospital",
    },
});

module.exports = mongoose.model("Map", mapSchema);