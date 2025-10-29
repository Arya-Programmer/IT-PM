import React from "react";
import './App.css'

const SideBar = () => {


  return (
    <aside>
      <nav>
        <ul className="Side-bar">
          <li>
            <a className="SideBar-link" href="#">
              Profile
            </a>
          </li>
          <li>
            <a className="SideBar-link" href="#">
              Users
            </a>
          </li>
          <li>
            <a className="SideBar-link" href="#">
              Archives
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
