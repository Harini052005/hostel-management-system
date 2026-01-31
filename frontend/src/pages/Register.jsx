import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={submitHandler}>
        <h2 className="register-title">Register</h2>
        <p className="register-subtitle">Create your account</p>

        <input
          className="register-input"
          placeholder="Name"
          required
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="register-input"
          type="email"
          placeholder="Email"
          required
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="register-input"
          type="password"
          placeholder="Password"
          required
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="register-btn" type="submit">
          Register
        </button>

        <div className="register-footer">
          Already have an account?{" "}
          <Link to="/" className="register-link">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
