g# Deploying this project to Render (backend) and Vercel (frontend)

This repo contains a Node/Express backend in `backend/` and a Create-React-App frontend in `frontend/`.
This document explains the minimal steps to deploy the backend to Render and the frontend to Vercel.

1) Backend -> Render (Web Service)

- What to push: this repository (Render will use `render.yaml` at repo root).
- Render reads the `render.yaml` which instructs Render to deploy the `backend` folder as a Node web service.

Required environment variables / secrets (create these on Render and map them to names below):

- MONGO_URI (your MongoDB Atlas connection string)
- JWT_SECRET (your JWT secret)
- MPESA_API_KEY (if using M-Pesa integration)
- MPESA_API_SECRET (if using M-Pesa integration)

Render `render.yaml` references these secrets using the same names (MONGO_URI, JWT_SECRET, MPESA_API_KEY, MPESA_API_SECRET). Create Render "Secret" entries with those names and values.

Steps (summary):

1. Login to Render and create a new Web Service.
2. Connect your GitHub/GitLab/Bitbucket repo and choose branch `main`.
3. Render will detect `render.yaml` and create a service named `simple-ecom-backend`.
4. In Render service settings, create the Secrets and/or Environment Variables named above.
5. Deploy. After successful deployment you will get a public URL like `https://simple-ecom-backend.onrender.com`.

Notes:
- The backend uses `process.env.PORT` and will work on Render's assigned port.
- CORS is currently enabled for all origins (`app.use(cors())`) in `backend/server.js`. For tighter security, set `CLIENT_ORIGIN` environment variable and update CORS config accordingly before production.

2) Frontend -> Vercel

The frontend is a Create-React-App project. Vercel works well with CRA.

Required environment variables for Vercel:

- REACT_APP_API_URL — set this to your deployed backend URL, e.g. `https://simple-ecom-backend.onrender.com` (no trailing slash). Use this value in your frontend code to call the API.

Steps (summary):

1. Login to Vercel and import the repository.
2. Select the `frontend` directory as the project root (Vercel will detect `package.json`).
3. Under Project Settings → Environment Variables, add `REACT_APP_API_URL` (and any other REACT_APP_* variables you need).
4. Deploy. Vercel will run `npm install` and `npm run build` and serve the static `build` directory. The `frontend/vercel.json` file included configures the static-build behavior.

3) Local testing after deploy

- Once backend is deployed, confirm the health endpoint: `GET https://<render-backend-url>/` — it should respond with a success message.
- Ensure frontend points to the backend value in `REACT_APP_API_URL` and CORS permissions allow the origin.

4) Useful tips

- If you change the API base path, update the frontend to use the new base URL.
- Keep secrets out of the repo — use Render/Vercel secret management.
- If you need TLS custom domains, configure them in Render/Vercel dashboards.

If you'd like, I can:

- Add a small runtime check in `backend/server.js` to optionally restrict CORS to `process.env.CLIENT_ORIGIN`.
- Add a tiny script in the frontend to read `REACT_APP_API_URL` and show it on the login page for debugging.
