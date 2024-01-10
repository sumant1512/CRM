const connectDB = require("../config/db");
const { format } = require("date-fns");

const {
  sendResponseError,
  incrementTransactionCount,
} = require("../middleware/middleware");

const getwallet = async (req, res) => {
  const { user_id, admin_id } = req.params;
  const roleType = await incrementTransactionCount(user_id, admin_id, res);

  if (roleType != "superadmin" && roleType != "employee") {
    const getWalletsQuery = "SELECT * FROM expenses_managment.wallet ";
    try {
      connectDB
        .query(getWalletsQuery)
        .then(([result]) => {
          if (result.length <= 0) {
            // return Promise.reject(new Error('Failed to delete expenses.'));
            res
              .status(500)
              .send({ status: false, message: "Failed to fetch wallet data." });
            // Handle error or inform the user that the email already exists
          } else {
            res.status(200).send({
              status: true,
              message: "Wallet data fetch succesfully.",
              data: result,
            });
          }
        })
        .catch((err) => {
          sendResponseError(
            500,
            "Error in fetching Wallet. Error- " + err.message,
            res
          );
        });
    } catch (err) {
      console.log(err);
      sendResponseError(500, "Something went wrong. Please try again");
    }
  } else {
    res.status(400).send({
      status: false,
      message: "User is not admin. Feature is only for admin.",
    });
  }
};

const addwallet = async (req, res) => {
  const { user_id, admin_id, amount } = req.body;
  const roleType = await incrementTransactionCount(user_id, admin_id, res);

  if (roleType != "superadmin" && roleType != "employee") {
    const wallet_data = [user_id, amount];
    const addWalletQuery =
      "INSERT INTO expenses_managment.wallet (user_id,amount,created_at,modified_at) VALUES (?, ?,NOW(), NOW())";
    try {
      connectDB
        .query(addWalletQuery, wallet_data)
        .then(([result]) => {
          if (result.length <= 0) {
            // return Promise.reject(new Error('Failed to delete expenses.'));
            res
              .status(500)
              .send({ status: false, message: "Failed to add wallet data." });
            // Handle error or inform the user that the email already exists
          } else {
            res.status(200).send({
              status: true,
              message: "Wallet data added succesfully.",
            });
          }
        })
        .catch((err) => {
          sendResponseError(
            500,
            "Error in adding Wallet. Error- " + err.message,
            res
          );
        });
    } catch (err) {
      console.log(err);
      sendResponseError(500, "Something went wrong. Please try again");
    }
  } else {
    res.status(400).send({
      status: false,
      message: "User is not admin. Feature is only for admin.",
    });
  }
};

const updatewallet = async (req, res) => {
  const { user_id, admin_id, amount, wallet_id } = req.body;
  const roleType = await incrementTransactionCount(user_id, admin_id, res);

  if (roleType != "superadmin" && roleType != "employee") {
    const wallet_data = [amount, wallet_id];
    const updateWalletQuery =
      "UPDATE expenses_managment.wallet SET amount = ?,modified_at = NOW() WHERE id = ?";
    try {
      connectDB
        .query(updateWalletQuery, wallet_data)
        .then(([result]) => {
          if (result.length <= 0) {
            // return Promise.reject(new Error('Failed to delete expenses.'));
            res.status(500).send({
              status: false,
              message: "Failed to update wallet data.",
            });
            // Handle error or inform the user that the email already exists
          } else {
            res.status(200).send({
              status: true,
              message: "Wallet data updated succesfully.",
            });
          }
        })
        .catch((err) => {
          sendResponseError(
            500,
            "Error in updating Wallet. Error- " + err.message,
            res
          );
        });
    } catch (err) {
      console.log(err);
      sendResponseError(500, "Something went wrong. Please try again");
    }
  } else {
    res.status(400).send({
      status: false,
      message: "User is not admin. Feature is only for admin.",
    });
  }
};

const getwalletById = async (req, res) => {
  const wallet_id = req.params.id;

  const { user_id, admin_id } = req.query;
  const roleType = await incrementTransactionCount(user_id, admin_id, res);

  if (roleType != "superadmin" && roleType != "employee") {
    const getWalletsQuery =
      "SELECT * FROM expenses_managment.wallet WHERE id=?";
    try {
      connectDB
        .query(getWalletsQuery, [wallet_id])
        .then(([result]) => {
          if (result.length <= 0) {
            // return Promise.reject(new Error('Failed to delete expenses.'));
            res
              .status(500)
              .send({ status: false, message: "Failed to fetch wallet data." });
            // Handle error or inform the user that the email already exists
          } else {
            res.status(200).send({
              status: true,
              message: "Wallet data fetch succesfully.",
              data: result,
            });
          }
        })
        .catch((err) => {
          sendResponseError(
            500,
            "Error in fetching Wallet. Error- " + err.message,
            res
          );
        });
    } catch (err) {
      console.log(err);
      sendResponseError(500, "Something went wrong. Please try again");
    }
  } else {
    res.status(400).send({
      status: false,
      message: "User is not admin. Feature is only for admin.",
    });
  }
};

module.exports = {
  getwallet,
  addwallet,
  updatewallet,
  getwalletById,
};
