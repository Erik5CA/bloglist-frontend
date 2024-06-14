import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import {
  create,
  deleteBlog,
  getAll,
  setToken,
  updateLikes,
} from "./services/blogs";
import { FormLogin } from "./components/FormLogin";
import { FormCreateBlog } from "./components/FormCreateBlog";
import "./index.css";
import Toggeable from "./components/Toggeable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const blogFormRef = useRef();

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await getAll();
      const sorted = res.sort((a, b) => b.likes - a.likes);
      setBlogs(sorted);
      console.log(sorted);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const userLog = JSON.parse(loggedUserJSON);
      setUser(userLog);
      setToken(userLog.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const blog = await create(newBlog);
      setBlogs([...blogs, blog]);
      setMessage(`a new blog ${blog.title} by ${blog.author} added`);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const update = async (blogId, newBlog) => {
    try {
      const blogUpdated = await updateLikes(blogId, newBlog);
      console.log(blogUpdated);
      const newBlogs = blogs.map((blog) =>
        blog.id !== blogUpdated.id ? blog : blogUpdated
      );
      const sorted = newBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sorted);
    } catch (exeption) {
      setError(exeption.response.data.error);
    }
  };

  const deleteB = async (blogId) => {
    await deleteBlog(blogId);
    const newBlogs = blogs.filter((blog) => blog.id !== blogId);
    setBlogs(newBlogs);
  };

  if (user === null) {
    return (
      <div>
        <h1>Log in to application</h1>
        {error && <p className="error">{error}</p>}
        <FormLogin setUser={setUser} setError={setError} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>

      {message && <p className="message">{message}</p>}

      <form>
        {user.username} logged in{" "}
        <button id="logout" onClick={handleLogout}>
          logout
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <Toggeable buttonLabel="create new blog" ref={blogFormRef}>
        <FormCreateBlog createBlog={addBlog} />
      </Toggeable>

      <div className="blogs">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateLikes={update}
            user={user}
            deleteBlog={deleteB}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
