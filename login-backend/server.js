
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "user@example.com", password: "user123", role: "user" }
];


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {

    return res.status(401).json({ message: "Invalid credentials" });
  }


  res.json({ message: "Login successful", role: user.role });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
