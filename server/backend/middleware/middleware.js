const { verifyToken } = require("../utils/utility.function");
const connectDB = require("./../config/db");
const { format } = require('date-fns');

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

const incrementTransactionCount = (user_id,admin_id,res) => {
  console.log(user_id,admin_id)
  const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  console.log(currentDateTime)
  return new Promise((resolve, reject) =>  {
    // get role type for user_id
    // Update trans count for admin id 
    // return is_admin as True or False
    const UserRoleCheck = 'SELECT role_name, email FROM expenses_managment.user as users INNER JOIN expenses_managment.user_role as roles ON users.role_id = roles.id WHERE users.id= ?';
    const incrementTransCountQuery = 'UPDATE expenses_managment.user SET transaction_count = transaction_count + 1,modified_at=NOW() WHERE id = ?';
      connectDB.query(UserRoleCheck,[user_id])
      .then(([result]) => {
        console.log(result)
        var roleName = result[0].role_name;
        if (roleName == "superadmin"){
          resolve(roleName)
        }
        else{
          return connectDB.query(incrementTransCountQuery,[admin_id]).then(([result]) => ({ roleName, result }));
        }
      })
      .then(({roleName,result}) => {
        if (result){
          resolve(roleName)
        }
        else{
          reject('Something went wrong')
          sendResponseError(400, `Something went wrong`, res);
        }
      })
      .catch(err =>{
        console.log(err)
        reject('Something went wrong')
        sendResponseError(400, `Something went Wrong. Please check error - `+err,res);
      });

})
}

module.exports = {
  sendResponseError,
  verifyUser,
  incrementTransactionCount,
};
