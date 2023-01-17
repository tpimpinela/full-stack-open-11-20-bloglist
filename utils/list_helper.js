const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (
    blogs.length === 0 ||
    blogs.some((blog) => blog.likes === undefined || blog.likes === null)
  ) {
    return 0;
  }
  const likesArray = blogs.map((blog) => blog.likes);
  return likesArray.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined;
  return blogs.reduce((previousValue, currentValue) => {
    return previousValue.likes > currentValue.likes
      ? previousValue
      : currentValue;
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined;
  const blogsPerAuthor = blogs.reduce((previousValue, currentValue) => {
    if (previousValue[currentValue.author]) {
      previousValue[currentValue.author] += 1;
    } else {
      previousValue[currentValue.author] = 1;
    }
    return previousValue;
  }, {});
  const authorWithMostBlogsArr = Object.entries(blogsPerAuthor).sort(
    (a, b) => b[1] - a[1]
  )[0];
  return {
    author: authorWithMostBlogsArr[0],
    blogs: authorWithMostBlogsArr[1],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return undefined;
  const { author, likes } = blogs.reduce((previousValue, currentValue) => {
    if (previousValue.likes > currentValue.likes) return previousValue;
    else return currentValue;
  });
  return { author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
