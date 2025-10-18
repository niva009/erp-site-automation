const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const ComponyRouter = require("./Router/componyRouter");
const dotenv = require("dotenv");

const app = express();
app.use(cors());


dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send("server running");
});

app.use('/api', ComponyRouter);

mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.setTimeout(15 * 60 * 1000);



