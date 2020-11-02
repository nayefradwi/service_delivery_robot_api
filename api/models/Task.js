const mongoose = require("mongoose");

taskSchema = new mongoose.Schema({
    room: {
        type: mongoose.Types.ObjectId,
        ref: "Room",
    },
    orderType: {
        type: String,
        enum: ["delivery","receive"],
        default: "delivery"
    },
    necessity:{
        type: mongoose.Types.ObjectId,
        ref: "Necessity",
    },
    description:String,
});

module.exports = mongoose.model("Task", taskSchema);