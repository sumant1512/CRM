const express = require("express");
const router = express.Router();
const {
  getExpense,
  addExpense,
  updateExpense,
  getExpenseById
} = require("../controller/expenseControllers");
const {verifyUser} = require('../middleware/middleware')

router
  .route('/')
  .get([verifyUser], getExpense)
  .post([verifyUser], addExpense)
  .put([verifyUser], updateExpense)


router.get("/:id", getExpenseById);

module.exports = router;
