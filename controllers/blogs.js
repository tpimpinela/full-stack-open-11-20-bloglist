const Blog = require("../models/blog");
const User = require("../models/user");

const getAllBlogs = async (request, response) => {
  const blogs = await Blog.find({}).populate("author", "-_id -blogs");
  return response.json(blogs);
};

const createBlog = async (request, response) => {
  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  request.body.likes = request.body.likes ?? 0;
  if (!request.body.title || !request.body.url) {
    response.statusMessage = "Title and url are mandatory";
    return response.status(400).end();
  }
  const blog = new Blog({ ...request.body, author: user.id });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog);
  await user.save();
  return response
    .status(201)
    .json(await savedBlog.populate("author", "-_id -blogs"));
};

const deleteBlog = async (request, response) => {
  const { user } = request;
  if (!user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const { id } = request.params;
  const blogToRemove = await Blog.findById(id);
  const isOwner = blogToRemove.author.toString() === user.id;
  if (!isOwner) {
    return response
      .status(401)
      .json({ error: "you are not the author of the blog" });
  }
  await blogToRemove.remove();
  user.blogs = user.blogs.filter((blogID) => blogID.toString() !== id);
  await user.save();
  return response.status(204).end();
};

const updateBlog = async (request, response) => {
  const { id } = request.params;
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  if (!updatedBlog) {
    response.statusMessage = "Blog not found";
    return response.status(404).end();
  }
  return response
    .status(200)
    .json(await updatedBlog.populate("author", "-_id -blogs"));
};

module.exports = { getAllBlogs, createBlog, deleteBlog, updateBlog };
