require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");


const userRoute = require("./route/userRoute");

const errorHandler = require("./middleWare/errorMiddleWare");


const cookieParser = require("cookie-parser");
const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Route Middleware
app.use("/api/users", userRoute);

//Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Error middleWare
app.use(errorHandler);

// make a connection with mongoose and start the server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is Running on port ${PORT}`);
    });
  })

  .catch((error) => console.log(error));
