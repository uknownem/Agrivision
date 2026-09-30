import React from "react";
import AuthForm from "../components/AuthForm";

export default function RegisterPage({ onAuthSuccess, lang = "en" }) {
  return (
    <div className="py-12 px-4 flex items-center justify-center min-h-[75vh]">
      <AuthForm initialMode="register" onAuthSuccess={onAuthSuccess} lang={lang} />
    </div>
  );
}
