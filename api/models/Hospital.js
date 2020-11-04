const mongoose = require("mongoose");

hospitalSchema = new mongoose.Schema({
    hospitalName: {
        type:String,
        required:true,
    },
    logoUrl:String,
});

module.exports = mongoose.model("Hospital", hospitalSchema);

//if(typeof hospitalCreated === "string")
//                 return res.status(400).send(hospitalCreated)