"use client";

import { createClient } from "../../utils/supabase/client";

export default function AuthButton({
  isLoggedIn,
  email,
}: {
  isLoggedIn: boolean;
  email?: string;
}) {
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (!isLoggedIn) {
    return (
      <a
        href="/login"
        style={{
          textDecoration: "none",
          padding: "10px 14px",
          borderRadius: 10,
          background: "#2563eb",
          color: "white",
          fontWeight: 700,
          display: "inline-block",
        }}
      >
        Entrar
      </a>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ color: "#cbd5e1", fontSize: 14 }}>
        {email || "Usuário logado"}
      </span>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #475569",
          background: "#1e293b",
          color: "white",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Sair
      </button>
    </div>
  );
}