import axios from "axios";
const baseUrl = "/api/blogs";

let token;

axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = token;
    return config;
  },
  null,
  { runWhen: Boolean(token) }
);

const setToken = (newToken) => (token = `Bearer ${newToken}`);

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

const createBlog = async (newBlog) => {
  const { data } = await axios.post(baseUrl, newBlog);
  return data;
};

const updateBlog = async (id, blog) => {
  const { data } = await axios.put(`${baseUrl}/${id}`, blog);
  return data;
};

const deleteBlog = async (id) => {
  return await axios.delete(`${baseUrl}/${id}`);
};

const blogService = { getAll, setToken, createBlog, updateBlog, deleteBlog };

export default blogService;
