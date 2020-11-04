const mongoose = require("mongoose");

necessitySchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    iconUrl: String,
});

module.exports = mongoose.model("Necessity", necessitySchema);