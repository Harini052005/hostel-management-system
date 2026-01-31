import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      if (res.data.user.role === "student") {
      navigate("/dashboard");
    } else {
      navigate("/admin/dashboard");
    }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submitHandler}>
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Welcome back</p>

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" type="submit">
          Login
        </button>

        <div className="login-footer">
          Don’t have an account?{" "}
          <Link to="/register" className="login-link">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
