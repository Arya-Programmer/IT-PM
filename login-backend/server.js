
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase environment variables are not set.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const authenticateRequest = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Missing authentication token" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = data.user;
  next();
};

const requireAdmin = (req, res, next) => {
  const role = req.user?.user_metadata?.role;

  if (role !== "admin") {
    return res.status(403).json({ message: "Admin privileges required" });
  }

  next();
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.session || !data?.user) {
    return res
      .status(401)
      .json({ message: error?.message || "Invalid email or password" });
  }

  const role = data.user.user_metadata?.role || "user";
  const name = data.user.user_metadata?.name || "";

  return res.json({
    message: "Login successful",
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    expires_at: data.session.expires_at,
    user: {
      id: data.user.id,
      email: data.user.email,
      role,
      name,
    },
  });
});

app.get("/users", authenticateRequest, requireAdmin, async (req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return res
      .status(500)
      .json({ message: error.message || "Unable to fetch users" });
  }

  const users = (data?.users || []).map((user) => ({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || "",
    role: user.user_metadata?.role || "user",
    last_sign_in_at: user.last_sign_in_at,
  }));

  return res.json({ users });
});

app.post("/users", authenticateRequest, requireAdmin, async (req, res) => {
  const { email, password, role, name } = req.body || {};

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Email, password and role are required" });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      name: name || "",
    },
  });

  if (error) {
    return res
      .status(400)
      .json({ message: error.message || "Unable to create user" });
  }

  const createdUser = data.user;

  return res.status(201).json({
    message: "User created successfully",
    user: {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.user_metadata?.role || role,
      name: createdUser.user_metadata?.name || name || "",
    },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
