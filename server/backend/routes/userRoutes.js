const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  activateUser,
  resetPassword,
  getAllAdmin,
} = require("../controller/user.controller");
const { verifyUser } = require("../middleware/middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/admins", getAllAdmin);

router.route("/activate/:id").put([verifyUser], activateUser);

router.route("/reset-password").post([verifyUser], resetPassword);

router.route("/").post([verifyUser], getAllUser);
router.route("/:id").get([verifyUser], getUserById);

module.exports = router;
