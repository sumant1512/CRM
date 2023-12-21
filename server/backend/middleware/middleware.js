const { verifyToken } = require("../utils/utility.function");
const connectDB = require("./../config/db");

const sendResponseError = (statusCode, msg, res) => {
  res.status(statusCode || 400).send(!!msg ? msg : "Invalid input !!");
};

const verifyUser = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    sendResponseError(400, "You are not authorized ", res);
    return;
  } else if (!authorization.startsWith("Bearer ")) {
    sendResponseError(400, "You are not authorized ", res);
    return;
  }

  try {
    const payload = await verifyToken(authorization.split(" ")[1]);

    if (payload) {
      const checkUserQuery = 'SELECT COUNT(*) as count FROM expenses_managment.user WHERE id = ?';
      connectDB.query(checkUserQuery,[payload['id']])
      .then(([rows]) => {
        const userExists = rows[0].count > 0;
        if (!userExists){
          sendResponseError(400, `you are not authorized`, res);
        }
        else{
        next();
        }
      })
      .catch(err =>{
        sendResponseError(400, `Something went Wrong. Please check error - `+err,res);
      })
      
    } else {
      sendResponseError(400, `you are not authorized`, res);
    }
  } catch (err) {
    sendResponseError(400, `Error ${err}`, res);
  }
};

module.exports = {
  sendResponseError,
  verifyUser,
};
