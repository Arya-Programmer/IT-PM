import React from "react";

const SideBar = () => {
  const sidebarStyle = {
    width: "250px",
    height: "100vh",
    backgroundColor: "#1e1e2f",
    color: "white",
    padding: "20px",
    boxSizing: "border-box",
    position: "fixed",
    top: 0,
    right: 0, // or 'left: 0' if you want it on the left side
    zIndex: 9999, // makes sure it’s above other elements
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  };

  const listStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    width: "100%",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "block",
    padding: "10px 0",
    width: "100%",
  };

  const linkHover = {
    textDecoration: "underline",
  };

  return (
    <aside style={sidebarStyle}>
      <nav>
        <ul style={listStyle}>
          <li>
            <a href="#" style={linkStyle}>
              Profile
            </a>
          </li>
          <li>
            <a href="#" style={linkStyle}>
              Users
            </a>
          </li>
          <li>
            <a href="#" style={linkStyle}>
              Archives
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
