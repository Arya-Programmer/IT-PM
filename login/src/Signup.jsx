import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-wrapper">
      {/* Left image with overlay */}
      <div className="login-left">
        
      </div>

      {/* Right form container */}
      <div className="login-right">
        <div className="login-container">
          <h2 className="form-title">Welcome</h2>

          <div class="welcome-text">
            <p>Create your account to get started</p>
          </div>

          <p className="separator">
            <span>or</span>
          </p>

          {/* Signup form */}
          <form>
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

            {/* Sign up button */}
            <button type="submit" className="login-button">
              Sign up
            </button>
          </form>

          {/* Link to login */}
          <p className="signup-text">
            Already have an account?{" "}
            <Link className="signup-link" to="/login">
              Log in now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
