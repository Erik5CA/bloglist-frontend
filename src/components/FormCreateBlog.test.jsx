import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormCreateBlog } from "./FormCreateBlog";

describe("<FormCreateBlog/>", () => {
  const createBlog = vi.fn();
  beforeEach(() => {
    render(<FormCreateBlog createBlog={createBlog} />);
  });

  test("event handler revived right details when a new blog is created", async () => {
    const user = userEvent.setup();

    const title = screen.getByPlaceholderText("title");
    const author = screen.getByPlaceholderText("author");
    const url = screen.getByPlaceholderText("url");
    const button = screen.getByText("create");

    await user.type(title, "React Test");
    await user.type(author, "Jhon Smith");
    await user.type(url, "www.reacttest.com");

    await user.click(button);
    expect(createBlog.mock.calls).toHaveLength(1);
    // console.log(createBlog.mock.calls);
    expect(createBlog.mock.calls[0][0].title).toBe("React Test");
    expect(createBlog.mock.calls[0][0].author).toBe("Jhon Smith");
    expect(createBlog.mock.calls[0][0].url).toBe("www.reacttest.com");
  });
});
