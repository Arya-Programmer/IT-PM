import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css"; 


const Login = ({ error, setError }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const admin = { email: "savia@gmail.com", password: "savia123", role: "admin" };
    const user = { email: "user@example.com", password: "user123", role: "user" };

    if (email === admin.email && password === admin.password) {
      setError("");
      navigate("/Shipments");
    } else if (email === user.email && password === user.password) {
      setError("");
      navigate("/Shipments");
    } else {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Left panel with background and text */}
      <div className="login-left">
      </div>

      {/* Right panel with form */}
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

            <button type="submit" className="login-button">
              Login
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
