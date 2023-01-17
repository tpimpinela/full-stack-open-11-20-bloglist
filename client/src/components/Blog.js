import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, updateBlog, remove }) => {
  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? "unset" : "none" };

  const toggleVisibility = () => setVisible(!visible);

  const handleLike = async () => {
    const newBlog = { ...blog, likes: (blog.likes || 0) + 1 };
    delete newBlog.author;
    await updateBlog(newBlog);
  };

  return (
    <div className="blog">
      {blog.title}
      <input
        type="button"
        value={visible ? "hide" : "show"}
        onClick={toggleVisibility}
        className="toggle"
      />
      <div className="blog__collapsed" style={showWhenVisible}>
        <div className="blog__info">{blog.url}</div>
        <div className="blog__info blog__info--likes">
          {blog.likes}
          <input type="button" value="like" onClick={handleLike} />
        </div>
        <div className="blog__info">{blog.author.name}</div>
        {remove && (
          <div>
            <input
              type="button"
              value="remove"
              onClick={() => remove(blog.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  remove: PropTypes.bool.isRequired,
};

export default Blog;
