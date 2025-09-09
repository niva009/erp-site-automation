const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const ComponyRouter = require("./Router/componyRouter");
const dotenv = require("dotenv");
app.use(cors()); 


dotenv.config();

const PORT = process.env.PORT ;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Test route
app.get('/', (req, res) => {
  res.send("server running");
});

// API routes
app.use('/api', ComponyRouter);

mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.setTimeout(15 * 60 * 1000);


