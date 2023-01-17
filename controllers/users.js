const User = require("../models/user");
const bcrypt = require("bcrypt");

const createUser = async (req, res, next) => {
  try {
    const { username, password, name } = req.body;
    if (username?.length < 3 || password?.length < 3) {
      return res.status(400).json({
        error: "Username and password must be at least 3 characters long",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      password: hashedPassword,
      username,
    });
    const savedUser = await user.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).populate("blogs", "-author -_id");
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, getUsers };
