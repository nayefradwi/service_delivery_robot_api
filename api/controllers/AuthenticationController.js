const secret = process.env.SECRET || "this is a secret";
const jwt = require("jsonwebtoken");
class AuthenticationController {
  async authenticate(req, res, next) {
    const token = req.cookies.jwt || "";
    try {
      if (!token) {
        console.log("error, token doesnt exist");
        res.status(400).send("not logged in");
      } else {
        const isVerified = await jwt.verify(token.token.jwt, secret);
        if (!isVerified) return res.status(400).send("operation failed");
        return res.send(true);
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send("operation failed");
    }
  }
}
module.exports = new AuthenticationController();
