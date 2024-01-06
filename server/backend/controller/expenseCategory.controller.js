const connectDB = require("./../config/db");
const { format } = require("date-fns");

const {
  sendResponseError,
  incrementTransactionCount,
} = require("../middleware/middleware");

const getExpenseCategory = async (req, res) => {
  const admin_id = req.query.adminId
  // const roleType = await incrementTransactionCount(
  //   req.query.user_id,
  //   req.query.admin_id,
  //   res
  // );
  // if (roleType == "admin") {
    const expenseCategoryQuery =
      "SELECT id,category_name,admin_id FROM expenses_managment.expense_category WHERE admin_id=?";
    try {
      connectDB
        .query(expenseCategoryQuery,[admin_id])
        .then(([result]) => {
          if (result.length <= 0) {
            res.status(404).send({
              status: false,
              message: "Fail to fetch expense category.",
            });
          } else {
            res.status(200).send({
              status: true,
              message: "Expense Category is fetched succesfully.",
              data: result,
            });
            return;
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            status: false,
            message: "Error in Logging in. Please try after some time",
          });
        });
    } catch (err) {
      console.log("Error : ", err);
      sendResponseError(500, "Something wrong please try again");
      return;
    }
  // } else {
  //   console.log("here");
  //   res.status(400).send({
  //     status: false,
  //     message: "User is not admin. Feature is only for admin",
  //   });
  // }
};

const addExpenseCategory = async (req, res) => {
  const { categoryName, user_id, admin_id } = req.body;
  // const roleType = await incrementTransactionCount(user_id, admin_id, res);

  const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  // if (roleType == "admin") {
    const expenseCategoryNameExistQuery =
      "SELECT COUNT(*) as count FROM expenses_managment.expense_category WHERE category_name = ? and admin_id = ?";
    try {
      const expenseCategoryQuery =
        "INSERT INTO expenses_managment.expense_category (category_name,admin_id,created_at,modified_at) VALUE (?, ?, ?, ?)";

      connectDB
        .query(expenseCategoryNameExistQuery, [categoryName,admin_id])
        .then(([row]) => {
          const expenseCategoryNameExists = row[0].count > 0;

          const userData = [categoryName, admin_id, currentDateTime, currentDateTime];

          if (expenseCategoryNameExists) {
            console.log(
              "Expense Category Name already exists. Please choose another Name."
            );
            return Promise.reject(
              new Error("Expense Category Name already exists")
            );
            // Handle error or inform the user that the email already exists
          } else {
            // Email is unique, proceed with insertion
            return connectDB.query(expenseCategoryQuery, userData);
          }
        })
        .then(([result]) => {
          if (result.length <= 0) {
            res.status(404).send({
              status: false,
              message: "Expense Category is not added.",
            });
          } else {
            res.status(200).send({
              status: true,
              message: "Expense Category added succesfully.",
            });
          }
        })
        .catch((err) => {
          if (err.message == "Expense Category Name already exists") {
            res.status(500).send({
              status: false,
              message: "Expense Category Name already exists.",
            });
          } else {
            sendResponseError(
              500,
              "Error in adding expense category. Error- " + err.message,
              res
            );
          }
        });
    } catch (err) {
      sendResponseError(500, "Something wrong please try again");
      return;
    }
  // } else {
  //   res.status(400).send({
  //     status: false,
  //     message: "User is not admin. Feature is only for admin",
  //   });
  // }
};

const updateExpenseCategory = async (req, res) => {
  const categoryId = req.params.id
  const {  categoryName, user_id, admin_id } = req.body;
  const roleType = await incrementTransactionCount(user_id, admin_id, res);

  // const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  if (roleType === "admin") {
    try {
      const expenseCategoryNameExistQuery =
        "SELECT COUNT(*) as count FROM expenses_managment.expense_category WHERE category_name = ? and admin_id = ?";
      const expenseCategoryNameCheck = await connectDB.query(expenseCategoryNameExistQuery, [categoryName,admin_id]);
      const expenseCategoryNameExists = expenseCategoryNameCheck[0][0].count > 0;

      if (expenseCategoryNameExists) {
        return res.status(500).send({
          status: false,
          message: "Expense Category Name already exists.",
        });
      }

      const expenseCategoryQuery =
        "UPDATE expenses_managment.expense_category SET category_name = ?, modified_at = NOW() WHERE id = ?";
      const [result] = await connectDB.query(expenseCategoryQuery, [categoryName, categoryId]);

      if (result.affectedRows > 0) {
        return res.status(200).send({
          status: true,
          message: "Expense Category is updated successfully.",
        });
      } else {
        return res.status(404).send({
          status: false,
          message: "Expense Category is not updated.",
        });
      }
    } catch (err) {
      sendResponseError(
        500,
        "Error in updating expense category. Error- " + err.message,
        res
      );
    }
  } else {
    res.status(400).send({
      status: false,
      message: "User is not admin. Feature is only for admin.",
    });
  }
};



module.exports = {
  addExpenseCategory,
  updateExpenseCategory,
  getExpenseCategory,
};
