const mongoose = require("mongoose");

necessitySchema = new mongoose.Schema({
    name: String,
    iconUrl: String,
});

module.exports = mongoose.model("Necessity", necessitySchema);