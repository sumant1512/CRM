const express = require("express");
const {
  addExpenseCategory,
  updateExpenseCategory,
  getExpenseCategory,
  deleteExpenseCategory,
} = require("../controller/expenseCategory.controller");
const { verifyUser } = require("../middleware/middleware");
const router = express.Router();

router
  .route("/")
  .get([verifyUser], getExpenseCategory)
  .post([verifyUser], addExpenseCategory);

router.route('/:id')
      .put([verifyUser], updateExpenseCategory)
      .delete([verifyUser], deleteExpenseCategory)



// router.route('/expenseCategory/:id').delete([verifyUser], deleteProductInCart)

module.exports = router;
