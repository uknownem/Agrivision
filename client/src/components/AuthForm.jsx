import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { supabase, isSupabaseConfigured, mockAuth } from "../lib/supabaseClient";
import { authApi } from "../lib/api";
import { translations } from "../lib/i18n";

export default function AuthForm({ initialMode = "login", onAuthSuccess, lang = "en" }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const navigate = useNavigate();
  const t = translations[lang] || translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSupabaseConfigured && supabase) {
        if (mode === "register") {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName }
            }
          });
          if (signUpError) throw signUpError;

          if (data.session) {
            localStorage.setItem("agri_token", data.session.access_token);
            await authApi.syncSession();
            onAuthSuccess(data.user);
            navigate("/dashboard");
          } else {
            setSuccessMsg("Registration successful! Please check your email for activation link.");
          }
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (signInError) throw signInError;

          localStorage.setItem("agri_token", data.session.access_token);
          await authApi.syncSession();
          onAuthSuccess(data.user);
          navigate("/dashboard");
        }
      } else {
        // Demo Mode Auth
        const res = mode === "register"
          ? await mockAuth.signUp(email, password, fullName)
          : await mockAuth.signIn(email, password);

        localStorage.setItem("agri_token", res.data.session.access_token);
        await authApi.syncSession();
        onAuthSuccess(res.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mockAuth.signIn("farmer@agri-advisor.com", "demo12345");
      localStorage.setItem("agri_token", res.data.session.access_token);
      await authApi.syncSession();
      onAuthSuccess(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mode Selector Header */}
      <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === "login"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {t.navLogin}
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === "register"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {t.navRegister}
        </button>
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-extrabold text-white">
          {mode === "login" ? "Welcome Back, Farmer" : "Create Farmer Profile"}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {mode === "login"
            ? "Access your registered fields & AI crop advisories"
            : "Start generating precision soil & crop recommendations"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {mode === "register" && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name / Farm Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@agri-advisor.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all mt-2"
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>{mode === "login" ? "Sign In to Dashboard" : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      {/* Quick Demo Access Button */}
      <div className="mt-6 pt-6 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400 mb-3">
          Testing without Supabase setup?
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4 fill-emerald-400" />
          <span>One-Click Quick Demo Login</span>
        </button>
      </div>

    </div>
  );
}
