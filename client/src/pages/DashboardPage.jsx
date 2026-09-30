import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Sparkles, 
  Scan, 
  Layers, 
  FileText, 
  Activity, 
  TrendingUp, 
  Loader2, 
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import FieldCard from "../components/FieldCard";
import { fieldsApi, advisoryApi } from "../lib/api";
import { translations } from "../lib/i18n";

export default function DashboardPage({ user, lang = "en" }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFieldForAdv, setSelectedFieldForAdv] = useState(null);

  const navigate = useNavigate();
  const t = translations[lang] || translations.en;

  const fetchFields = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fieldsApi.getAll();
      setFields(res.fields || []);
    } catch (err) {
      console.error("Fetch fields error:", err);
      setError("Failed to load field profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleGenerateAdvisory = async (field) => {
    setGeneratingId(field.id);
    try {
      const payload = {
        field_id: field.id,
        field_name: field.field_name,
        region: field.region,
        soil_type: field.soil_type,
        ph_level: field.ph_level,
        nitrogen_ppm: field.nitrogen_ppm,
        phosphorus_ppm: field.phosphorus_ppm,
        potassium_ppm: field.potassium_ppm,
        irrigation_type: field.irrigation_type || "Drip Irrigation",
        season: field.season || "Kharif",
        crop_type: field.crop_type || "Crop",
        language: lang
      };

      const res = await advisoryApi.generate(payload);
      if (res.advisory) {
        navigate(`/advisory/${res.advisory.id}`);
      }
    } catch (err) {
      console.error("Advisory generation error:", err);
      alert("Failed to generate advisory: " + (err.response?.data?.error || err.message));
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDeleteField = async (id) => {
    if (!window.confirm("Are you sure you want to delete this field profile?")) return;
    try {
      await fieldsApi.delete(id);
      setFields(fields.filter((f) => f.id !== id));
    } catch (err) {
      alert("Failed to delete field: " + err.message);
    }
  };

  // Collect all recent advisories across fields
  const allAdvisories = fields.flatMap((f) => (f.advisories || []).map((a) => ({ ...a, field_name: f.field_name })));
  allAdvisories.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const avgPh = fields.length 
    ? (fields.reduce((acc, curr) => acc + Number(curr.ph_level || 7), 0) / fields.length).toFixed(1)
    : "7.0";

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            <span>Welcome, {user?.profile?.full_name || user?.email?.split("@")[0] || "Farmer"}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage field micro-climates, soil nutrients, and AI advisories
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/fields/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>{t.navNewField}</span>
          </Link>

          <Link
            to="/diagnostics"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Scan className="w-4 h-4" />
            <span>{t.diagnoseCrop}</span>
          </Link>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Registered Fields</span>
            <span className="text-xl font-bold font-mono text-white block">{fields.length}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Advisories</span>
            <span className="text-xl font-bold font-mono text-teal-400 block">{allAdvisories.length}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Average Soil pH</span>
            <span className="text-xl font-bold font-mono text-amber-400 block">{avgPh}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">AI Engine Status</span>
            <span className="text-xs font-bold text-emerald-400 block mt-1">Gemini 2.5 Active</span>
          </div>
        </div>

      </div>

      {/* Main Fields List Grid */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>{t.myFields}</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {fields.length} Profile{fields.length !== 1 ? "s" : ""} Total
          </span>
        </div>

        {loading ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs text-slate-400">Loading farm profiles & advisories...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        ) : fields.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Farm Fields Registered Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first soil profile with NPK metrics to receive personalized Gemini crop advisories.
            </p>
            <Link
              to="/fields/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 hover:bg-emerald-400 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register First Field</span>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onGenerateAdvisory={handleGenerateAdvisory}
                onDelete={handleDeleteField}
                isGenerating={generatingId === field.id}
                lang={lang}
              />
            ))}
          </div>
        )}

      </div>

      {/* Historical Recent Advisories Section */}
      {allAdvisories.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>{t.recentAdvisories}</span>
            </h2>
            <span className="text-xs text-slate-400">Past Farm Advisories</span>
          </div>

          <div className="space-y-3">
            {allAdvisories.slice(0, 5).map((adv) => (
              <div key={adv.id} className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400">{adv.field_name || "Farm Field"}</span>
                    <span className="text-[10px] text-slate-500 font-mono">• {new Date(adv.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1 italic">
                    "{adv.summary}"
                  </p>
                </div>

                <Link
                  to={`/advisory/${adv.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <span>View Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
