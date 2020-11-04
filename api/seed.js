const AdminRepo = require("./repos/AdminRepo")

let createAdmin = async function() {
    const admin = await AdminRepo.register("naifmazen@icloud.com","12345");
    console.log(admin);
}

module.exports.createAdmin = createAdmin;