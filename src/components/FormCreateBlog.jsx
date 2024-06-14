import { useState } from "react";

export const FormCreateBlog = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreate = async (event) => {
    event.preventDefault();
    await createBlog({ title, author, url });
    setAuthor("");
    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={handleCreate}>
      <h1>Create new</h1>

      <label htmlFor="title">title</label>
      <input
        id="title"
        type="text"
        name="title"
        placeholder="title"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
      />

      <br />
      <label htmlFor="author">author</label>
      <input
        id="author"
        type="text"
        name="author"
        placeholder="author"
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
      />

      <br />
      <label htmlFor="url">url</label>
      <input
        id="url"
        type="text"
        name="url"
        placeholder="url"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
      />

      <br />
      <button id="create">create</button>
    </form>
  );
};
