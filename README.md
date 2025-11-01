# IT-PM Login Application

## Overview
This repository contains a simple login experience composed of a React front end (`login/`) and a lightweight Express backend (`login-backend/`). The frontend sends credentials to the backend's `/login` endpoint, which proxies them to Supabase Auth, confirms that the account was provisioned by an administrator, and returns the associated role from your Supabase profile table. Administrators can create additional users through the backend, and all new accounts are marked so they are eligible to sign in. You can override the backend URL via an environment variable when needed.

## Prerequisites
- Node.js 18 or later (earlier versions may work, but the project is built with modern tooling).
- npm (bundled with Node.js) for installing dependencies and running scripts.

## Install Dependencies
Each project lives in its own directory, so install packages separately:

```bash
cd login
npm install

cd ../login-backend
npm install
```

## Running the Express Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd login-backend
   ```
2. Ensure dependencies are installed (see above).
3. Provide Supabase credentials by copying `.env.example` to `.env` and filling in your project values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `SUPABASE_URL` – your project URL (e.g., `https://xyzcompany.supabase.co`).
   - `SUPABASE_ANON_KEY` – an anon key permitted to call the password grant flow.
   - `SUPABASE_SERVICE_ROLE_KEY` – the service role key is used on the server to create accounts and bypass row-level security when reading profile data.

   Optional overrides let you customise which table and columns store profile information (`SUPABASE_PROFILE_TABLE`, `SUPABASE_PROFILE_ROLE_COLUMN`, `SUPABASE_PROFILE_USER_ID_COLUMN`, `SUPABASE_PROFILE_CREATED_BY_ADMIN_COLUMN`, `SUPABASE_PROFILE_FULL_NAME_COLUMN`, and `SUPABASE_PROFILE_CREATED_BY_COLUMN`). You can also override the administrator role value with `SUPABASE_ADMIN_ROLE_VALUE` if you use something other than `admin`.

4. Start the server:
   ```bash
   node server.js
   ```
5. The API will be available at `http://localhost:5000/login`. The server accepts POST requests containing an `email` and `password` field, signs the user in with Supabase, verifies that their profile was created by an administrator (or that their role is `admin`), and returns the role alongside an access token. Only administrators and the users that those administrators have created can successfully sign in.

> Tip: If you prefer automatic restarts during development, install `nodemon` globally (`npm install -g nodemon`) and run `nodemon server.js` instead.

## Running the React Frontend
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd login
   ```
2. Ensure dependencies are installed (see above).
3. (Optional) Configure the backend URL by copying `.env.example` to `.env` and adjusting `VITE_API_BASE_URL`.

   ```bash
   cp .env.example .env
   ```

   By default the frontend targets `http://localhost:5000`.

4. Launch the Vite development server:
   ```bash
   npm run dev
   ```
5. Vite prints a local URL (typically `http://localhost:5173/`). Open it in a browser to interact with the application. The login form now sends credentials to the Express backend, stores the returned access token for administrators, and displays error messages if the request fails or the account has not been approved by an administrator.

## Creating Users via the Backend API

Administrators can create additional users through the backend `POST /users` endpoint. Supply the admin access token returned from `/login` in the `Authorization` header and provide the new user's details in the request body:

```bash
curl -X POST "http://localhost:5000/users" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new.user@example.com",
    "password": "ChangeMe123!",
    "role": "analyst",
    "name": "New User"
  }'
```

The backend uses the Supabase service role key to provision the account, stores profile metadata (including the `created_by_admin` flag), and returns a summary of the newly created user.

## Supabase Schema

Run the SQL script in [`supabase/profiles.sql`](supabase/profiles.sql) inside the Supabase SQL editor to create the expected `profiles` table, trigger, and policies. The table tracks whether an account was created by an administrator and gives admins permission to manage profiles while allowing users to view their own data.

## Project Structure
```
IT-PM/
├── README.md           # Project documentation
├── login/              # React frontend powered by Vite
│   ├── .env.example    # Sample environment file for the frontend API URL
│   ├── package.json
│   └── src/
└── login-backend/      # Express backend proxying authentication through Supabase
    ├── .env.example    # Sample Supabase configuration
    ├── package.json
    └── server.js
```

## Additional Notes
- Both projects rely on npm scripts defined in their respective `package.json` files. Explore those files if you need to customize build or lint commands.
- Supabase manages credentials and roles. Ensure you configure a `profiles` (or equivalent) table with an accessible role column so the backend can return role information to the frontend.
