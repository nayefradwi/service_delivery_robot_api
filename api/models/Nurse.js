const mongoose = require("mongoose");

nurseSchema = new mongoose.Schema({
    nurseId: String,
    hospital: {
        type: mongoose.Types.ObjectId,
        ref: "Hospital",
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