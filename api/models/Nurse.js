const mongoose = require("mongoose");

nurseSchema = new mongoose.Schema({
    nurseId: {
        type:String,
        required: true,
    },
    hospital: {
        type: mongoose.Types.ObjectId,
        ref: "Hospital",
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    fcmToken:{
        type:String,
    },
    isLoggedIn:{
        type:Boolean,
        default:false,
    }
});

module.exports = mongoose.model("Nurse", nurseSchema);