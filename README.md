# IT-PM Login Application

## Overview
This repository contains a simple login experience composed of a React front end (`login/`) and a lightweight Express backend (`login-backend/`). The frontend now sends credentials to the backend's `/login` endpoint, which validates them against an in-memory user list. You can override the backend URL via an environment variable when needed.

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
3. Start the server:
   ```bash
   node server.js
   ```
4. The API will be available at `http://localhost:5000/login`. The server accepts POST requests containing an `email` and `password` field and responds with a success message and role when the credentials match one of the predefined users.

   The default demo credentials are:
   - `admin@example.com` / `admin123`
   - `user@example.com` / `user123`

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
5. Vite prints a local URL (typically `http://localhost:5173/`). Open it in a browser to interact with the application. The login form now sends credentials to the Express backend and displays error messages if the request fails.

## Project Structure
```
IT-PM/
├── README.md           # Project documentation
├── login/              # React frontend powered by Vite
│   ├── .env.example    # Sample environment file for the frontend API URL
│   ├── package.json
│   └── src/
└── login-backend/      # Express backend with a simple /login route
    ├── package.json
    └── server.js
```

## Additional Notes
- Both projects rely on npm scripts defined in their respective `package.json` files. Explore those files if you need to customize build or lint commands.
- The backend stores credentials in memory for demonstration purposes only. Replace it with a persistent data store and proper authentication strategy before using in production.
