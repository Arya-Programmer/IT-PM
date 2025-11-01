import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";


const Login = ({ error, setError }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      ["userRole", "accessToken", "createdByAdmin", "userName", "userId"].forEach(
        (key) => localStorage.removeItem(key)
      );

      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Incorrect email or password.");
      }

      if (data?.role) {
        localStorage.setItem("userRole", data.role);
      } else {
        localStorage.removeItem("userRole");
      }

      if (typeof data?.accessToken === "string" && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      } else {
        localStorage.removeItem("accessToken");
      }

      if (data?.createdByAdmin !== undefined) {
        localStorage.setItem(
          "createdByAdmin",
          data.createdByAdmin ? "true" : "false"
        );
      } else {
        localStorage.removeItem("createdByAdmin");
      }

      if (data?.name) {
        localStorage.setItem("userName", data.name);
      } else {
        localStorage.removeItem("userName");
      }

      if (data?.userId) {
        localStorage.setItem("userId", data.userId);
      } else {
        localStorage.removeItem("userId");
      }

      navigate("/Shipments");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(
        message === "Failed to fetch"
          ? "Unable to reach the login server. Please ensure the backend is running."
          : message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
      </div>
      <div className="login-right">
        <div className="login-container">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Sign in to your account</p>

          {/* <p className="separator">
            <span>or</span>
          </p> */}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="material-symbols-rounded">mail</i>
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="material-symbols-rounded">lock</i>
            </div>
{/* 
            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forgot Password?</a>
            </div> */}

            {error && <div className="error">{error}</div>}

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* <p className="signup-text">
            Don’t have an account?{" "}
            <Link className="signup-link" to="/signup">
              Sign Up
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
