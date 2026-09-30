import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import AdvisoryView from "../components/AdvisoryView";
import { advisoryApi } from "../lib/api";

export default function AdvisoryDetailPage({ lang = "en" }) {
  const { id } = useParams();
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvisory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await advisoryApi.getById(id);
        setAdvisory(res.advisory);
      } catch (err) {
        console.error("Fetch advisory error:", err);
        setError("Failed to load advisory report.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisory();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="no-print">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {loading ? (
        <div className="glass-card rounded-3xl p-16 text-center border border-slate-800 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-xs text-slate-400">Retrieving advisory dataset...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <AdvisoryView advisory={advisory} field={advisory?.fields} lang={lang} />
      )}
    </div>
  );
}
