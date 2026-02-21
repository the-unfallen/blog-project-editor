const authController = require("../controllers/authController.js");
const Router = require("express");
const router = Router();

router.get("/login", authController.loginPage);

module.exports = router;
