import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";



const MainLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const current =
    path.includes("shipments") ? "shipments" :
    path.includes("report") ? "reports" :
    path.includes("news") ? "news" :
    "";

  return (
    <>

      <Navbar current={current} />
      <main style={{padding: "2rem"}}>
        {children}
      </main>
    </>
  );
};

export default MainLayout;
