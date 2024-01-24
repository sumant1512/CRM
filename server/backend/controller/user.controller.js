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
  let salary 
  if (roleId == 2) {
    expectedRoleId = 1;
  } else if (roleId == 3) {
    expectedRoleId = 2;
    salary = req.body.salary
  }

  try {
    // Start the transaction
    await connectDB.query("START TRANSACTION");

    // Check if the admin role is as expected
    const checkRoleIdQuery =
      "SELECT role_id FROM expenses_managment.user WHERE id=? and role_id =?";
    const [roleCheckResult] = await connectDB.query(checkRoleIdQuery, [
      adminId,
      expectedRoleId,
    ]);

    if (roleCheckResult.length > 0 || roleId == 1) {
      const passwordHash = await bcrypt.hash("admin", 8);
      const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

      // Check if the email already exists
      const checkEmailQuery =
        "SELECT COUNT(*) as count FROM expenses_managment.user WHERE email = ?";
      const [emailCheckResult] = await connectDB.query(checkEmailQuery, email);
      const emailExists = emailCheckResult[0].count > 0;

      if (emailExists) {
        // Rollback the transaction
        await connectDB.query("ROLLBACK");
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
          salary,
          adminId,
          trans_count,
          0,
          currentDateTime,
          currentDateTime,
        ];

        // Insert the user data
        const registerQuery =
          "INSERT INTO expenses_managment.user (first_name, last_name, email, password, mobile_number, is_active, role_id, salary, admin_id, transaction_count, is_verified, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [registerResult] = await connectDB.query(registerQuery, userData);

        if (registerResult && registerResult.insertId) {
          if (roleId != 1) {
            // Insert the wallet data for non-superadmin users
            const [walletResult] = await connectDB.query(
              "INSERT IGNORE INTO expenses_managment.wallet (user_id, amount, created_at, modified_at, admin_id) VALUES (?, ?, NOW(), NOW(), ?)",
              [registerResult.insertId, 0, adminId]
            );

            if (walletResult.affectedRows === 1) {
              // Commit the transaction if both queries succeed
              await connectDB.query("COMMIT");
              return res.status(201).send({
                status: true,
                message: "Successfully account registered.",
                data: {},
              });
            } else {
              // Commit the transaction if wallet insertion fails
              await connectDB.query("COMMIT");
              return res.status(201).send({
                status: true,
                message:
                  "Successfully account registered. Wallet already exists for the user.",
                data: {},
              });
            }
          } else {
            // Commit the transaction for superadmin user
            await connectDB.query("COMMIT");
            return res.status(201).send({
              status: true,
              message: "Successfully superadmin registered.",
              data: {},
            });
          }
        } else {
          // Rollback the transaction if user insertion fails
          await connectDB.query("ROLLBACK");
          return res.status(500).send({
            status: false,
            message: "User not registered.",
          });
        }
      }
    } else {
      // Rollback the transaction if admin role check fails
      await connectDB.query("ROLLBACK");
      return res.status(400).send({
        status: false,
        message:
          "Admin can be registered by superadmin, and an employee can be added by admin.",
      });
    }
  } catch (err) {
    // Rollback the transaction in case of any other error
    await connectDB.query("ROLLBACK");
    console.error(err);
    return res.status(500).send({
      status: false,
      message: "User not registered. Please check the error: " + err,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const loginQuery =
    "SELECT id, password, is_verified as isVerified, is_active as isActive, role_id as roleId  FROM expenses_managment.user WHERE email=?";
  const updateLoginLoggedQuery =
    "UPDATE expenses_managment.user SET auth_token=?, modified_at = NOW() WHERE id=?";

  try {
    // Start the transaction
    await connectDB.query("START TRANSACTION");

    const [result] = await connectDB.query(loginQuery, [email]);

    if (result.length <= 0) {
      // Rollback the transaction
      await connectDB.query("ROLLBACK");
      return res.status(404).send({
        status: false,
        message: "User is not registered",
      });
    }

    if (result[0].isActive == 0) {
      // Rollback the transaction
      await connectDB.query("ROLLBACK");
      const response = {
        id: result[0].id,
        isActive: false,
      };
      return res.status(401).send({
        status: false,
        message: "User is not Active.",
        data: response,
      });
    }

    if (result[0].isVerified == 0) {
      // Rollback the transaction
      await connectDB.query("ROLLBACK");
      const response = {
        id: result[0].id,
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

      // Update the login status
      const [updateResult] = await connectDB.query(updateLoginLoggedQuery, [
        authToken,
        result[0].id,
      ]);

      if (updateResult && updateResult.affectedRows === 1) {
        // Commit the transaction if both queries succeed
        await connectDB.query("COMMIT");
        return res.status(200).send({
          status: true,
          message: "User logged in successfully",
          authToken: authToken
        });
      } else {
        // Rollback the transaction if update query fails
        await connectDB.query("ROLLBACK");
        return res.status(404).send({
          status: false,
          message: "Unable to update the login status.",
        });
      }
    } else {
      // Rollback the transaction if password comparison fails
      await connectDB.query("ROLLBACK");
      return res.status(401).send({
        status: false,
        message: "Incorrect Email or Password.",
      });
    }
  } catch (err) {
    // Rollback the transaction in case of any other error
    await connectDB.query("ROLLBACK");
    console.error(err);
    return res.status(500).send({
      status: false,
      message: "Error in Logging in. Please try after some time",
    });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.params.id; // Assuming you get user ID from the request parameters
  console.log(userId)
  const userProfileQuery =
    "SELECT id, first_name as firstName, last_name as lastName, email, role_id as roleId, admin_id as adminId, salary, transaction_count as transactionCount, is_verified as isVerified, is_active as isActive, mobile_number as phone  FROM expenses_managment.user WHERE id=?";

  try {
    const [result] = await connectDB.query(userProfileQuery, [userId]);

    if (result.length <= 0) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }


    return res.status(200).send({
      status: true,
      message: "User profile retrieved successfully",
      data: result[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: false,
      message: "Error in retrieving user profile. Please try after some time",
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
  const { adminId } = req.body;

  const getUserQuery =
    "SELECT  id, first_name as firstName, last_name as lastName, email, mobile_number as mobileNumber, role_id as roleId, transaction_count as transactionCount ,is_verified as isVerified, is_active as isActive , created_at as createdAt  FROM expenses_managment.user WHERE admin_id=?";
  try {
    connectDB
      .query(getUserQuery, [adminId])
      .then(([result]) => {
        if (result.length <= 0) {
          res
            .status(404)
            .send({ status: false, message: "Unable to fetch users data." });
        } else {
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
  const { email, newPassword, oldPassword } = req.body;

  console.log(email, newPassword, oldPassword)

  const resetPasswordQuery =
    "UPDATE expenses_managment.user SET password=?, is_verified=?, modified_at = NOW() WHERE email=?";
  const passwordHash = await bcrypt.hash(newPassword, 8);
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
      oldPassword,
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

const getPointByUserId = async (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);
  const getUserQuery =
    "SELECT  user_id as userId, amount FROM expenses_managment.wallet WHERE user_id=? ";
  try {
    connectDB
      .query(getUserQuery, [user_id])
      .then(([result]) => {
        if (result.length <= 0) {
          res
            .status(404)
            .send({ status: false, message: "Unable to fetch users data." });
        } else {
          res.status(200).send({
            status: false,
            message: "User data fetched succesfully.",
            data: result[0],
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

const logout = async (req, res) => {
  const user_id = req.params.id;

  const userLogoutQuery =
    "UPDATE expenses_managment.user SET auth_token=?,modified_at = NOW() WHERE id=?";
  userLogoutData = [null, user_id];

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
  getPointByUserId,
  getUserProfile,
};
