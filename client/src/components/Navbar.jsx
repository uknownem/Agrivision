import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Sprout, 
  Globe, 
  LayoutDashboard, 
  PlusCircle, 
  Scan, 
  LogOut, 
  LogIn, 
  User, 
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { languages, translations } from "../lib/i18n";

export default function Navbar({ lang, setLang, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const t = translations[lang] || translations.en;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform duration-300">
              <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                AgriVision <span className="text-emerald-400 text-sm font-semibold ml-0.5">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider font-medium hidden sm:block">
                GENAI CROP ADVISORY & DIAGNOSTICS
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {t.navLanding}
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/dashboard")
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.navDashboard}
                </Link>

                <Link
                  to="/fields/new"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/fields/new")
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  {t.navNewField}
                </Link>

                <Link
                  to="/diagnostics"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/diagnostics")
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Scan className="w-4 h-4 text-amber-400" />
                  {t.navDiagnostics}
                </Link>
              </>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:border-slate-500 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{languages.find((l) => l.code === lang)?.label}</span>
              </button>

              {langDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                        setLangDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 hover:bg-slate-800 ${
                        lang === item.code ? "text-emerald-400 bg-emerald-950/30 font-bold" : "text-slate-300"
                      }`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {user.email?.[0]?.toUpperCase() || "F"}
                  </div>
                  <span className="text-xs text-slate-300 max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/40 transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition-all"
                >
                  {t.navLogin}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-950/50 transition-all"
                >
                  {t.navRegister}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            {t.navLanding}
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                {t.navDashboard}
              </Link>
              <Link
                to="/fields/new"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                {t.navNewField}
              </Link>
              <Link
                to="/diagnostics"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                {t.navDiagnostics}
              </Link>
            </>
          )}

          {/* Language selector in mobile menu */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Language:</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {!user ? (
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2 rounded-lg text-sm font-medium bg-slate-900 border border-slate-700 text-slate-200"
              >
                {t.navLogin}
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-slate-950"
              >
                {t.navRegister}
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t.logout}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
