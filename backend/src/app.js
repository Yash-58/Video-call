import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns";
import mongoose from "mongoose";
import cors from "cors";

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

// Multi-path .env resolution (supports backend/, backend/src/, or workspace root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Resilient DNS configuration
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
    console.warn("Notice: Using default DNS resolver:", err.message);
}

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const PORT = process.env.PORT || 8000;
app.set("port", PORT);

// Enable CORS for all origins
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["*"]
}));

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Health check and root route for Render
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Video Call Backend Server is running!",
        timestamp: new Date().toISOString()
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        uptime: process.uptime()
    });
});

// API Routes
app.use("/api/v1/users", userRoutes);

const start = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.warn("===============================================================");
        console.warn("WARNING: MONGO_URI is not set!");
        console.warn("Please add MONGO_URI to your environment variables on Render.");
        console.warn("Example: MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname");
        console.warn("===============================================================");
    } else {
        try {
            const connectionDb = await mongoose.connect(mongoUri);
            console.log(`MongoDB Connected successfully to host: ${connectionDb.connection.host}`);
        } catch (err) {
            console.error("===============================================================");
            console.error("MongoDB Connection Failed:", err.message);
            console.error("If deploying on Render, ensure MongoDB Atlas Network Access is set to allow 0.0.0.0/0 (anywhere).");
            console.error("===============================================================");
        }
    }

    // Bind to 0.0.0.0 so Render container routes external traffic to the server
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running and listening on http://0.0.0.0:${PORT}`);
    });
};

start();