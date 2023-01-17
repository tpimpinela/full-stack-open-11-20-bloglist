import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "../components/Blog";

describe("<Blog />", () => {
  let container;
  const updateBlog = jest.fn();
  beforeEach(() => {
    const blog = {
      title: "Test blog",
      url: "www.test.com",
      author: {
        name: "Author Name",
      },
    };
    container = render(
      <Blog blog={blog} updateBlog={updateBlog} remove={true} />
    ).container;
  });

  describe("url and number of likes", () => {
    test("url and number of likes are not showed by default", () => {
      const collapsedContainer = container.querySelector(".blog__collapsed");
      const showButton = container.querySelector("input[type=button].toggle");
      expect(showButton).toHaveValue("show");
      expect(collapsedContainer).toHaveStyle("display: none");
    });

    test("url and number of likes are showed after clicking show button", () => {
      const button = container.querySelector("input[type=button].toggle");
      userEvent.click(button);
      const collapsedContainer = container.querySelector(".blog__collapsed");
      expect(collapsedContainer).toHaveStyle("display: unset");
    });
  });

  describe("like button", () => {
    test("update blog function must be called 2 times if button is clicked 2 times", () => {
      const likeButton = container.querySelector(
        "input[type=button][value=like]"
      );
      userEvent.dblClick(likeButton);
      expect(updateBlog.mock.calls).toHaveLength(2);
    });
  });
});
