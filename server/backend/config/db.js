require("dotenv").config();
var mysql = require("mysql2");

var connectDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "admin",
  database: "shop_now",
});

// var connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   port: process.env.DB_HOST,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// module.exports = { connectDB };
module.exports = connectDB;
