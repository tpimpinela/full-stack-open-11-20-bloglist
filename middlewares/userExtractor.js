const User = require("../models/user");

const userExtractor = async (request, response, next) => {
  if (!request.token) return next();
  request.user = await User.findById(request.token);
  next();
};

module.exports = userExtractor;
