import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("your_supabase_project_url")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock auth helpers when Supabase project is not linked yet
export const mockAuth = {
  session: {
    access_token: "demo-token",
    user: {
      id: "00000000-0000-0000-0000-000000000001",
      email: "farmer@agri-advisor.com",
      user_metadata: { full_name: "Rajesh Kumar (Demo Farmer)" }
    }
  },
  signIn: async (email, password) => {
    return {
      data: {
        user: {
          id: "00000000-0000-0000-0000-000000000001",
          email: email || "farmer@agri-advisor.com",
          user_metadata: { full_name: "Demo Farmer" }
        },
        session: { access_token: "demo-token" }
      },
      error: null
    };
  },
  signUp: async (email, password, fullName) => {
    return {
      data: {
        user: {
          id: "00000000-0000-0000-0000-000000000001",
          email,
          user_metadata: { full_name: fullName }
        },
        session: { access_token: "demo-token" }
      },
      error: null
    };
  },
  signOut: async () => {
    return { error: null };
  }
};
