const express = require("express");
const router = express.Router();
const {
  getwallet,
  addwallet,
  updatewallet,
  getwalletById,
} = require("../controller/wallet.controllers");
const { verifyUser } = require("../middleware/middleware");

router
  .route("/")
  .get([verifyUser], getwallet)
  .post([verifyUser], addwallet)
  .put([verifyUser], updatewallet);

router.get("/:id", [verifyUser], getwalletById);

module.exports = router;
