const express = require("express");
const router = express.Router();
const {
  getwallet,
  updatewallet,
  getwalletById,
} = require("../controller/wallet.controllers");
const { verifyUser } = require("../middleware/middleware");

router.route("/")
      .put([verifyUser], updatewallet);

router.get("/:adminId", [verifyUser], getwallet);

module.exports = router;
