const loginController = require("../controllers/login");

const loginRouter = require("express").Router();

loginRouter.post("/", loginController.login);

module.exports = loginRouter;
