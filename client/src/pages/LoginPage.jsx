import React from "react";
import AuthForm from "../components/AuthForm";

export default function LoginPage({ onAuthSuccess, lang = "en" }) {
  return (
    <div className="py-12 px-4 flex items-center justify-center min-h-[75vh]">
      <AuthForm initialMode="login" onAuthSuccess={onAuthSuccess} lang={lang} />
    </div>
  );
}
