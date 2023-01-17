const { totalLikes } = require("../utils/list_helper");
const blogList = require("./blogList");

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const listWithOneBlog = [blogList[0]];
    expect(totalLikes(listWithOneBlog)).toBe(blogList[0].likes);
  });

  test("when list is empty, we should receive a 0", () => {
    expect(totalLikes([])).toBe(0);
  });

  test("when list has all blogs, equals the likes to the sum of all likes", () => {
    const sum = blogList
      .map((blog) => blog.likes)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
    expect(totalLikes(blogList)).toBe(sum);
  });

  test("when list has another type of objects (not blog), we should receive a 0", () => {
    const randomArr = [{ name: "Edwin", surname: "Holland" }];
    expect(totalLikes(randomArr)).toBe(0);
  });
});
