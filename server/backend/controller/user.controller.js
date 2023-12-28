const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./../config/db");
const { format } = require('date-fns');

const { sendResponseError } = require("../middleware/middleware");
const { checkPassword, newToken } = require("../utils/utility.function");

const signUpUser = async (req, res) => {
  const { firstName, lastName, email, password,mobileNumber,roleName,supervisorId } = req.body;
  const registerQuery =
    "INSERT INTO expenses_managment.user (first_name, last_name, email, password,mobile_number,is_active,role_id,supervisor_id,transaction_count, created_at,modified_at ) VALUES (?, ?, ?, ?, ?, ?, (SELECT id FROM expenses_managment.user_role WHERE role_name = ?), ?, ?, ?, ?)";
  try {
    const passwordHash = await bcrypt.hash(password, 8);
    const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    
    const checkEmailQuery = 'SELECT COUNT(*) as count FROM expenses_managment.user WHERE email = ?';
    connectDB.query(checkEmailQuery,email)
      .then(([rows]) => {
        const emailExists = rows[0].count > 0;
        const trans_count = 0;

        const userData = [ firstName, lastName, email, passwordHash, mobileNumber, 1, roleName, supervisorId, trans_count, currentDateTime, currentDateTime ]
        
        if (emailExists) {
          console.log('Email already exists. Please choose another email.');
          return Promise.reject(new Error('Email already exists'));

          // Handle error or inform the user that the email already exists
        } else {
          // Email is unique, proceed with insertion
          return connectDB.query(registerQuery, userData);
        }
        })
      .then(([result]) =>{
        if (result) {
          return connectDB.query('INSERT INTO expenses_managment.wallet (user_id,amount) VALUES (?, ?) ', [result.insertId, 0]);
          }
        else{
          return Promise.reject(new Error('User not registered'));
        }
        })
      .then(([result]) => {
          if (result) {
            res.status(201).send({
              status: true,
              message: "Sucessfully account Register.",
            });
          }
          else{
            return Promise.reject(new Error('User not registered'));
          }
          // Proceed with further operations using the user details if needed
        })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          status: false,
          message: "User not registered. Please check error - " + err,
        });
      })
    
  } catch (err) {
    console.log("Error : ", err);
    sendResponseError(500, "Something wrong please try again", res);
    return;
  }
};

const signInUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const loginQuery =
    "SELECT id, first_name, last_name, email, password, role_id, supervisor_id, transaction_count  FROM expenses_managment.user WHERE email=? and is_active=1";
  try {
    connectDB.query(loginQuery, [email])
    .then(([result]) => {
      if (result.length <= 0) {
        res
          .status(404)
          .send({ status: false, message: "User is not registered or is Inactive." });
      } else {
        bcrypt
          .compare(password, result[0].password)
          .then(function (isAuthinticated) {
            if (isAuthinticated) {
              const authToken = newToken(result[0]);
              delete result[0].password;
              const response = {
                ...result[0],
                authToken: authToken,
              };
              res.status(200).send({ status: true, data: response });
            } else {
              res.status(401).send({
                status: false,
                message: "Incorrect Email or Password.",
              });
            }
          });
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

const getUser = async (req, res) => {
  res.status(200).send({ user: req.user });
};
module.exports = { signUpUser, signInUser, getUser };
