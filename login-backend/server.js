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
const PROFILE_CREATED_BY_ADMIN_COLUMN =
  process.env.SUPABASE_PROFILE_CREATED_BY_ADMIN_COLUMN || "created_by_admin";
const PROFILE_FULL_NAME_COLUMN = process.env.SUPABASE_PROFILE_FULL_NAME_COLUMN || "full_name";
const PROFILE_CREATED_BY_COLUMN = process.env.SUPABASE_PROFILE_CREATED_BY_COLUMN || "created_by";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_ROLE_VALUE = (process.env.SUPABASE_ADMIN_ROLE_VALUE || "admin").toLowerCase();

function getSupabaseHeaders({ useServiceRole = false, accessToken } = {}) {
  if (useServiceRole && SUPABASE_SERVICE_ROLE_KEY) {
    return {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    };
  }

  if (accessToken) {
    return {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return {
    apikey: SUPABASE_ANON_KEY,
  };
}

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

async function fetchUserProfile({ userId, accessToken }) {
  if (!userId) {
    return null;
  }

  const selectColumns = [PROFILE_ROLE_COLUMN];
  if (PROFILE_CREATED_BY_ADMIN_COLUMN) {
    selectColumns.push(PROFILE_CREATED_BY_ADMIN_COLUMN);
  }
  if (PROFILE_FULL_NAME_COLUMN) {
    selectColumns.push(PROFILE_FULL_NAME_COLUMN);
  }

  const response = await fetch(
    buildSupabaseUrl(`/rest/v1/${PROFILE_TABLE}`, {
      select: selectColumns.join(","),
      [PROFILE_USER_ID_COLUMN]: `eq.${userId}`,
      limit: "1",
    }),
    {
      headers: {
        ...getSupabaseHeaders({ useServiceRole: Boolean(SUPABASE_SERVICE_ROLE_KEY), accessToken }),
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.warn("Failed to fetch profile from Supabase:", response.status, text);
    return null;
  }

  const data = await response.json().catch(() => []);
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data[0] || null;
}

async function fetchAuthenticatedUser(accessToken) {
  if (!accessToken) {
    const error = new Error("Missing access token");
    error.statusCode = 401;
    throw error;
  }

  const response = await fetch(buildSupabaseUrl("/auth/v1/user"), {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.msg || "Invalid session";
    const error = new Error(message);
    error.statusCode = response.status || 401;
    throw error;
  }

  return payload;
}

async function createSupabaseUser(email, password, name) {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    const error = new Error("Supabase service role key is not configured");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(buildSupabaseUrl("/auth/v1/admin/users"), {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: name ? { full_name: name } : undefined,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.msg || "Unable to create user";
    const error = new Error(message);
    error.statusCode = response.status || 500;
    throw error;
  }

  return payload;
}

async function deleteSupabaseUser(userId) {
  if (!SUPABASE_SERVICE_ROLE_KEY || !userId) {
    return;
  }

  await fetch(buildSupabaseUrl(`/auth/v1/admin/users/${userId}`), {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  }).catch((error) => {
    console.warn("Failed to roll back Supabase user creation:", error);
  });
}

async function upsertUserProfile({ userId, role, name, createdBy }) {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    const error = new Error("Supabase service role key is not configured");
    error.statusCode = 500;
    throw error;
  }

  const profilePayload = {
    [PROFILE_USER_ID_COLUMN]: userId,
    [PROFILE_ROLE_COLUMN]: role,
  };

  if (PROFILE_CREATED_BY_ADMIN_COLUMN) {
    profilePayload[PROFILE_CREATED_BY_ADMIN_COLUMN] = true;
  }

  if (PROFILE_FULL_NAME_COLUMN && name) {
    profilePayload[PROFILE_FULL_NAME_COLUMN] = name;
  }

  if (PROFILE_CREATED_BY_COLUMN && createdBy) {
    profilePayload[PROFILE_CREATED_BY_COLUMN] = createdBy;
  }

  const response = await fetch(buildSupabaseUrl(`/rest/v1/${PROFILE_TABLE}`), {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(profilePayload),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.msg || "Unable to persist profile";
    const error = new Error(message);
    error.statusCode = response.status || 500;
    throw error;
  }

  if (Array.isArray(payload) && payload.length > 0) {
    return payload[0];
  }

  return payload;
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

    const profile = await fetchUserProfile({ userId: user?.id, accessToken });
    const role = profile?.[PROFILE_ROLE_COLUMN] ?? null;
    const normalizedRole =
      typeof role === "string" ? role.trim().toLowerCase() : "";
    const isAdmin = normalizedRole === ADMIN_ROLE_VALUE;
    const createdByAdmin = Boolean(
      profile?.[PROFILE_CREATED_BY_ADMIN_COLUMN]
    );

    if (!profile || (!isAdmin && !createdByAdmin)) {
      return res.status(403).json({
        message:
          "Your account must be created by an administrator before you can sign in.",
      });
    }

    const displayName = profile?.[PROFILE_FULL_NAME_COLUMN] ?? null;

    return res.json({
      message: "Login successful",
      role: role || null,
      accessToken: accessToken || null,
      createdByAdmin,
      userId: user?.id || null,
      name: displayName,
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

app.post("/users", async (req, res) => {
  const rawEmail = req.body?.email;
  const rawPassword = req.body?.password;
  const rawRole = req.body?.role;
  const rawName = req.body?.name;
  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  const email =
    typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";
  const role = typeof rawRole === "string" ? rawRole.trim() : "";
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase environment variables are not fully configured.");
    return res.status(500).json({ message: "Server configuration error" });
  }

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Authorization token is required" });
  }

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Email, password, and role are required" });
  }

  try {
    const adminUser = await fetchAuthenticatedUser(accessToken);
    const adminProfile = await fetchUserProfile({
      userId: adminUser?.id,
      accessToken,
    });

    const adminRole = adminProfile?.[PROFILE_ROLE_COLUMN] ?? "";
    const isAdmin =
      typeof adminRole === "string" &&
      adminRole.trim().toLowerCase() === ADMIN_ROLE_VALUE;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Only administrators can create new users." });
    }

    const creation = await createSupabaseUser(email, password, name);
    const createdUser = creation?.user || creation;
    const newUserId = createdUser?.id;

    if (!newUserId) {
      throw new Error("Supabase did not return a user identifier");
    }

    let profileRecord;
    try {
      profileRecord = await upsertUserProfile({
        userId: newUserId,
        role,
        name,
        createdBy: adminUser?.id,
      });
    } catch (profileError) {
      await deleteSupabaseUser(newUserId);
      throw profileError;
    }

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUserId,
        email: createdUser?.email || email,
        role,
        name:
          profileRecord?.[PROFILE_FULL_NAME_COLUMN] || name || null,
        createdByAdmin: true,
      },
    });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    const message =
      statusCode >= 500
        ? "Unable to create user. Please try again later."
        : error.message || "Unable to create user.";

    return res.status(statusCode).json({ message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
