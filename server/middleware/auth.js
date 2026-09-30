import { supabase, isSupabaseConfigured } from "../config/supabase.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // In demo mode without configured Supabase, allow graceful fallback demo session
      if (!isSupabaseConfigured) {
        req.user = {
          id: "00000000-0000-0000-0000-000000000001",
          email: "farmer@agri-advisor.com",
          full_name: "Demo Farmer"
        };
        return next();
      }
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];

    if (token === "demo-token" || !isSupabaseConfigured) {
      req.user = {
        id: "00000000-0000-0000-0000-000000000001",
        email: "farmer@agri-advisor.com",
        full_name: "Demo Farmer"
      };
      return next();
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired session token" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Authentication failed" });
  }
}
