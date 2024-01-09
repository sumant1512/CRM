const express = require("express");
const router = express.Router();
const {
  getExpense,
  addExpense,
  updateExpense,
  getExpenseById,
  deleteExpenseById,
} = require("../controller/expense.controllers");
const { verifyUser } = require("../middleware/middleware");

router
  .route("/")
  .post([verifyUser], addExpense)
  .put([verifyUser], updateExpense);

router
  .route("/filter")
  .post([verifyUser], getExpense)

router
  .route("/:id")
  .get([verifyUser], getExpenseById)
  .delete([verifyUser], deleteExpenseById);

module.exports = router;
