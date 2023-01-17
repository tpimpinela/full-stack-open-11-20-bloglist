import { useState } from "react";
import { PropTypes } from "prop-types";

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleBlogCreation = async (event) => {
    event.preventDefault();
    if (!title || !url) return;
    setTitle("");
    setUrl("");
    await createBlog({ title, url });
  };

  return (
    <>
      <h2>Create blog</h2>
      <form onSubmit={handleBlogCreation}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">Url</label>
          <input
            type="text"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <input type="submit" value="create" />
      </form>
    </>
  );
};

CreateBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default CreateBlogForm;
