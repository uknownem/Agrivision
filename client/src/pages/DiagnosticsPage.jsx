import React from "react";
import DiseaseScanner from "../components/DiseaseScanner";

export default function DiagnosticsPage({ lang = "en" }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <DiseaseScanner lang={lang} />
    </div>
  );
}
