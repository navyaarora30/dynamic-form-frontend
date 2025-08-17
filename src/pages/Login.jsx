import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://dynamic-form-backend-gumc.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("📦 Login response:", data);

      if (!res.ok) throw new Error(data.message);

      // ✅ Store user if backend returns it
      if (data.user && data.user.username) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("✅ User stored in localStorage:", data.user);
      } else {
        // 🛠️ TEMP fallback for testing
        const fallbackUser = {
          username: "josh",
          email: "josh@yahoo.com"
        };
        localStorage.setItem("user", JSON.stringify(fallbackUser));
        console.warn("⚠️ Backend did not return user. Using fallback:", fallbackUser);
      }

      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + err.message);
      console.error("❌ Login error:", err);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Log in [Demo Mode]
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;