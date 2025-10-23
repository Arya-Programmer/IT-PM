// node js frameworks
// for defining routes like signup and login
const express = require("express");
// reads the request
const bodyParser = require("body-parser");
// connects front to backend
const cors = require("cors");

//creating express app/server
const app = express();
//apply cors to requests for communication between
//diff hosts (express and react)
app.use(cors());
//allows react to read the request body
app.use(bodyParser.json());

// Hardcoded users 
const users = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "user@example.com", password: "user123", role: "user" }
];

// Login endpoint

//app is the express server instance
//post determines the route for login/signup requests
//which is why we have /login
app.post("/login", (req, res) => {
    // making the email and password variable for comparison later
  const { email, password } = req.body;

    // app.post("/login", (req, res) => {});
    // this is a handler function for requests

    //getting the user by an arrow function and storing it 
    // users:array of user, find: searches array for the first
    // user to match the condition
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    // res: response obj in express
    // status(401): http 401 error
    //json: json obj with a message
    return res.status(401).json({ message: "Invalid credentials" });
  }

  //the role is the user.role so the role in the array
  //so that front end decides which page to show
  res.json({ message: "Login successful", role: user.role });
});

// Start server and make it wait for incoming requests
// the arrow function is a confirmation message and is not necessary
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});