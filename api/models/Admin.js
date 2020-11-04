const mongoose = require("mongoose");

adminSchema = new mongoose.Schema({
    adminName: String,
    adminEmail: String,
    adminPassword: String,
    isHighAccessAdmin: {
        type: Boolean,
        default: false,
    },
    isLoggedIn:{
        type:Boolean,
        default:false,
    }
});

module.exports = mongoose.model("Admin", adminSchema);