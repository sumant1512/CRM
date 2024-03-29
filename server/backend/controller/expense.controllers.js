const connectDB = require("../config/db");
const { format } = require("date-fns");

const {
  sendResponseError,
  incrementTransactionCount,
} = require("../middleware/middleware");

const getExpense = async (req, res) => {
  const { adminId } = req.params;

  const getAllExpenseQuery =
    "SELECT expenses.id, category_id as categoryId, expense_category.category_name as categoryName,\
     user_id as userId, first_name as firstName, last_name as lastName, expenses.admin_id as adminId,\
      description, expense_amount as expenseAmount, archived, expenses.created_at as createdAt FROM expenses\
      LEFT JOIN user ON user.id = expenses.user_id\
      LEFT JOIN expense_category on expenses.category_id = expense_category.id where expenses.admin_id =? and archived = 0";
  const getAllExpenseData = [adminId];

  try {
    connectDB
      .query(getAllExpenseQuery, getAllExpenseData)
      .then(([result]) => {
        if (result.length <= 0) {
          res.status(200).send({
            status: false,
            message: "No expense data to show.",
          });
        } else {
          res.status(200).send({
            status: true,
            message: "Expense data fetch succesfully.",
            data: result,
          });
        }
      })
      .catch((err) => {
        sendResponseError(
          500,
          "Error in fetching expense. Error- " + err.message,
          res
        );
      });
  } catch (err) {
    console.log(err);
    sendResponseError(500, "Something went wrong. Please try again");
  }
};

const getExpenseById = async (req, res) => {
  const expenseId = req.params.id;

  const getEachExpenseQuery =
    "SELECT * FROM expenses_managment.expenses  WHERE id = ? and archived = 0";
  try {
    connectDB
      .query(getEachExpenseQuery, [1, expenseId])
      .then(([result]) => {
        if (result.length <= 0) {
          // return Promise.reject(new Error('Failed to delete expenses.'));
          res.status(500).send({
            status: false,
            message: "Failed to fetch expense data.",
          });
          // Handle error or inform the user that the email already exists
        } else {
          res.status(200).send({
            status: true,
            message: "Expense data fetch succesfully.",
            data: result,
          });
        }
      })
      .catch((err) => {
        sendResponseError(
          500,
          "Error in fetching expense. Error- " + err.message,
          res
        );
      });
  } catch (err) {
    sendResponseError(500, "Something went wrong. Please try again");
  }
};

const addExpense = async (req, res) => {
  try {
    const { expenseAmount, categoryId, description, userId, adminId } =
      req.body;
    const roleType = await incrementTransactionCount(userId, adminId, res);

    const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    if (roleType !== "superadmin") {
      const createExpenseQuery =
        "INSERT INTO expenses_managment.expenses (category_id, user_id, admin_id, expense_amount, description, archived, created_at, modified_at ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const updateWalletQuery =
        "UPDATE expenses_managment.wallet SET amount = amount - ?, modified_at = NOW() WHERE user_id = ?";

      const expenseData = [
        categoryId,
        userId,
        adminId,
        expenseAmount,
        description,
        0,
        currentDateTime,
        currentDateTime,
      ];

      const [result] = await connectDB.query(createExpenseQuery, expenseData);

      if (roleType === "admin") {
        if (result.length <= 0) {
          res
            .status(404)
            .send({ status: false, message: "Expense is not added." });
        } else {
          res
            .status(200)
            .send({ status: true, message: "Expense added successfully." });
        }
      } else {
        const walletData = [expenseAmount, userId];
        if (result) {
          const [walletResult] = await connectDB.query(
            updateWalletQuery,
            walletData
          );

          if (walletResult.length <= 0) {
            res
              .status(404)
              .send({ status: false, message: "Expense is not added." });
          } else {
            res
              .status(200)
              .send({ status: true, message: "Expense added successfully." });
          }
        } else {
          throw new Error("Fail to add Expenses.");
        }
      }
    } else {
      res.status(400).send({
        status: false,
        message:
          "User is not admin or employee. Feature is only for admin and employee.",
      });
    }
  } catch (err) {
    if (err.message === "Fail to add Expenses.") {
      res.status(500).send({ status: false, message: "Fail to add Expenses." });
    } else {
      sendResponseError(
        500,
        "Error in adding expense. Error- " + err.message,
        res
      );
    }
  }
};

const updateExpense = async (req, res) => {
  try {
    const {
      expenseId,
      expenseAmount,
      categoryId,
      description,
      userId,
      adminId,
    } = req.body;

    const roleType = await incrementTransactionCount(userId, adminId, res);

    if (roleType !== "superadmin") {
      const getExpenseAmountQuery =
        "SELECT expense_amount FROM expenses_managment.expenses WHERE id = ? and archived = 0";
      const expenseUpdateQuery =
        "UPDATE expenses_managment.expenses SET category_id = ?, expense_amount = ?, description = ?, modified_at = NOW() WHERE id = ?";
      const walletUpdateQuery =
        "UPDATE expenses_managment.wallet SET amount = amount + ? - ?, modified_at = NOW() WHERE user_id = ? ";

      const [result] = await connectDB.query(getExpenseAmountQuery, [
        expenseId,
      ]);

      if (result.length <= 0) {
        throw new Error("Failed to update expenses.");
      }

      const oldExpenseAmount = result[0].expense_amount;
      const expenseUpdatedData = [
        categoryId,
        expenseAmount,
        description,
        expenseId,
      ];

      const [updateResult] = await connectDB.query(
        expenseUpdateQuery,
        expenseUpdatedData
      );

      if (updateResult.length <= 0) {
        res
          .status(404)
          .send({ status: false, message: "Expense is not updated." });
      } else {
        const walletUpdateData = [oldExpenseAmount, expenseAmount, userId];
        const [walletResult] = await connectDB.query(
          walletUpdateQuery,
          walletUpdateData
        );

        if (walletResult) {
          res.status(200).send({
            status: true,
            message: "Expense is updated successfully.",
          });
        } else {
          res
            .status(500)
            .send({ status: false, message: "Failed to update expenses." });
        }
      }
    } else {
      res.status(400).send({
        status: false,
        message:
          "User is not admin or employee. Feature is only for admin and employee.",
      });
    }
  } catch (err) {
    if (err.message === "Failed to update expenses.") {
      res
        .status(500)
        .send({ status: false, message: "Failed to update expenses." });
    } else {
      sendResponseError(
        500,
        "Error in updating expense. Error- " + err.message,
        res
      );
    }
  }
};

const deleteExpenseById = async (req, res) => {
  const expenseId = req.params.id;

  const expenseDeleteQuery =
    "UPDATE expenses_managment.expenses SET archived = ?,modified_at = NOW() WHERE id = ?";
  try {
    connectDB
      .query(expenseDeleteQuery, [1, expenseId])
      .then(([result]) => {
        if (result.length <= 0) {
          // return Promise.reject(new Error('Failed to delete expenses.'));
          res
            .status(500)
            .send({ status: false, message: "Failed to delete expenses." });
          // Handle error or inform the user that the email already exists
        } else {
          res
            .status(200)
            .send({ status: true, message: "Expense deleted succesfully." });
        }
      })
      .catch((err) => {
        sendResponseError(
          500,
          "Error in deleting expense. Error- " + err.message,
          res
        );
      });
  } catch (err) {
    console.log(err);
    sendResponseError(500, "Something went wrong. Please try again");
    return;
  }
};

module.exports = {
  getExpense,
  addExpense,
  updateExpense,
  getExpenseById,
  deleteExpenseById,
};
