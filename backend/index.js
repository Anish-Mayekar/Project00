const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const farmersRoutes = require("./routes/farmersRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "100mb", extended: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Routes
app.use("/farmers", farmersRoutes);


// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Agrifarm API!" });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `Server is running on ${
      process.env.BACKEND_URL || `http://localhost:${port}`
    }`
  );
});
