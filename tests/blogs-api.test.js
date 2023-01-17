const supertest = require("supertest");
const Blog = require("../models/blog");
const app = require("../app");
const api = supertest(app);
const blogList = require("./blogList");
const mongoose = require("mongoose");
const User = require("../models/user");

describe("blogs api", () => {
  let rootUserID;
  let rootUserToken;
  beforeAll(async () => {
    // Deleting all users and creating root user
    await User.deleteMany({});
    const rootUser = {
      username: "root",
      password: "root",
      name: "Root",
    };
    const response = await api.post("/api/users").send(rootUser);
    //Setting token and userID
    const {
      body: { token },
    } = await api
      .post("/api/login")
      .send({ username: "root", password: "root" });
    rootUserToken = token;
    rootUserID = response.body.id;
    // Deleting all blogs and creating samples
    await Blog.deleteMany({});
    const blogs = blogList.map((blog) => {
      const newBlog = { ...blog, author: response.body.id };
      return new Blog(newBlog);
    });
    const saveBlogs = blogs.map((blog) => blog.save());
    await Promise.all(saveBlogs);
  });

  test("should get a json response content type", async () => {
    const response = await api.get("/api/blogs");
    expect(response.headers["content-type"]).toContain("json");
  });

  test("should get all blogs", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(blogList.length);
  });

  test("id should be in the id property", async () => {
    const { body } = await api.get("/api/blogs");
    expect(body[0].id).toBeDefined();
  });

  test("likes number should be 0 if not specefied", async () => {
    const newBlog = {
      title: "New title",
      author: "New author",
      url: "New url",
    };
    const { body } = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${rootUserToken}`)
      .send(newBlog);
    expect(body.likes).toBe(0);
    const lastBlog = Blog.findById(body.id);
    await lastBlog.remove();
  });

  test("should get a 400 statusCode if title or url are not sent", async () => {
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${rootUserToken}`);
    expect(response.statusCode).toBe(400);
  });

  describe("blogs creation", () => {
    const newBlog = {
      title: "New title",
      author: "New author",
      url: "New url",
      likes: 100,
    };

    test("should create a blog", async () => {
      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${rootUserToken}`)
        .send(newBlog);
      expect(response.statusCode).toBe(201);
      const { id, ...savedNewBlog } = response.body;
      expect(savedNewBlog).toEqual({
        ...newBlog,
        author: { username: "root", name: "Root" },
      });
      const { body: newBlogList } = await api.get("/api/blogs");
      expect(newBlogList).toHaveLength(blogList.length + 1);
      expect(newBlogList[newBlogList.length - 1]).toEqual({
        ...response.body,
        author: { username: "root", name: "Root" },
      });
    });

    test("should get 401 response status code if token is not specified", async () => {
      const {
        statusCode,
        body: { error },
      } = await api.post("/api/blogs").send(newBlog);
      expect(statusCode).toBe(401);
      expect(error).toBeTruthy();
    });
  });

  describe("deletion of a blog", () => {
    test("should delete a blog", async () => {
      const { body: notesAtStart } = await api.get("/api/blogs");
      const noteToDelete = notesAtStart[0];

      const deleteResponse = await api
        .delete(`/api/blogs/${noteToDelete.id}`)
        .set("Authorization", `Bearer ${rootUserToken}`);
      const { body: notesAtEnd } = await api.get("/api/blogs");

      expect(deleteResponse.status).toBe(204);
      expect(notesAtEnd).toHaveLength(notesAtStart.length - 1);
      expect(notesAtEnd.map((note) => note.url)).not.toContain(
        noteToDelete.url
      );
    });
  });

  describe("updating a blog", () => {
    test("should update the likes of a blog", async () => {
      const { body: blogs } = await api.get("/api/blogs");
      const noteToUpdate = blogs[0];
      const likes = 1000;
      const updatedResponse = await api
        .put(`/api/blogs/${noteToUpdate.id}`)
        .send({ likes });
      expect(updatedResponse.body.likes).toBe(likes);
      expect(updatedResponse.status).toBe(200);
    });

    test("should get 404 statusCode if try to update an inexistent blog", async () => {
      const randomMongooseID = mongoose.Types.ObjectId();
      const updatedResponse = await api
        .put(`/api/blogs/${randomMongooseID}`)
        .send({});
      expect(updatedResponse.status).toBe(404);
    });
  });
});

describe("users", () => {
  describe("creation", () => {
    const newUser = {
      username: "root",
      password: "root",
      name: "root",
    };

    beforeAll(async () => {
      await User.deleteMany({});
    });

    test("should create a user", async () => {
      const { statusCode, body } = await api.post("/api/users").send(newUser);
      const actualUsers = await User.find({});
      expect(statusCode).toBe(201);
      expect(body).toMatchObject({
        username: newUser.username,
        id: expect.any(String),
      });
      expect(actualUsers).toHaveLength(1);
    });

    test("username must be unique", async () => {
      const { statusCode, body } = await api.post("/api/users").send(newUser);
      const actualUsers = await User.find({});
      expect(statusCode).toBe(400);
      expect(body.error).toBeTruthy();
      expect(actualUsers).toHaveLength(1);
    });

    test("username and password must be at least 3 character long", async () => {
      const shortUser = { ...newUser, username: "a", password: "a" };
      const { statusCode, body } = await api.post("/api/users").send(shortUser);
      const actualUsers = await User.find({});
      expect(statusCode).toBe(400);
      expect(body.error).toBeTruthy();
      expect(actualUsers).toHaveLength(1);
    });
  });
});

afterAll(() => {
  mongoose.disconnect();
});
