const mongoose = require("mongoose");

mapSchema = new mongoose.Schema({
    imageUrl: String,
    floorNumber: Number,
    hospital: {
        type: mongoose.Types.ObjectId,
        ref: "Hospital",
    },
});

mapSchema.index({floorNumber:1, hospital:1},{unique:true});

module.exports = mongoose.model("Map", mapSchema);