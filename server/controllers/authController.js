import { supabase, isSupabaseConfigured } from "../config/supabase.js";
import { mockStore } from "../lib/mockStore.js";

export async function syncAuthSession(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    let profile = null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile from Supabase:", error);
      }
      profile = data;

      if (!profile) {
        // Create initial profile if absent
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split("@")[0] || "Agri User"
        };
        const { data: inserted, error: insertError } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select()
          .single();

        if (!insertError) {
          profile = inserted;
        }
      }
    } else {
      profile = mockStore.profiles.find((p) => p.id === user.id) || {
        id: user.id,
        email: user.email || "farmer@agri-advisor.com",
        full_name: user.full_name || "Demo Farmer",
        created_at: new Date().toISOString()
      };
    }

    res.json({
      message: "Session synchronized successfully",
      user: {
        id: user.id,
        email: user.email,
        profile: profile
      }
    });
  } catch (error) {
    console.error("syncAuthSession error:", error);
    res.status(500).json({ error: "Failed to sync auth session" });
  }
}
