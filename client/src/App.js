import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import CreateBlogForm from "./components/CreateBlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./styles.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  // Login
  const [user, setUser] = useState();

  //Notifications
  const [notification, setNotification] = useState();

  const createBlogRef = useRef();

  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await blogService.getAll();
      const sortedBlogs = sortBlogsByLikes(blogs);
      setBlogs(sortedBlogs);
    };
    getBlogs();
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
    } catch (err) {
      showError(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser();
  };

  const handleBlogCreation = async (blog) => {
    try {
      createBlogRef.current.toggleVisibility();
      const newBlog = await blogService.createBlog(blog);
      setBlogs(blogs.concat(newBlog));
      showNotification({
        message: `a new blog ${newBlog.title} by ${newBlog.author.name} added`,
        type: "success",
      });
    } catch (err) {
      showError(err);
    }
  };

  const showNotification = (notification) => {
    setNotification(notification);
    setTimeout(() => {
      setNotification();
    }, 2500);
  };

  const showError = (err) => {
    if (err.response.data.error)
      showNotification({
        message: err.response.data.error,
        type: "error",
      });
  };

  const updateBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.updateBlog(blog.id, blog);
      const newBlogs = [...blogs];
      const updatedBlogIndex = newBlogs.findIndex(
        (blog) => blog.id === updatedBlog.id
      );
      newBlogs[updatedBlogIndex] = updatedBlog;
      const sortedNewBlogs = sortBlogsByLikes(newBlogs);
      setBlogs(sortedNewBlogs);
    } catch (err) {
      showError(err);
    }
  };

  const sortBlogsByLikes = (blogs) => blogs.sort((a, b) => b.likes - a.likes);

  const isBlogAuthor = ({ author }) =>
    author.name === user.name && author.username === user.username;

  const removeBlog = async (blogID) => {
    try {
      const blog = blogs.find((element) => element.id === blogID);
      const confirmDelete = window.confirm(
        `Remove blog ${blog.title} by ${blog.author.name}`
      );
      if (confirmDelete) {
        await blogService.deleteBlog(blogID);
        const newBlogs = blogs.filter((element) => element.id !== blogID);
        setBlogs(newBlogs);
      }
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      {notification && (
        <>
          <div className={"notification notification--" + notification.type}>
            {notification.message}
          </div>
        </>
      )}
      {!user ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <>
          <span>{user.username} logged in</span>
          <input type="button" value="logout" onClick={handleLogout} />
          <Togglable buttonLabel="new blog" ref={createBlogRef}>
            <CreateBlogForm createBlog={handleBlogCreation} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              remove={isBlogAuthor(blog) && removeBlog}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
