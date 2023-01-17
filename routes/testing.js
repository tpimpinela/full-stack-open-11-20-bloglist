const { reset } = require("../controllers/testing");

const testRouter = require("express").Router();

testRouter.post("/reset", reset);

module.exports = testRouter;
