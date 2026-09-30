import React from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Layers, 
  Droplets, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Trash2, 
  Activity,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { translations } from "../lib/i18n";

export default function FieldCard({ field, onGenerateAdvisory, onDelete, isGenerating = false, lang = "en" }) {
  const t = translations[lang] || translations.en;

  const {
    id,
    field_name,
    region,
    soil_type,
    ph_level,
    nitrogen_ppm,
    phosphorus_ppm,
    potassium_ppm,
    irrigation_type,
    season,
    crop_type,
    advisories = []
  } = field;

  // Compute status helpers
  const phStatus = 
    ph_level < 6.0 ? { label: "Acidic", color: "text-amber-400 bg-amber-400/10 border-amber-500/30" } :
    ph_level > 7.5 ? { label: "Alkaline", color: "text-amber-400 bg-amber-400/10 border-amber-500/30" } :
    { label: "Optimal pH", color: "text-emerald-400 bg-emerald-400/10 border-emerald-500/30" };

  const latestAdvisory = advisories?.[0];

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:shadow-emerald-950/20 group relative flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                {field_name}
              </h3>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${phStatus.color}`}>
                {phStatus.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{region}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-medium">{crop_type || "General Crop"}</span>
            </p>
          </div>

          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            title="Delete field"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-400" />
            {soil_type}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
            <Droplets className="w-3 h-3 text-cyan-400" />
            {irrigation_type || "Drip"}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-purple-400" />
            {season || "Kharif"}
          </span>
        </div>

        {/* Soil Metrics Dashboard */}
        <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800/60 mb-4 space-y-2.5">
          
          {/* pH Bar */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-400">{t.phLevel}:</span>
              <span className="text-emerald-400 font-mono font-bold">{ph_level}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(((ph_level - 4) / 6) * 100, 5), 100)}%` }}
              />
            </div>
          </div>

          {/* NPK Values Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-slate-900/90 rounded-lg p-2 text-center border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">{t.nitrogen}</span>
              <span className="text-sm font-extrabold font-mono text-emerald-400">{nitrogen_ppm} <span className="text-[9px] text-slate-500 font-sans">ppm</span></span>
            </div>
            <div className="bg-slate-900/90 rounded-lg p-2 text-center border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">{t.phosphorus}</span>
              <span className="text-sm font-extrabold font-mono text-cyan-400">{phosphorus_ppm} <span className="text-[9px] text-slate-500 font-sans">ppm</span></span>
            </div>
            <div className="bg-slate-900/90 rounded-lg p-2 text-center border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">{t.potassium}</span>
              <span className="text-sm font-extrabold font-mono text-amber-400">{potassium_ppm} <span className="text-[9px] text-slate-500 font-sans">ppm</span></span>
            </div>
          </div>

        </div>

        {/* Latest Advisory Snippet */}
        {latestAdvisory ? (
          <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Latest Advisory Available</span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 italic">
              "{latestAdvisory.summary}"
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-3 mb-4 text-center">
            <span className="text-xs text-slate-400">No advisory generated yet for this field</span>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
        <button
          onClick={() => onGenerateAdvisory(field)}
          disabled={isGenerating}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>{t.generateAdvisory}</span>
            </>
          )}
        </button>

        {latestAdvisory && (
          <Link
            to={`/advisory/${latestAdvisory.id}`}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 transition-all"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

    </div>
  );
}
