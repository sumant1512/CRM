
const connectDB = require("./../config/db");
const { format } = require('date-fns');

const { sendResponseError,incrementTransactionCount } = require("../middleware/middleware");

const getExpense = async (req, res) => {
  console.log(req);
  // try {
  //   const products = await Product.find({});
  //   res.json(products);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Server Error" });
  // }
};

const getExpenseById = async (req, res) => {
  console.log(req.params);
  // try {
  //   const product = await Product.findById(req.params.id);

  //   res.json(product);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Server Error" });
  // }
};

const addExpense = async (req, res) => {
  const { expenseAmount,categoryName,description, user_id, admin_id} = req.body;
  const roleType = await incrementTransactionCount(user_id, admin_id,res)

  const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');


  if(roleType != "superadmin"){
    const createExpenseQuery =
    "INSERT INTO expenses_managment.expenses (category_id, user_id, expense_amount, description, archived, created_at, modified_at ) VALUES ((SELECT id FROM expenses_managment.expense_category WHERE category_name = ?), ?, ?, ?, ?, ?, ?)";
    
    const updateWalletQuery = "UPDATE expenses_managment.wallet SET amount = amount - ?,modified_at = NOW() WHERE user_id = ?"
    
    try {
      const expenseData = [categoryName,user_id,expenseAmount,description,0,currentDateTime,currentDateTime]
      connectDB.query(createExpenseQuery, expenseData)
      .then(([result]) =>{
        console.log(result)
        if (roleType == "admin"){
          return result
        }
        else{
          const walletData = [expenseAmount,user_id]
          if (result) {
            // Handle error or inform the user that the email already exists
            return connectDB.query(updateWalletQuery, walletData);
          } else {
            // Email is unique, proceed with insertion
            return Promise.reject(new Error('Fail to add Expenses.'));
          }
        }
      })
      .then(([result]) => {
        if (result.length <= 0) {
          res
            .status(404)
            .send({ status: false, message: "Expense is not added." });
        } else {
          res.status(200).send({ status: true, message: "Expense added succesfully." });
        }
      })
      .catch(err => {
        if (err.message == "Fail to add Expenses."){
          res.status(500).send({ status: false, message: "Fail to add Expenses."});
        }
        else{
          sendResponseError(500, "Error in adding expense. Error- "+err.message,res);
          }
        });
    } catch (err) {
      sendResponseError(500, "Something wrong please try again");
      return;
    }
  }
  else{
    res
      .status(400)
      .send({ status: false, message: "User is not admin or employee. Feature is only for admin and employee." });
  }

};

const updateExpense = async (req, res) => {
  const { expenseId, expenseAmount, categoryName, description, user_id, admin_id} = req.body;
  const roleType = await incrementTransactionCount(user_id, admin_id,res)

  if(roleType != "superadmin"){

    const getExpenseAmountQuery = "SELECT expense_amount FROM expenses_managment.expenses WHERE id = ?"
    const expenseUpdateQuery =
      "UPDATE expenses_managment.expenses SET category_id = (SELECT id FROM expenses_managment.expense_category WHERE category_name = ?),expense_amount =?, description=?, modified_at = NOW() WHERE id = ?";
    const walletUpdateQuery = "UPDATE expenses_managment.wallet SET amount = amount +? - ?,modified_at = NOW() WHERE user_id = ?"
      try {
      const expenseUpdatedData = [categoryName,expenseAmount,description,expenseId] 

      connectDB.query(getExpenseAmountQuery,[expenseId])
      .then(([result]) =>{
        if (result.length <=  0) {
          
          return Promise.reject(new Error('Failed to update expenses.'));
          // Handle error or inform the user that the email already exists
        } else {
          const oldExpenseAmount = result[0].expense_amount
          // Email is unique, proceed with insertion
          return connectDB.query(expenseUpdateQuery, expenseUpdatedData).then(([result]) => ({ oldExpenseAmount, result }));
        }
      })
      .then(({oldExpenseAmount, result}) => {
        const walletUpdateData = [oldExpenseAmount,expenseAmount,user_id]
        if (result.length <= 0) {
          res
            .status(404)
            .send({ status: false, message: "Expense is not updated." });
        } else {
          return connectDB.query(walletUpdateQuery,walletUpdateData )
        }
      })
      .then(([result]) =>{
        if (result){
          res.status(200).send({ status: true, message: "Expense is updated succesfully."});
        }
        else{
          res.status(500).send({ status: false, message: "Failed to update expenses."});
        }
      })
      .catch(err => {
        if (err.message == "Failed to update expenses."){
          res.status(500).send({ status: false, message: "Failed to update expenses."});
        }
        else{
          sendResponseError(500, "Error in updating expense. Error- "+err.message,res);
          }
        });
    } catch (err) {
      sendResponseError(500, "Something wrong please try again");
      return;
    }
  }
  else{
    res
      .status(400)
      .send({ status: false, message: "User is not admin or employee. Feature is only for admin and employee." });
  }

};

module.exports = {
  getExpense,
  addExpense,
  updateExpense,
  getExpenseById
};
