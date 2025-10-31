import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import MainLayout from "./MainLayout"; 
import Users from "./Users"

import Login from "./Login";
import Signup from "./Signup";
import News from "./News";
import { Report } from "./Report";
import "./App.css";
import Shipments from "./Shipments"
import SideBar from "./SideBar";

const App = () => {
  const [error, setError] = useState("");


  const [mode, setMode] = useState("light");


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  // Toggle function
  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={mode === "dark" ? "dark-mode" : ""}>
        <Router>
          <Routes>
          <Route path="/" element={<Login error={error} setError={setError} />} />
          <Route path="/login" element={<Login error={error} setError={setError} />} />
          <Route path="/signup" element={<Signup />} />


          <Route
            path="/shipments"
            element={
              <MainLayout>
                <Shipments toggleTheme={toggleTheme} mode={mode} />
              </MainLayout>
            }
          />
          <Route
            path="/news"
            element={
              <MainLayout>
                <News toggleTheme={toggleTheme} mode={mode} />
              </MainLayout>
            }
          />
          <Route
            path="/report"
            element={
              <MainLayout>
                <Report toggleTheme={toggleTheme} mode={mode} />
              </MainLayout>
            }
          />

          <Route
            path="/users"
            element={
              <MainLayout>
                <Users />
              </MainLayout>
            }
          />

        </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
