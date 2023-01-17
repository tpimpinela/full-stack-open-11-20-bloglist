const { createUser, getUsers } = require("../controllers/users");
const usersRouter = require("express").Router();

usersRouter.post("/", createUser);
usersRouter.get("/", getUsers);

module.exports = usersRouter;
