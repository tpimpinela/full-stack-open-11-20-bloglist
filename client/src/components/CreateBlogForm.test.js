import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBlogForm from "./CreateBlogForm";

describe("<CreateBlogForm />", () => {
  let container;
  const createBlog = jest.fn();

  beforeEach(() => {
    container = render(<CreateBlogForm createBlog={createBlog} />).container;
  });

  test("should call createBlog function with correct arguments", () => {
    const titleInput = container.querySelector("input[name='title']");
    const urlInput = container.querySelector("input[name='url']");
    const submitButton = container.querySelector("input[type='submit']");

    const testBlog = {
      title: "Test title",
      url: "Test url",
    };

    userEvent.type(titleInput, testBlog.title);
    userEvent.type(urlInput, testBlog.url);
    userEvent.click(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual(testBlog);
  });
});
