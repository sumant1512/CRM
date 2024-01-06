const express = require("express");
const {
  addExpenseCategory,
  updateExpenseCategory,
  getExpenseCategory,
} = require("../controller/expenseCategory.controller");
const { verifyUser } = require("../middleware/middleware");
const router = express.Router();

router.route("/").post([verifyUser], addExpenseCategory);

router.route("/:adminId").get([verifyUser], getExpenseCategory);

router.route("/:id").put([verifyUser], updateExpenseCategory);

// router.route('/expenseCategory/:id').delete([verifyUser], deleteProductInCart)

module.exports = router;
