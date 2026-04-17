"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessage("Preencha email e senha.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage(
        "Conta criada. Se o Supabase pedir confirmação por email, confirme antes de entrar."
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 24,
          color: "white",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Entrar no RPG Manager</h1>
        <p style={{ color: "#cbd5e1", marginTop: 0 }}>
          Faça login para gerenciar suas campanhas.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              background: mode === "login" ? "#2563eb" : "#334155",
              color: "white",
            }}
          >
            Login
          </button>

          <button
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              background: mode === "signup" ? "#2563eb" : "#334155",
              color: "white",
            }}
          >
            Criar conta
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid #475569",
              background: "#0f172a",
              color: "white",
            }}
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid #475569",
              background: "#0f172a",
              color: "white",
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: 14,
              borderRadius: 12,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 800,
              background: "#2563eb",
              color: "white",
            }}
          >
            {loading
              ? "Carregando..."
              : mode === "login"
              ? "Entrar"
              : "Criar conta"}
          </button>

          {message && (
            <p style={{ margin: 0, color: "#fde68a" }}>{message}</p>
          )}
        </div>
      </div>
    </main>
  );
}