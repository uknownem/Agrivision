import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import fieldRoutes from "./routes/fieldRoutes.js";
import advisoryRoutes from "./routes/advisoryRoutes.js";
import diagnosticsRoutes from "./routes/diagnosticsRoutes.js";
import { isSupabaseConfigured } from "./config/supabase.js";
import { isGeminiConfigured } from "./config/gemini.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Rate Limiter for AI generation & diagnostics endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many advisory requests from this IP, please try again after 15 minutes" }
});

app.use("/api/advisory", aiLimiter);
app.use("/api/diagnostics", aiLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/advisory", advisoryRoutes);
app.use("/api/diagnostics", diagnosticsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "AI-Powered Agriculture Crop Advisory API",
    version: "1.0.0",
    supabase: isSupabaseConfigured ? "Connected" : "Demo Mode / Mock Fallback",
    gemini: isGeminiConfigured ? "Active (@google/genai)" : "Demo Mode / Fallback Expert Engine",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🌾 Agri-Advisor Server running on http://localhost:${PORT}`);
  console.log(`⚡ Supabase Configured: ${isSupabaseConfigured}`);
  console.log(`🤖 Gemini AI Configured: ${isGeminiConfigured}`);
});
