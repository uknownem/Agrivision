import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sprout, 
  MapPin, 
  Layers, 
  Droplets, 
  FlaskConical, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { fieldSchema } from "../shared/validators";
import { fieldsApi, advisoryApi } from "../lib/api";
import { translations } from "../lib/i18n";

const SOIL_TYPES = [
  "Alluvial",
  "Black (Regur)",
  "Red & Yellow",
  "Laterite",
  "Arid / Sandy",
  "Peaty / Organic",
  "Clay Loam",
  "Silty Loam",
  "Other"
];

const SEASONS = [
  "Kharif (Monsoon)",
  "Rabi (Winter)",
  "Zaid (Summer)"
];

const IRRIGATION_TYPES = [
  "Drip Irrigation",
  "Canal / Flood",
  "Sprinkler System",
  "Rainfed / Natural Rainfall",
  "Sub-surface Drip"
];

export default function NewFieldWizardPage({ lang = "en" }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    field_name: "",
    region: "Punjab (Northern Plains)",
    soil_type: "Alluvial",
    ph_level: 6.8,
    nitrogen_ppm: 140,
    phosphorus_ppm: 45,
    potassium_ppm: 210,
    irrigation_type: "Drip Irrigation",
    season: "Kharif (Monsoon)",
    crop_type: "Wheat"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const t = translations[lang] || translations.en;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = () => {
    setFieldErrors({});
    setError(null);

    if (step === 1) {
      if (!formData.field_name.trim()) {
        setFieldErrors({ field_name: "Field name is required" });
        return false;
      }
      if (!formData.region.trim()) {
        setFieldErrors({ region: "Region is required" });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError(null);

    try {
      // Validate full form with Zod
      const validation = fieldSchema.safeParse(formData);
      if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        setFieldErrors(errors);
        setError("Please correct the form fields highlighted below.");
        setLoading(false);
        return;
      }

      const res = await fieldsApi.create(validation.data);
      const createdField = res.field;

      // Automatically generate first advisory for the new field
      if (createdField) {
        try {
          const advRes = await advisoryApi.generate({
            field_id: createdField.id,
            field_name: createdField.field_name,
            region: createdField.region,
            soil_type: createdField.soil_type,
            ph_level: createdField.ph_level,
            nitrogen_ppm: createdField.nitrogen_ppm,
            phosphorus_ppm: createdField.phosphorus_ppm,
            potassium_ppm: createdField.potassium_ppm,
            irrigation_type: createdField.irrigation_type,
            season: createdField.season,
            crop_type: createdField.crop_type,
            language: lang
          });

          if (advRes.advisory) {
            navigate(`/advisory/${advRes.advisory.id}`);
            return;
          }
        } catch (advErr) {
          console.warn("Auto advisory failed:", advErr);
        }
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Create field error:", err);
      setError(err.response?.data?.error || "Failed to create field profile.");
    } finally {
      setLoading(false);
    }
  };

  const getPhTag = (ph) => {
    if (ph < 6.0) return { label: "Acidic Soil", color: "text-amber-400 bg-amber-950/40 border-amber-800" };
    if (ph > 7.5) return { label: "Alkaline Soil", color: "text-cyan-400 bg-cyan-950/40 border-cyan-800" };
    return { label: "Ideal Nutrient pH", color: "text-emerald-400 bg-emerald-950/40 border-emerald-800" };
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      
      {/* Wizard Header Progress */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 mb-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Interactive Soil Profiler
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-0.5">
              Register New Farm Field
            </h1>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            Step {step} of 3
          </span>
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-2 rounded-full transition-all ${step >= 1 ? "bg-emerald-500" : "bg-slate-800"}`} />
          <div className={`h-2 rounded-full transition-all ${step >= 2 ? "bg-emerald-500" : "bg-slate-800"}`} />
          <div className={`h-2 rounded-full transition-all ${step >= 3 ? "bg-emerald-500" : "bg-slate-800"}`} />
        </div>

        <div className="flex justify-between text-[11px] font-semibold text-slate-400">
          <span className={step >= 1 ? "text-emerald-400" : ""}>1. Location & Crop</span>
          <span className={step >= 2 ? "text-emerald-400" : ""}>2. Soil & pH Classification</span>
          <span className={step >= 3 ? "text-emerald-400" : ""}>3. NPK Metrics & Water</span>
        </div>

      </div>

      {/* Main Wizard Form Body */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800">
        
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Location & Crop */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Field Location & Crop Profile</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Field Profile Name *
                </label>
                <input
                  type="text"
                  name="field_name"
                  value={formData.field_name}
                  onChange={handleChange}
                  placeholder="e.g. Green Acres North Sector"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                {fieldErrors.field_name && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.field_name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Geographic Region / Climate Zone *
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="e.g. Punjab Plains, Deccan Plateau, Central Valley"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                {fieldErrors.region && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.region}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Crop Species / Variety
                  </label>
                  <input
                    type="text"
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleChange}
                    placeholder="e.g. Wheat, Rice, Cotton, Tomato"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Season
                  </label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {SEASONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Soil Type & pH Level */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Soil Classification & pH Level</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Primary Soil Classification
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SOIL_TYPES.map((soil) => (
                    <button
                      type="button"
                      key={soil}
                      onClick={() => setFormData((p) => ({ ...p, soil_type: soil }))}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left ${
                        formData.soil_type === soil
                          ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {soil}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive pH Slider */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300">
                    Soil pH Level (4.0 - 10.0)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black font-mono text-emerald-400">{formData.ph_level}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getPhTag(formData.ph_level).color}`}>
                      {getPhTag(formData.ph_level).label}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  name="ph_level"
                  min="4.0"
                  max="10.0"
                  step="0.1"
                  value={formData.ph_level}
                  onChange={handleChange}
                  className="w-full accent-emerald-400 bg-slate-800 h-2.5 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>4.0 (Highly Acidic)</span>
                  <span>7.0 (Neutral)</span>
                  <span>10.0 (Highly Alkaline)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NPK Metrics & Irrigation */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
                <span>Soil Lab NPK Testing Data</span>
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nitrogen N (0 - 500 ppm)
                  </label>
                  <input
                    type="number"
                    name="nitrogen_ppm"
                    min="0"
                    max="500"
                    value={formData.nitrogen_ppm}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phosphorus P (0 - 200 ppm)
                  </label>
                  <input
                    type="number"
                    name="phosphorus_ppm"
                    min="0"
                    max="200"
                    value={formData.phosphorus_ppm}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Potassium K (0 - 500 ppm)
                  </label>
                  <input
                    type="number"
                    name="potassium_ppm"
                    min="0"
                    max="500"
                    value={formData.potassium_ppm}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Irrigation Water Source
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {IRRIGATION_TYPES.map((irr) => (
                    <button
                      type="button"
                      key={irr}
                      onClick={() => setFormData((p) => ({ ...p, irrigation_type: irr }))}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left ${
                        formData.irrigation_type === irr
                          ? "bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-md"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {irr}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Navigation Control Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-emerald-950/60 hover:brightness-110 transition-all"
              >
                {loading ? (
                  <span>Generating AI Advisory...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Save Field & Generate Gemini Advisory</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>

    </div>
  );
}
