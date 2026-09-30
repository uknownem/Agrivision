import React from "react";
import { Sprout, ShieldCheck, Cpu, Database, Heart } from "lucide-react";
import { translations } from "../lib/i18n";

export default function Footer({ lang = "en" }) {
  const t = translations[lang] || translations.en;

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-10 px-4 mt-20 no-print">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              AgriVision <span className="text-emerald-400">AI</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed max-w-sm text-slate-400">
            Empowering farmers, agronomists, and agricultural extension workers with real-time NPK balancing, smart irrigation scheduling, and multimodal disease diagnostics powered by Gemini 2.5 & Supabase.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
            Core Modules
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Soil & NPK Profiling</li>
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Gemini Advisory Generator</li>
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Multimodal Disease Scanner</li>
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">PDF Export & History</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
            System Stack
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Gemini API (@google/genai)</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Auth & PostgreSQL RLS</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zod End-to-End Validation</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
        <span>© {new Date().getFullYear()} AgriVision AI • Production Full-Stack Web Application</span>
        <span className="flex items-center gap-1">
          Built with precision for sustainable agriculture <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500" />
        </span>
      </div>
    </footer>
  );
}
