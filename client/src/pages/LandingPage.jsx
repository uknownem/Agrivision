import React from "react";
import { Link } from "react-router-dom";
import { 
  Sprout, 
  Sparkles, 
  FlaskConical, 
  Scan, 
  FileCheck2, 
  ShieldCheck, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  Layers,
  Droplets,
  Zap,
  TrendingUp
} from "lucide-react";
import { translations } from "../lib/i18n";

export default function LandingPage({ lang = "en" }) {
  const t = translations[lang] || translations.en;

  return (
    <div className="space-y-24 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 text-center max-w-5xl mx-auto px-4">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-8 shadow-lg shadow-emerald-950/50">
          <Sparkles className="w-4 h-4 fill-emerald-400" />
          <span>Powered by Gemini 2.5 Flash & Supabase Architecture</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Precision Agriculture Driven by{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
            Generative AI
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          {t.heroSubtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-2xl shadow-emerald-950/80 hover:scale-[1.02] transition-all"
          >
            <span>{t.getStarted}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>

          <Link
            to="/dashboard"
            className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 font-bold text-sm flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-emerald-400" />
            <span>{t.exploreDemo}</span>
          </Link>
        </div>

        {/* Live Metric Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 glass-card p-6 rounded-3xl border border-slate-800">
          <div className="text-center border-r border-slate-800/80 last:border-0">
            <span className="text-3xl font-black text-emerald-400 font-mono">40%</span>
            <span className="text-xs text-slate-400 block font-medium mt-1">Fertilizer Waste Reduction</span>
          </div>
          <div className="text-center border-r border-slate-800/80 last:border-0">
            <span className="text-3xl font-black text-teal-400 font-mono">92%+</span>
            <span className="text-xs text-slate-400 block font-medium mt-1">Multimodal Disease Accuracy</span>
          </div>
          <div className="text-center border-r border-slate-800/80 last:border-0">
            <span className="text-3xl font-black text-amber-400 font-mono">4</span>
            <span className="text-xs text-slate-400 block font-medium mt-1">Supported Languages</span>
          </div>
          <div className="text-center">
            <span className="text-3xl font-black text-cyan-400 font-mono">&lt; 2s</span>
            <span className="text-xs text-slate-400 block font-medium mt-1">Gemini AI Latency</span>
          </div>
        </div>

      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">
            End-to-End Agronomic Intelligence
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-2">
            Four specialized AI pillars engineered for sustainable farming and maximum crop yield
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-card rounded-3xl p-6 border border-slate-800/80 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white mb-2">Soil & NPK Profiler</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Input pH level, Nitrogen, Phosphorus, Potassium, and irrigation sources for instant soil health classification.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800/80 hover:border-teal-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white mb-2">Gemini AI Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict JSON schema-enforced advisories providing fertilizer split dosage, irrigation timings, and risk factors.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800/80 hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white mb-2">Multimodal Leaf Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload plant leaf images for instant visual pest & pathogen diagnosis via Gemini Vision.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800/80 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white mb-2">PDF & Multilingual</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export printable PDF reports in English, Hindi, Marathi, and Spanish with persistent Supabase backend storage.
            </p>
          </div>

        </div>
      </section>

      {/* Target Domains Showcase */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-emerald rounded-3xl p-8 md:p-12 border border-emerald-500/30 relative overflow-hidden">
          
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                Scientifically Grounded
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Covering Every Stage of Crop Development
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Whether managing acidic soil pH in high rainfall zones or preventing insect pest swarms in arid climates, AgriVision AI delivers bounded, zero-hallucination agronomic guidance.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>NPK Adjustment Schedules</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Evapotranspiration Irrigation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Biological IPM Controls</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sowing Window Optimization</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Sample Gemini Advisory Preview
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">
                  JSON SCHEMA ENFORCED
                </span>
              </div>
              <p className="text-xs text-slate-300 italic">
                "Apply 45 kg/acre Neem-Coated Urea in split doses. Soil pH 6.8 is optimal for Paddy. Monitor for Stem Borer."
              </p>
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800/80 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                {`{ "fertilizer_plan": [...], "irrigation": "AWD 5-7 days", "risk_factors": [{ "severity": "High", "action": "Timed urea application" }] }`}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="glass-card rounded-3xl p-10 border border-slate-800 space-y-6">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to Optimize Your Agricultural Yields?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Create your farm profile in under 2 minutes and start receiving real-time AI advisories backed by Supabase & Gemini.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-950/60 hover:scale-105 transition-all"
          >
            <span>Launch AgriVision Dashboard</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </section>

    </div>
  );
}
