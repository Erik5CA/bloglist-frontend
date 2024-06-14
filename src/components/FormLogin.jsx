import { useState } from "react";
import { login } from "../services/login";
import { setToken } from "../services/blogs";
import PropTypes from "prop-types";

export const FormLogin = ({ setUser, setError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setToken(user.token);
      setUser(user);
      setPassword("");
      setUsername("");
    } catch (exepction) {
      //   console.log(exepction.response.data.error);
      setError(exepction.response.data.error);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label htmlFor="username">username</label>
      <input
        id="username"
        type="text"
        name="username"
        placeholder="username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <br />
      <label htmlFor="password">password</label>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />

      <br />
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );
};

FormLogin.propTypes = {
  setUser: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};
