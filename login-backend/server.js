const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

const envFilePath = path.resolve(__dirname, ".env");

if (fs.existsSync(envFilePath)) {
  const envContent = fs.readFileSync(envFilePath, "utf-8");
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  });
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const PROFILE_TABLE = process.env.SUPABASE_PROFILE_TABLE || "profiles";
const PROFILE_ROLE_COLUMN = process.env.SUPABASE_PROFILE_ROLE_COLUMN || "role";
const PROFILE_USER_ID_COLUMN = process.env.SUPABASE_PROFILE_USER_ID_COLUMN || "user_id";

function buildSupabaseUrl(pathname, searchParams = {}) {
  const url = new URL(pathname, SUPABASE_URL);
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}

async function authenticateWithSupabase(email, password) {
  const response = await fetch(
    buildSupabaseUrl("/auth/v1/token", { grant_type: "password" }),
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error_description || payload?.msg || "Invalid credentials";
    const error = new Error(message);
    error.statusCode = response.status || 401;
    throw error;
  }

  return payload;
}

async function fetchUserRole(accessToken, userId) {
  if (!accessToken || !userId) {
    return null;
  }

  const response = await fetch(
    buildSupabaseUrl(`/rest/v1/${PROFILE_TABLE}`, {
      select: PROFILE_ROLE_COLUMN,
      [PROFILE_USER_ID_COLUMN]: `eq.${userId}`,
      limit: "1",
    }),
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.warn("Failed to fetch role from Supabase:", response.status, text);
    return null;
  }

  const data = await response.json().catch(() => []);
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const [profile] = data;
  return profile?.[PROFILE_ROLE_COLUMN] ?? null;
}

app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables are not configured.");
    return res.status(500).json({ message: "Server configuration error" });
  }

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { access_token: accessToken, user } = await authenticateWithSupabase(
      email,
      password
    );

    const role = await fetchUserRole(accessToken, user?.id);

    return res.json({
      message: "Login successful",
      role: role || null,
    });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    const message =
      statusCode >= 500
        ? "Unable to complete login. Please try again later."
        : error.message || "Invalid credentials";

    return res.status(statusCode).json({ message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
