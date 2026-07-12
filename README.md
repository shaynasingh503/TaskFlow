# TaskFlow

Role-based employee task management application built with React, Vite, Tailwind CSS, Express, and MongoDB.

## Quick start

1. Copy `server/.env.example` to `server/.env` and provide a MongoDB Atlas connection string.
2. Run `npm install`, then `npm run install:all`.
3. Run `npm run dev`.

The client runs at `http://localhost:5173` and the API at `http://localhost:5000`.

Create the first administrator by calling `POST /api/auth/register` with a `role` of `admin` (or use the endpoint from Postman). All subsequent employees can be created from the admin area.

## Deploy to Render and Vercel

Push this repository to GitHub first. The included `render.yaml` configures the API service.

1. In Render, choose **New → Blueprint**, select the repository, and create the `taskflow-api` service. Set `MONGO_URI` to your MongoDB Atlas connection string. Render generates `JWT_SECRET` automatically.
2. In Vercel, import the same repository, set the **Root Directory** to `client`, and deploy. Add `VITE_API_URL` as `https://<your-render-service>.onrender.com/api` in Vercel’s production environment variables, then redeploy.
3. Copy the deployed Vercel URL into Render’s `CLIENT_URL` environment variable and redeploy the Render service.

For a custom domain, use the final HTTPS Vercel domain as `CLIENT_URL`. Never commit `.env` files or secrets.
