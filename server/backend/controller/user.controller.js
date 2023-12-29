const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./../config/db");
const { format } = require('date-fns');

const { sendResponseError, incrementTransactionCount } = require("../middleware/middleware");
const { newToken, generateRandomPassword } = require("../utils/utility.function");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, mobileNumber, roleId, supervisorId } = req.body;
  const registerQuery =
    "INSERT INTO expenses_managment.user (first_name, last_name, email, password,mobile_number,is_active,role_id,supervisor_id,transaction_count,is_verified, created_at,modified_at ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  try {
    if (roleId == 1) {
      const is_active = 0
    }
    else {
      const is_active = 1
    }
    const passwordHash = await bcrypt.hash(generateRandomPassword(8), 8);
    const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const checkEmailQuery = 'SELECT COUNT(*) as count FROM expenses_managment.user WHERE email = ?';
    connectDB.query(checkEmailQuery, email)
      .then(([rows]) => {
        const emailExists = rows[0].count > 0;
        const trans_count = 0;
        const userData = [firstName, lastName, email, passwordHash, mobileNumber, is_active, roleId, supervisorId, trans_count, 0, currentDateTime, currentDateTime]

        if (emailExists) {
          console.log('Email already exists. Please choose another email.');
          return Promise.reject(new Error('Email already exists'));

          // Handle error or inform the user that the email already exists
        } else {
          // Email is unique, proceed with insertion
          return connectDB.query(registerQuery, userData);
        }
      })
      .then(([result]) => {
        if (result) {
          return connectDB.query('INSERT IGNORE INTO expenses_managment.wallet (user_id,amount) VALUES (?, ?) ', [result.insertId, 0]);
        }
        else {
          return Promise.reject(new Error('User not registered'));
        }
      })
      .then(([result]) => {
        if (result.affectedRows === 1) {
          res.status(201).send({
            status: true,
            message: "Sucessfully account Register.",
          });
        }
        else {
          console.log("Wallet already exists for the user.")
          res.status(201).send({
            status: true,
            message: "Sucessfully account Register.",
          });
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

const loginUser = async (req, res) => {
  const { email, password } = req.body
  const loginQuery =
    "SELECT id, first_name, last_name, email, password, role_id, supervisor_id, transaction_count,is_verified  FROM expenses_managment.user WHERE email=? and is_active=1";
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
                delete result[0].is_verified;
                if (result[0].is_verified == 0) {
                  delete result[0].first_name;
                  delete result[0].last_name;
                  delete result[0].transaction_count;
                  delete result[0].role_id;
                  delete result[0].supervisor_id;
                  const response = {
                    ...result[0],
                    authToken: authToken,
                  }
                }
                else {
                  const response = {
                    ...result[0],
                    authToken: authToken,
                  }
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

const getAllUser = async (req, res) => {

  const { user_id, admin_id } = req.body

  const roleType = await incrementTransactionCount(user_id, admin_id, res)

  if (roleType != "superadmin" && roleType != "employee") {

    const getUserQuery =
      "SELECT  id, first_name, last_name, email, password, role_id, transaction_count,is_verified  FROM expenses_managment.user WHERE supervisor_id=? and is_active=1";
    try {
      connectDB.query(getUserQuery, [admin_id])
        .then(([result]) => {
          if (result.length <= 0) {
            res
              .status(404)
              .send({ status: false, message: "Unable to fetch users data." });
          } else {
            delete result[0].password
            const response =
            {
              ...result[0]
            }
            res
              .status(200)
              .send({ status: false, message: "User data fetched succesfully.", data: response });
          }
        })
        .catch(err => {

          sendResponseError(500, "Unable to fetch users data.. Error- " + err.message, res);

        });
    } catch (err) {
      sendResponseError(500, "Something wrong please try again");
      return;
    }


  }
  else {
    res
      .status(400)
      .send({ status: false, message: "User is not admin. Feature is only for admin." });
  }
};

const getUserById = async (req, res) => {
  const user_id = req.params.id
  const { admin_id } = req.body

  const roleType = await incrementTransactionCount(user_id, admin_id, res)

  if (roleType != "superadmin" && roleType != "employee") {

    const getUserQuery =
      "SELECT  id, first_name, last_name, email, password, role_id, supervisor_id, transaction_count,is_verified  FROM expenses_managment.user WHERE id=? and is_active=1";
    try {
      connectDB.query(getUserQuery, [user_id])
        .then(([result]) => {
          if (result.length <= 0) {
            res
              .status(404)
              .send({ status: false, message: "Unable to fetch users data." });
          } else {
            delete result[0].password
            const response =
            {
              ...result[0]
            }
            res
              .status(200)
              .send({ status: false, message: "User data fetched succesfully.", data: response });
          }
        })
        .catch(err => {

          sendResponseError(500, "Unable to fetch users data.. Error- " + err.message, res);

        });
    } catch (err) {
      sendResponseError(500, "Something wrong please try again");
      return;
    }
  }
  else {
    res
      .status(400)
      .send({ status: false, message: "User is not admin. Feature is only for admin." });
  }

};

const activateUser = async (req, res) => {
  const user_id = req.params.id

  const userActiveQuery = "UPDATE expenses_managment.user SET is_active=?,modified_at = NOW() WHERE id=?"
  userActiveData = [1, user_id]

  try {
    connectDB.query(userActiveQuery, userActiveData)
      .then(([result]) => {
        if (result.length <= 0) {
          res
            .status(404)
            .send({ status: false, message: "Unable to Activate User." });
        } else {

          res.status(200).send({ status: true, message: "User is activate." });
        }
      });
  }
  catch (err) {
    console.log("Error : ", err);
    sendResponseError(500, "Something wrong please try again");
    return;
  }
};

const resetPassword = async (req, res) => {
  const { email, new_password, old_password } = req.body


  const resetPasswordQuery = "UPDATE expenses_managment.user SET password=?, is_verified,modified_at = NOW() WHERE email=?"
  const resetPasswordData = [new_password, 1, email]

  const loginQuery =
    "SELECT  password  FROM expenses_managment.user WHERE email=? and is_active=1";
  try {
    connectDB.query(loginQuery, [email])
      .then(([result]) => {
        if (result.length <= 0) {
          res
            .status(404)
            .send({ status: false, message: "Unable to reset the password." });
        } else {
          bcrypt
            .compare(old_password, result[0].password)
            .then(function (isAuthinticated) {
              if (isAuthinticated) {
                return connectDB.query(resetPasswordQuery, resetPasswordData);
              } else {
                return Promise.reject(new Error('Enter correct old password.'));
                // res.status(401).send({
                //   status: false,
                //   message: "Enter correct old password.",
                // });
              }
            });
        }
      })
      .then(([result]) => {
        if (result.affectedRows == 1) {
          res.status(200).send({ status: true, message: "Password is reset successfully." });

        } else {
          res
            .status(404)
            .send({ status: false, message: "Unable to reset the password." });
        }
      })
      .catch(err => {
        console.log(err);
        if (err.message == "Enter correct old password.") {
          res.status(500).send({ status: false, message: "Enter correct old password." });
        }
        else {
          sendResponseError(500, "Unable to reset the password. Error- " + err.message, res);
        }
      });
  } catch (err) {
    sendResponseError(500, "Something wrong please try again");
    return;
  }

}


module.exports = { registerUser, loginUser, getAllUser, activateUser, resetPassword, getUserById };
