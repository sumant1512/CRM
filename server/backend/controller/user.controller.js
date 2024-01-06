const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./../config/db");
const { format } = require("date-fns");

const {
  sendResponseError,
  incrementTransactionCount,
} = require("../middleware/middleware");
const {
  newToken,
  generateRandomPassword,
} = require("../utils/utility.function");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, mobileNumber, roleId, adminId } =
    req.body;

  let expectedRoleId = null;
  if (roleId == 2) {
    expectedRoleId = 1;
  } else if (roleId == 3) {
    expectedRoleId = 2;
  }

  try {
    const checkRoleIdQuery =
      "SELECT role_id FROM expenses_managment.user WHERE id=? and role_id =?";
    const [roleCheckResult] = await connectDB.query(checkRoleIdQuery, [
      adminId,
      expectedRoleId,
    ]);

    if (roleCheckResult.length > 0 || roleId == 1) {
      const passwordHash = await bcrypt.hash("admin", 8);
      const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

      const checkEmailQuery =
        "SELECT COUNT(*) as count FROM expenses_managment.user WHERE email = ?";
      const [emailCheckResult] = await connectDB.query(checkEmailQuery, email);
      const emailExists = emailCheckResult[0].count > 0;

      if (emailExists) {
        return res.status(400).send({
          status: false,
          message: "Email already exists. Please choose another email.",
        });
      } else {
        const trans_count = 0;
        const userData = [
          firstName,
          lastName,
          email,
          passwordHash,
          mobileNumber,
          0,
          roleId,
          adminId,
          trans_count,
          0,
          currentDateTime,
          currentDateTime,
        ];

        const registerQuery =
          "INSERT INTO expenses_managment.user (first_name, last_name, email, password, mobile_number, is_active, role_id, admin_id, transaction_count, is_verified, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [registerResult] = await connectDB.query(registerQuery, userData);

        if (registerResult && registerResult.insertId) {
          const [walletResult] = await connectDB.query(
            "INSERT IGNORE INTO expenses_managment.wallet (user_id, amount) VALUES (?, ?)",
            [registerResult.insertId, 0]
          );

          if (walletResult.affectedRows === 1) {
            return res.status(201).send({
              status: true,
              message: "Successfully account registered.",
              data: {},
            });
          } else {
            return res.status(201).send({
              status: true,
              message:
                "Successfully account registered. Wallet already exists for the user.",
              data: {},
            });
          }
        } else {
          return res.status(500).send({
            status: false,
            message: "User not registered.",
          });
        }
      }
    } else {
      return res.status(400).send({
        status: false,
        message:
          "Admin can be registered by superadmin, and employee can be added by admin.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: false,
      message: "User not registered. Please check the error: " + err,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const loginQuery =
    "SELECT id, first_name as firstName, last_name as lastName, email, password, role_id as roleId, admin_id as adminId, transaction_count as transactionCount, is_verified as isVerified, is_active as isActive  FROM expenses_managment.user WHERE email=?";
  const updateLoginLoggedQuery =
    "UPDATE expenses_managment.user SET logged_in=?,modified_at = NOW() WHERE id=?";

  try {
    const [result] = await connectDB.query(loginQuery, [email]);

    if (result.length <= 0) {
      return res.status(404).send({
        status: false,
        message: "User is not registered",
      });
    }

    if (result[0].isActive == 0) {
      const response = {
        id: result[0].id,
        adminId: result[0].adminId,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        roleId: result[0].roleId,
        isActive: false,
      };
      return res.status(401).send({
        status: false,
        message: "User is not Active.",
        data: response,
      });
    }

    if (result[0].isVerified == 0) {
      const response = {
        id: result[0].id,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        roleId: result[0].roleId,
        isVerified: false,
      };
      return res.status(401).send({
        status: false,
        message: "User is not verified.",
        data: response,
      });
    }

    const isAuthenticated = await bcrypt.compare(password, result[0].password);

    if (isAuthenticated) {
      const authToken = newToken(result[0]);
      delete result[0].password;

      const [updateResult] = await connectDB.query(updateLoginLoggedQuery, [
        1,
        result[0].id,
      ]);

      if (updateResult && updateResult.affectedRows === 1) {
        return res.status(200).send({
          status: true,
          message: "User logged in successfully",
          data: result[0],
          authToken: authToken,
          isVerified: result[0].isVerified,
        });
      } else {
        return res.status(404).send({
          status: false,
          message: "Unable to update the login status.",
        });
      }
    } else {
      return res.status(401).send({
        status: false,
        message: "Incorrect Email or Password.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: false,
      message: "Error in Logging in. Please try after some time",
    });
  }
};

const getAllAdmin = async (req, res) => {
  const getAdminQuery =
    "SELECT id, first_name as firstName, last_name as lastName, email, mobile_number as mobileNumber, created_at as createdAt, is_active as isActive, is_verified as isVerified, modified_at as modifiedAt, role_id as roleId, admin_id as supervisorId, transaction_count as transactionCount FROM user WHERE role_id=2";
  try {
    connectDB
      .query(getAdminQuery)
      .then(([result]) => {
        if (result.length <= 0) {
          res
            .status(404)
            .send({ status: false, message: "No admin registered." });
        } else {
          delete result[0].password;
          res.status(200).send({
            status: false,
            message: "User data fetched succesfully.",
            data: result,
          });
        }
      })
      .catch((err) => {
        sendResponseError(
          500,
          "Unable to fetch admin data.. Error- " + err.message,
          res
        );
      });
  } catch (err) {
    sendResponseError(500, "Something wrong please try again");
    return;
  }
};

const getAllUser = async (req, res) => {
  const { admin_id } = req.body;

  const getUserQuery =
    "SELECT  id, first_name as firstName, last_name as lastName, email, password, role_id as roleId, transaction_count as transactionCount ,is_verified as isVerified  FROM expenses_managment.user WHERE admin_id=? and is_active=1";
  try {
    connectDB
      .query(getUserQuery, [admin_id])
      .then(([result]) => {
        if (result.length <= 0) {
          res
            .status(404)
            .send({ status: false, message: "Unable to fetch users data." });
        } else {
          delete result[0].password;
          const response = {
            result,
          };
          res.status(200).send({
            status: false,
            message: "User data fetched succesfully.",
            data: response,
          });
        }
      })
      .catch((err) => {
        sendResponseError(
          500,
          "Unable to fetch users data.. Error- " + err.message,
          res
        );
      });
  } catch (err) {
    sendResponseError(500, "Something wrong please try again");
    return;
  }
};

const getUserById = async (req, res) => {
  const user_id = req.params.id;
  const { admin_id } = req.query;

  const roleType = await incrementTransactionCount(user_id, admin_id, res);

  if (roleType != "superadmin" && roleType != "employee") {
    const getUserQuery =
      "SELECT  id, first_name as firstName, last_name as lastName, email, password, role_id as roleId, admin_id as adminId, transaction_count as transactionCount,is_verified as isVerified FROM expenses_managment.user WHERE id=? and is_active=1";
    try {
      connectDB
        .query(getUserQuery, [user_id])
        .then(([result]) => {
          if (result.length <= 0) {
            res
              .status(404)
              .send({ status: false, message: "Unable to fetch users data." });
          } else {
            delete result[0].password;
            const response = {
              ...result[0],
            };
            res.status(200).send({
              status: false,
              message: "User data fetched succesfully.",
              data: response,
            });
          }
        })
        .catch((err) => {
          sendResponseError(
            500,
            "Unable to fetch users data.. Error- " + err.message,
            res
          );
        });
    } catch (err) {
      sendResponseError(500, "Something wrong please try again");
      return;
    }
  } else {
    res.status(400).send({
      status: false,
      message: "User is not admin. Feature is only for admin.",
    });
  }
};

const activateUser = async (req, res) => {
  const user_id = req.params.id;
  var { status, adminId } = req.body;

  if (adminId == null) {
    var adminId = user_id;
  }
  const userActiveQuery =
    "UPDATE expenses_managment.user SET is_active=?,modified_at = NOW() WHERE id=? or admin_id=?";
  userActiveData = [status, user_id, adminId];
  console.log(userActiveData);
  try {
    connectDB.query(userActiveQuery, userActiveData).then(([result]) => {
      if (result.affectedRows <= 0) {
        res
          .status(404)
          .send({ status: false, message: "Unable to change user status." });
      } else {
        res
          .status(200)
          .send({ status: true, message: "User is status changed." });
      }
    });
  } catch (err) {
    console.log("Error : ", err);
    sendResponseError(500, "Something wrong please try again");
    return;
  }
};

const resetPassword = async (req, res) => {
  const { email, new_password, old_password } = req.body;

  const resetPasswordQuery =
    "UPDATE expenses_managment.user SET password=?, is_verified=?, modified_at = NOW() WHERE email=?";
  const passwordHash = await bcrypt.hash(new_password, 8);
  const resetPasswordData = [passwordHash, 1, email];

  const loginQuery =
    "SELECT password FROM expenses_managment.user WHERE email=? and is_active=1";

  try {
    const [result] = await connectDB.query(loginQuery, [email]);

    if (result.length <= 0) {
      return res.status(404).send({
        status: false,
        message: "Unable to reset the password.",
      });
    }

    const isAuthenticated = await bcrypt.compare(
      old_password,
      result[0].password
    );

    if (isAuthenticated) {
      const [updateResult] = await connectDB.query(
        resetPasswordQuery,
        resetPasswordData
      );

      if (updateResult && updateResult.affectedRows === 1) {
        return res.status(200).send({
          status: true,
          message: "Password is reset successfully.",
        });
      } else {
        return res.status(404).send({
          status: false,
          message: "Unable to reset the password.",
        });
      }
    } else {
      return res.status(401).send({
        status: false,
        message: "Enter correct old password.",
      });
    }
  } catch (err) {
    if (err.message === "Enter correct old password.") {
      return res.status(401).send({
        status: false,
        message: "Enter correct old password.",
      });
    } else {
      sendResponseError(
        500,
        "Unable to reset the password. Error- " + err.message,
        res
      );
    }
  }
};

const logout = async (req, res) => {
  const user_id = req.params.id;

  const userLogoutQuery =
    "UPDATE expenses_managment.user SET logged_in=?,modified_at = NOW() WHERE id=?";
  userLogoutData = [0, user_id];

  try {
    connectDB.query(userLogoutQuery, userLogoutData).then(([result]) => {
      if (result.length <= 0) {
        res
          .status(404)
          .send({ status: false, message: "Unable to logout user." });
      } else {
        res
          .status(200)
          .send({ status: true, message: "User logged in session ends." });
      }
    });
  } catch (err) {
    console.log("Error : ", err);
    sendResponseError(500, "Something wrong please try again");
    return;
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllAdmin,
  getAllUser,
  activateUser,
  resetPassword,
  getUserById,
  logout,
};
