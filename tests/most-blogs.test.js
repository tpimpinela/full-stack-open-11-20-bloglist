const { mostBlogs } = require("../utils/list_helper");
const blogList = require("./blogList");

describe("most blogs", () => {
  const authorWithMostBlogs = {
    author: "Robert C. Martin",
    blogs: 3,
  };

  test("should return the author with most blogs and the number of blogs", () => {
    expect(mostBlogs(blogList)).toEqual(authorWithMostBlogs);
  });

  test("should get undefined if blog list is empty", () => {
    expect(mostBlogs([])).toBe(undefined);
  });
});
