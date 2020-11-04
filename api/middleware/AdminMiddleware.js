const AdminRepo = require("../repos/AdminRepo")

class AdminMiddleware {
    async getAdmin(req, res, next) {
        try {
            const admin = await AdminRepo.getAdminById(req.token._id);
            if (!admin)
                return res.status(400).send("you are not authorized")
            req.admin = admin;
            return next();
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }

    async isHighAdminAccess(req, res, next) {
        try {
            if (req.admin.isHighAccessAdmin)
                return next();
            return res.status(400).send("you are not authorized")
        } catch (e) {
            console.log(e);
            return res.status(400).send("an error occurred")
        }
    }
}

module.exports = new AdminMiddleware();