const blogsRouter = require("express").Router();
const blogsController = require("../controllers/blogs");

blogsRouter.get("/blogs", blogsController.getAllBlogs);
blogsRouter.post("/blogs", blogsController.createBlog);
blogsRouter.delete("/blogs/:id", blogsController.deleteBlog);
blogsRouter.put("/blogs/:id", blogsController.updateBlog);

module.exports = blogsRouter;
