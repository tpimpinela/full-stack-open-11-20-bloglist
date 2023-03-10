const Blog = require("../models/blog");
const User = require("../models/user");

const reset = async (request, response) => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  return response.status(204).end();
};

module.exports = { reset };
