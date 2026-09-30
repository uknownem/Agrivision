import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";

export const isGeminiConfigured = Boolean(
  apiKey && 
  apiKey !== "your_actual_gemini_api_key_here" && 
  apiKey.length > 5
);

export const ai = isGeminiConfigured ? new GoogleGenAI({ apiKey }) : null;
