const express = require("express");
const {
  registerController,
  loginController,
} = require("../controllers/userController");

//router object

const router = express.Router();

//Routes
//register || login
router.post("/register", registerController);
router.post("/login", loginController);

//export
module.exports = router;
