"use client";

import { useState } from "react";
import { createClient } from "../../../utils/supabase/client";

export default function NewCampaignPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Você precisa estar logado para criar uma campanha.");
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setMessage("Digite o nome da campanha.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("campaigns")
      .insert([
        {
          name: name.trim(),
          owner_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = `/campaign/${data.id}`;
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
          maxWidth: 500,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 24,
          color: "white",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Nova campanha</h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da campanha"
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #475569",
            background: "#0f172a",
            color: "white",
            marginBottom: 12,
          }}
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 800,
            background: "#2563eb",
            color: "white",
          }}
        >
          {loading ? "Criando..." : "Criar campanha"}
        </button>

        {message && (
          <p style={{ marginBottom: 0, marginTop: 12, color: "#fde68a" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}