import React, { useState } from "react";
import { 
  UploadCloud, 
  Scan, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Activity,
  Image as ImageIcon,
  RotateCcw,
  Stethoscope,
  Info
} from "lucide-react";
import { diagnosticsApi } from "../lib/api";
import { translations } from "../lib/i18n";

const SAMPLE_IMAGES = [
  {
    name: "Tomato Leaf Blight",
    crop: "Tomato",
    symptoms: "Concentric brown spots with yellow borders on foliage",
    url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Cotton Yellowing Chlorosis",
    crop: "Cotton",
    symptoms: "Yellow chlorosis between leaf veins and stunted growth",
    url: "https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Wheat Rust Sample",
    crop: "Wheat",
    symptoms: "Orange-brown pustules along leaf blades",
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=400&q=80"
  }
];

export default function DiseaseScanner({ lang = "en" }) {
  const t = translations[lang] || translations.en;

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropType, setCropType] = useState("Tomato");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const handleSelectSample = (sample) => {
    setImagePreview(sample.url);
    setImageFile(null); // base64 string will be sent from sample url
    setCropType(sample.crop);
    setSymptoms(sample.symptoms);
    setResult(null);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const handleScan = async () => {
    if (!imagePreview && !imageFile) {
      setError("Please select or upload a crop photo first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imagePreview) {
        formData.append("image_base64", imagePreview);
      }
      formData.append("crop_type", cropType);
      formData.append("symptoms_description", symptoms);
      formData.append("language", lang);

      const res = await diagnosticsApi.scan(formData);
      if (res.scan_result) {
        setResult(res.scan_result);
      } else {
        setError("Could not parse diagnostic output");
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError(err.response?.data?.error || "Diagnostic scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setSymptoms("");
  };

  return (
    <div className="space-y-8">
      
      {/* Scanner Input Panel */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Stethoscope className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Multimodal Crop Disease & Pest Scanner
              </h2>
              <p className="text-xs text-slate-400">
                Powered by Gemini 2.5 Vision AI for leaf analysis
              </p>
            </div>
          </div>

          {(imagePreview || result) && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Preset Sample Cards */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Try Sample Images:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_IMAGES.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  imagePreview === sample.url
                    ? "bg-amber-950/40 border-amber-500 text-amber-300"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="overflow-hidden">
                  <span className="text-xs font-bold block truncate">{sample.name}</span>
                  <span className="text-[10px] text-slate-400 truncate block">{sample.crop}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            imagePreview
              ? "border-emerald-500/50 bg-slate-900/60"
              : "border-slate-800 hover:border-amber-500/50 bg-slate-950/60"
          }`}
        >
          {imagePreview ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={imagePreview}
                alt="Selected crop sample"
                className="max-h-64 rounded-xl object-contain border border-slate-700 shadow-xl"
              />
              <span className="text-xs text-slate-400">
                Image loaded • Ready for Gemini Multimodal Analysis
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                <UploadCloud className="w-8 h-8 stroke-[1.5]" />
              </div>
              <p className="text-sm text-slate-300 font-medium">
                {t.uploadPrompt}
              </p>
              <p className="text-xs text-slate-500">
                Supports JPG, PNG, WEBP up to 10MB
              </p>
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 mt-2">
                Browse Image File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Diagnostic Metadata Input */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Crop Species
            </label>
            <input
              type="text"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="e.g. Tomato, Rice, Cotton, Wheat"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Symptoms Observed (Optional Notes)
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Yellow spots, leaf curling, wilting stems"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Scan Trigger Button */}
        <button
          onClick={handleScan}
          disabled={loading || (!imagePreview && !imageFile)}
          className={`w-full mt-6 py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
            loading || (!imagePreview && !imageFile)
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
              : "bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-amber-950/40"
          }`}
        >
          {loading ? (
            <>
              <Scan className="w-5 h-5 animate-spin" />
              <span>{t.scanning}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>Run Multimodal Disease Diagnosis</span>
            </>
          )}
        </button>

      </div>

      {/* Diagnostic Scan Output */}
      {result && (
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-amber-500/30 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                {t.scanResults}
              </span>
              <h3 className="text-2xl font-black text-white">
                {result.diagnosis}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">
                {result.pathogen_type}
              </span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono text-emerald-400">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>{result.confidence}% Confidence</span>
              </div>
            </div>
          </div>

          {/* Symptoms Observed */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              Symptoms Observed:
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {result.symptoms_observed?.map((sym, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{sym}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Plan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Recommended Treatment Plan:
            </h4>
            <div className="space-y-2">
              {result.treatment_plan?.map((step, idx) => (
                <div key={idx} className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3.5 text-xs text-emerald-200 font-medium flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prevention Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Long-term Prevention & IPM Rules:
            </h4>
            <div className="space-y-2">
              {result.prevention_steps?.map((prev, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span>{prev}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
