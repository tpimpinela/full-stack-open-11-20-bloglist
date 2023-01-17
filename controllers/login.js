const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const isPasswordCorrect =
    user && (await bcrypt.compare(password, user.password));
  if (!(user && isPasswordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const tokenPayload = {
    username,
    id: user.id,
  };

  const token = jwt.sign(tokenPayload, process.env.SECRET);

  return response.status(200).json({ token, username, name: user.name });
};

module.exports = { login };
