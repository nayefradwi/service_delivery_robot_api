const mongoose = require("mongoose");

hospitalSchema = new mongoose.Schema({
    hospitalName: String,
});

module.exports = mongoose.model("Hospital", hospitalSchema);