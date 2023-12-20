const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./../config/db");
const { format } = require('date-fns');

const { sendResponseError } = require("../middleware/middleware");
const { checkPassword, newToken } = require("../utils/utility.function");

const signUpUser = async (req, res) => {
  const { firstName, lastName, email, password,mobileNumber,roleName } = req.body;
  const registerQuery =
    "INSERT INTO expenses_managment.user (first_name, last_name, email, password,mobile_number,is_active,role_id, created_at,modified_at ) VALUES (?, ?, ?, ?, ?, ?, (SELECT id FROM expenses_managment.user_role WHERE role_name = ?), ?, ?)";
  try {
    const passwordHash = await bcrypt.hash(password, 8);
    const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const userData = [ firstName, 
      lastName,
      email,
      passwordHash,
      mobileNumber,
      1,
      roleName,
      currentDateTime,
      currentDateTime]
    const checkEmailQuery = 'SELECT COUNT(*) as count FROM expenses_managment.user WHERE email = ?';
    connectDB.query(checkEmailQuery,userData[2])
      .then(([rows]) => {
        const emailExists = rows[0].count > 0;
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
          console.log(result.insertId);
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
    console.log("Eorror : ", err);
    sendResponseError(500, "Something wrong please try again", res);
    return;
  }
};

const signInUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  const loginQuery =
    "SELECT id, first_name, last_name, email, password FROM expenses_managment.user WHERE email=?";
  try {
    connectDB.query(loginQuery, [email])
    .then(([result]) => {
      console.log("AS")
      console.log(result)
      if (result.length <= 0) {
        res
          .status(404)
          .send({ status: false, message: "User is not registered." });
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
  console.log(req);
  res.status(200).send({ user: req.user });
};
module.exports = { signUpUser, signInUser, getUser };
