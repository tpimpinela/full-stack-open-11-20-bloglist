const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./utils/config");
const blogsRouter = require("./routes/blogs");
const usersRouter = require("./routes/users");
const testRouter = require("./routes/testing");
const loginRouter = require("./routes/login");
const handleErrors = require("./middlewares/handle-errors");
const authentication = require("./middlewares/authentication");
const userExtractor = require("./middlewares/userExtractor");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(authentication);
app.use(userExtractor);
app.use("/api", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
if (config.environment === "test") {
  app.use("/api/testing", testRouter);
}
app.use(handleErrors);

module.exports = app;
