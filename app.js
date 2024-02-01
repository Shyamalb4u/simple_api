const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
const PORT = process.env.PORT || 8080;
mongoose
  .connect(
    "mongodb+srv://shyamaltest:6kRMcMKqgQmlXn9V@cluster0.4nk8d.mongodb.net/api_test?retryWrites=true"
  )
  .then((result) => {
    app.listen(PORT);
    console.log(PORT);
  })
  .catch((err) => console.log(err));
