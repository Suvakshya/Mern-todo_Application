const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const connectDB = require("./config/db");

//env config
dotenv.config();

//DB connection
connectDB();

//rest object
const app = express();

//middleware
app.use(express.json()); //This middleware is used for sending and receiving json data
app.use(morgan("dev")); // morgan is a third party middleware that is used to show which url is being hitted
app.use(cors()); //cors is used for solving/handling cross origin resourse sharing problem

//routes
app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/test", require("./routes/testRouter"));

//port
const PORT = process.env.PORT || 8000; // note whenever we make changes in dotenv file we need to restart the server

//listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running on ${process.env.DEV_MODE} mode on Port no ${PORT}`
      .bgMagenta
  );
});
