const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./../config/db");
const { sendResponseError } = require("../middleware/middleware");
const { checkPassword, newToken } = require("../utils/utility.function");

const signUpUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const registerQuery =
    "INSERT INTO Customer (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  try {
    const passwordHash = await bcrypt.hash(password, 8);
    console.log(passwordHash);

    connectDB.query(
      registerQuery,
      [firstName, lastName, email, passwordHash],
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send({
            status: false,
            message: "User not registered. Please check error",
          });
        } else {
          res.status(201).send({
            status: true,
            message: "Sucessfully account opened.",
          });
        }
      }
    );
    return;
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
    "SELECT id, first_name, last_name, email, password FROM Customer WHERE email=?";

  connectDB.query(loginQuery, [email], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        status: false,
        message: "Error in Logging in. Please try after some time",
      });
    } else {
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
    }
  });
};

const getUser = async (req, res) => {
  console.log(req);
  res.status(200).send({ user: req.user });
};
module.exports = { signUpUser, signInUser, getUser };
