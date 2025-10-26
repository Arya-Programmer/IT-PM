import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { User, Search, Bell, Ship} from "lucide-react"; // icon library
import Shipments from "./Shipments.jsx"

const Navbar = ({ current }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Ship className="navbar-logo" color="#FFC300" size={26} />
        <span className="navbar-title">ShipTrack</span>
      </div>

      <div className="navbar-links">
        <Link
          to="/shipments"
          className={`nav-link ${current === "shipments" ? "active" : ""}`}
        >
          Shipments
        </Link>
        <Link
          to="/reports"
          className={`nav-link ${current === "reports" ? "active" : ""}`}
        >
          Reports
        </Link>
        <Link
          to="/news"
          className={`nav-link ${current === "news" ? "active" : ""}`}
        >
          News
        </Link>
      </div>

      <div className="navbar-right">
        <User className="user-icon" size={22} />
      </div>
    </nav>
  );
};

export default Navbar;
