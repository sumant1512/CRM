
const bcrypt = require("bcrypt");
const connectDB = require("./../config/db");
const { format } = require('date-fns');

const { sendResponseError } = require("../middleware/middleware");
const { checkPassword, newToken,  } = require("../utils/utility.function");


const getExpenseCategory = async (req, res) => {
  
  const expenseCategoryQuery =
    "SELECT id,category_name FROM expenses_managment.expense_category ";
  try {
    connectDB.query(expenseCategoryQuery)
    
    .then(([result]) => {
      if (result.length <= 0) {
        res
          .status(404)
          .send({ status: false, message: "Fail to fetch expense category." });
      } else {
        res.status(200).send({ status: true, message: "Expense Category is fetched succesfully.", data: result});
        return;
      }
    })
    .catch(err => {
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
  

};

const addExpenseCategory = async (req, res) => {
  const { categoryName } = req.body;
  const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
  const expenseCategoryNameExistQuery =
    "SELECT COUNT(*) as count FROM expenses_managment.expense_category WHERE category_name = ?";
  try {
    const expenseCategoryQuery =
    "INSERT INTO expenses_managment.expense_category (category_name,created_at,modified_at) VALUE (?, ?, ?)";

    connectDB.query(expenseCategoryNameExistQuery, [categoryName])
    .then(([row]) =>{
      const expenseCategoryNameExists = row[0].count > 0;

      const userData = [ categoryName, currentDateTime, currentDateTime ]
      
      if (expenseCategoryNameExists) {
        console.log('Expense Category Name already exists. Please choose another Name.');
        return Promise.reject(new Error('Expense Category Name already exists'));
        // Handle error or inform the user that the email already exists
      } else {
        // Email is unique, proceed with insertion
        return connectDB.query(expenseCategoryQuery, userData);
      }
    })
    .then(([result]) => {
      if (result.length <= 0) {
        res
          .status(404)
          .send({ status: false, message: "Expense Category is not added." });
      } else {
        res.status(200).send({ status: true, message: "Expense Category added succesfully." });
      }
    })
    .catch(err => {
      if (err.message == "Expense Category Name already exists"){
        res.status(500).send({ status: false, message: "Expense Category Name already exists."});
      }
      else{
        sendResponseError(500, "Error in adding expense category. Error- "+err.message,res);
        }
      });
  } catch (err) {
    sendResponseError(500, "Something wrong please try again");
    return;
  }
  

};

const deleteProductInCart = async (req, res) => {
  console.log(req.params);
  // try {
  //   await Cart.findByIdAndRemove(req.params.id)
  //   res.status(200).send({status: 'ok'})
  // } catch (e) {
  //   console.log(err)
  //   sendResponseError(500, `Error ${err}`, res)
  // }
};
module.exports = { addExpenseCategory, deleteProductInCart, getExpenseCategory };
