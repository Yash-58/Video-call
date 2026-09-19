# Video Call Web Application

Full-stack video calling application built with Node.js, Express, Socket.IO, WebRTC, React, and Material-UI.

---

## Deploying Backend to Render

You can deploy the backend folder directly to [Render](https://render.com) using either of the two methods below.

### Method 1: Web Service (Manual Setup)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`Video-call`).
3. Fill in the following settings:
   - **Name**: `video-call-backend` (or your preferred name)
   - **Region**: Choose the closest region to you (e.g., Singapore, Frankfurt, Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend` *(CRITICAL: must be set to `backend`)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - **Key**: `MONGO_URI`
   - **Value**: Your MongoDB Atlas connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`)
   *(Note: Render sets the `PORT` variable automatically).*
5. Click **Create Web Service**.

### Method 2: Blueprint (1-Click Setup)

1. In Render Dashboard, click **New +** -> **Blueprint**.
2. Select your repository. Render will automatically read `render.yaml`.
3. Provide your `MONGO_URI` when prompted.
4. Click **Apply**.

---

### Important: MongoDB Atlas Network Access
For Render to connect to MongoDB Atlas:
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left sidebar, navigate to **Security** -> **Network Access**.
3. Click **Add IP Address**.
4. Select **Allow Access From Anywhere** (`0.0.0.0/0`) and click **Confirm**.
*(Render uses dynamic outbound IP addresses, so allowing 0.0.0.0/0 is required for the free tier).*

---

## Local Development

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend server will run on `http://localhost:8000`.

### Health Check
Once running, you can verify backend health:
- `http://localhost:8000/`
- `http://localhost:8000/health`
