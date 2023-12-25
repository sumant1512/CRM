require("dotenv").config();
var mysql = require("mysql2/promise");

var connectDB = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "root",
  database: "expenses_managment",
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
