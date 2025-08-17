import { useNavigate, useLocation } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px", borderRadius: "12px" }}>
        <h3 className="text-center fw-bold mb-1">Welcome to Formify</h3>
        <p className="text-center text-muted mb-4">
          {location.pathname === "/login"
            ? "Log in to access your dashboard"
            : "Create an account to get started"}
        </p>

        {/* Toggle buttons */}
        <div className="d-flex justify-content-center mb-3">
          <button
            className={`btn me-2 ${location.pathname === "/login" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className={`btn ${location.pathname === "/register" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;