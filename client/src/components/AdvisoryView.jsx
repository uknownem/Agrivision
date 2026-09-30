import React, { useRef } from "react";
import { 
  Sparkles, 
  Download, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  Droplets, 
  Bug, 
  FlaskConical, 
  Layers, 
  ShieldAlert, 
  Calendar,
  Share2,
  FileText
} from "lucide-react";
import { translations } from "../lib/i18n";
import html2pdf from "html2pdf.js";

export default function AdvisoryView({ advisory, field, lang = "en" }) {
  const contentRef = useRef(null);
  const t = translations[lang] || translations.en;

  if (!advisory) return null;

  const {
    id,
    summary,
    recommendations = {},
    risk_factors = [],
    created_at,
    fields: advisoryField
  } = advisory;

  const activeField = field || advisoryField || {};

  const fertilizerPlan = recommendations.fertilizer_plan || [];
  const irrigationSchedule = recommendations.irrigation_schedule || "";
  const pestWarnings = recommendations.pest_warnings || [];
  const soilHealthNotes = recommendations.soil_health_notes || "";

  const handleExportPDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: `AgriAdvisor_Report_${activeField.field_name || "Field"}_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 no-print">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-semibold">
            Advisory Report #{id?.slice(0, 8)} • Generated {new Date(created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{t.downloadPDF}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Card */}
      <div ref={contentRef} className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 space-y-8 bg-slate-950 text-slate-100">
        
        {/* Header Header */}
        <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                AgriVision AI Agronomic Advisory
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Scientific Multi-Factor Soil & Crop Diagnostic Plan
            </p>
          </div>

          {activeField.field_name && (
            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-right">
              <span className="text-xs text-slate-400 font-medium block">Target Field</span>
              <span className="text-sm font-bold text-emerald-400">{activeField.field_name}</span>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {activeField.crop_type || "Crop"} • {activeField.region}
              </div>
            </div>
          )}
        </div>

        {/* Executive Summary */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Executive Advisory Summary
          </h3>
          <p className="text-sm leading-relaxed text-slate-200 font-medium">
            {summary}
          </p>
        </div>

        {/* Soil Metrics Overview */}
        {activeField.ph_level && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">{t.phLevel}</span>
              <span className="text-lg font-mono font-bold text-amber-400">{activeField.ph_level}</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">{t.nitrogen}</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{activeField.nitrogen_ppm} ppm</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">{t.phosphorus}</span>
              <span className="text-lg font-mono font-bold text-cyan-400">{activeField.phosphorus_ppm} ppm</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">{t.potassium}</span>
              <span className="text-lg font-mono font-bold text-purple-400">{activeField.potassium_ppm} ppm</span>
            </div>
          </div>
        )}

        {/* Fertilizer Schedule */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg text-slate-100">{t.fertilizerPlan}</h3>
          </div>

          <div className="grid gap-3">
            {fertilizerPlan.map((step, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Irrigation & Water Schedule */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-slate-100">{t.irrigationSchedule}</h3>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {irrigationSchedule}
            </p>
          </div>
        </div>

        {/* Pest & Disease Warnings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Bug className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-slate-100">{t.pestWarnings}</h3>
          </div>

          <div className="grid gap-3">
            {pestWarnings.map((warning, idx) => (
              <div key={idx} className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3.5 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200/90 font-medium">
                  {warning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment Matrix */}
        {risk_factors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-lg text-slate-100">{t.riskFactors}</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {risk_factors.map((rf, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{rf.issue}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      rf.severity === "High" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" :
                      rf.severity === "Medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                      "bg-slate-800 text-slate-400"
                    }`}>
                      {rf.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-semibold text-emerald-400">Action: </span>
                    {rf.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Soil Organic Health Notes */}
        {soilHealthNotes && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
            <Layers className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t.soilHealth}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{soilHealthNotes}</p>
            </div>
          </div>
        )}

        {/* Footer Metadata */}
        <div className="pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          Report generated by AgriVision AI Engine • Validated against standard agronomist frameworks • Page 1 of 1
        </div>

      </div>
    </div>
  );
}
