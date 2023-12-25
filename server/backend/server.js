require("dotenv").config();
const express = require("express");
const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");
const expenseCategory = require("./routes/expenseCategory");
const walletRoutes = require("./routes/walletRoutes.js");

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/expense", expenseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/expenseCategory", expenseCategory);
app.use("/api/wallet", walletRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
