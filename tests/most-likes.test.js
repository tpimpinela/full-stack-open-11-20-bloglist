const { mostLikes } = require("../utils/list_helper");
const blogList = require("./blogList");

describe("most likes", () => {
  const authorWithMostLikes = {
    author: "Edsger W. Dijkstra",
    likes: 12,
  };

  test("should return the author with most likes", () => {
    expect(mostLikes(blogList)).toEqual(authorWithMostLikes);
  });

  test("should get undefined if blogList is empty", () => {
    expect(mostLikes([])).toBe(undefined);
  });
});
