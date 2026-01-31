import { useState, useContext } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./register.css";

const Register = () => {
  const [form, setForm] = useState({ role: "student" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/v1/auth/register", form);
      // auto-login
      login(res.data.user, res.data.token);

      // redirect based on role
      if (res.data.user.role === "student") {
        navigate("/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      alert(msg);
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

        <label className="register-label">Role</label>
        <select
          className="register-input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

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
