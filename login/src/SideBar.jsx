import React from "react";
import { Link } from "react-router-dom";
import './App.css'

const SideBar = () => {


  return (
    <aside>
      <nav>
        <ul className="Side-bar">
          <li>
            <Link className="SideBar-link" to="#">
              Profile
            </Link>
          </li>
          <li>
            <Link className="SideBar-link" to="/Users">
              Users
            </Link>
          </li>
          <li>
            <Link className="SideBar-link" to="#">
              Archives
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
