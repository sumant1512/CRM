const connectDB = require("../config/db");
const { format } = require("date-fns");

const {
  sendResponseError,
  incrementTransactionCount,
} = require("../middleware/middleware");

const getwallet = async (req, res) => {
  adminId = req.params.adminId;

  const getWalletsQuery =
    "SELECT wallet.id, wallet.admin_id as adminId, user_id as userId, first_name as firstName, last_name as lastName, amount as amount, wallet.created_at as createdAt FROM wallet LEFT JOIN user ON user.id = wallet.user_id where wallet.admin_id =?";
  try {
    connectDB
      .query(getWalletsQuery, [adminId])
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
};

const addwallet = async (req, res) => {
  const { userId, adminId, amount } = req.body;
  // const roleType = await incrementTransactionCount(user_id, admin_id, res);

  const wallet_data = [userId, amount, adminId];
  const addWalletQuery =
    "INSERT INTO expenses_managment.wallet (user_id,amount,created_at,modified_at,admin_id) VALUES (?, ?,NOW(), NOW(), ?)";
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
};

const updatewallet = async (req, res) => {
  const { amount, walletId } = req.body;

  const wallet_data = [amount, walletId];
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
};

const getwalletById = async (req, res) => {
  const walletId = req.params.id;

  const getWalletsQuery = "SELECT * FROM expenses_managment.wallet WHERE id=?";
  try {
    connectDB
      .query(getWalletsQuery, [walletId])
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
};

module.exports = {
  getwallet,
  addwallet,
  updatewallet,
  getwalletById,
};
