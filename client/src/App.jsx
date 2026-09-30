import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NewFieldWizardPage from "./pages/NewFieldWizardPage";
import AdvisoryDetailPage from "./pages/AdvisoryDetailPage";
import DiagnosticsPage from "./pages/DiagnosticsPage";
import { supabase, isSupabaseConfigured, mockAuth } from "./lib/supabaseClient";
import { authApi } from "./lib/api";

export default function App() {
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            localStorage.setItem("agri_token", session.access_token);
            setUser(session.user);
            await authApi.syncSession();
          }

          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
              localStorage.setItem("agri_token", session.access_token);
              setUser(session.user);
            } else {
              localStorage.removeItem("agri_token");
              setUser(null);
            }
          });
        } else {
          // Initialize mock user session for demo mode
          const token = localStorage.getItem("agri_token") || "demo-token";
          localStorage.setItem("agri_token", token);
          setUser(mockAuth.session.user);
          await authApi.syncSession();
        }
      } catch (err) {
        console.warn("Init auth warning:", err);
      } finally {
        setLoadingSession(false);
      }
    };

    initAuth();
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("agri_token");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
        <div>
          <Navbar
            lang={lang}
            setLang={setLang}
            user={user}
            onLogout={handleLogout}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Routes>
              <Route path="/" element={<LandingPage lang={lang} />} />
              <Route
                path="/login"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <LoginPage onAuthSuccess={setUser} lang={lang} />
                }
              />
              <Route
                path="/register"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <RegisterPage onAuthSuccess={setUser} lang={lang} />
                }
              />
              <Route
                path="/dashboard"
                element={<DashboardPage user={user} lang={lang} />}
              />
              <Route
                path="/fields/new"
                element={<NewFieldWizardPage lang={lang} />}
              />
              <Route
                path="/advisory/:id"
                element={<AdvisoryDetailPage lang={lang} />}
              />
              <Route
                path="/diagnostics"
                element={<DiagnosticsPage lang={lang} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Footer lang={lang} />
      </div>
    </BrowserRouter>
  );
}
