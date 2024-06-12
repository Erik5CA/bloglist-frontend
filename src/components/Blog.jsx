import { useState } from "react";

const Blog = ({ blog, updateLikes, user, deleteBlog }) => {
  const [view, setView] = useState(false);

  const handleLikes = async () => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user,
      likes: blog.likes + 1,
    };
    await updateLikes(blog.id, newBlog);
  };

  const handleDelete = async () => {
    const response = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    );
    if (response) {
      await deleteBlog(blog.id);
    }
  };

  return (
    <div className="blog">
      <div className="title">
        {blog.title} {blog.author}
        <button onClick={() => setView(!view)}>{view ? "hide" : "view"}</button>
      </div>
      {view && (
        <div className="otherFields">
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={handleLikes}>like</button>
          </p>
          <p>{blog?.user?.username}</p>
          {user?.username === blog?.user?.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
