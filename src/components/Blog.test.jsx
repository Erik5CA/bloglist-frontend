import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

describe("<Blog/>", () => {
  let container;
  const blog = {
    title: "React Test",
    author: "John Smith",
    url: "www.reacttest.com",
    likes: 5,
    user: { username: "testUser" },
  };
  const mockHandler = vi.fn();

  beforeEach(() => {
    container = render(
      <Blog blog={blog} updateLikes={mockHandler} />
    ).container;
  });

  test("renders only title and author by default", () => {
    const divWithAuthorTitle = container.querySelector(".title");
    expect(divWithAuthorTitle).toBeDefined();

    const div = screen.getByText("React Test John Smith");
    expect(div).toBeDefined();

    const divOtherFields = container.querySelector(".otherFields");
    expect(divOtherFields).toBeNull();
  });

  test("renders URL and likes when click button view", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const div = container.querySelector(".otherFields");
    expect(div).toBeDefined();

    const url = screen.getByText("www.reacttest.com");
    expect(url).toBeDefined();

    const likes = screen.getByText("likes 5");
    expect(likes).toBeDefined();
  });

  test("if the like button is clicked twice, the event handler is called twice", async () => {
    const user = userEvent.setup();
    const buttonView = screen.getByText("view");
    await user.click(buttonView);

    const buttonLike = screen.getByText("like");
    await user.click(buttonLike);
    await user.click(buttonLike);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
