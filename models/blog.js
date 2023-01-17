const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    url: String,
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    },
  }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
