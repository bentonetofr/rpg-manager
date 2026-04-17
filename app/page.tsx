"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import AuthButton from "./components/auth-button";

type Campaign = {
  id: string;
  name: string;
  owner_id: string | null;
  created_at?: string;
};

type UserInfo = {
  id: string;
  email?: string;
};

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadPage() {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Erro ao carregar usuário:", userError);
    }

    if (user) {
      setUser({
        id: user.id,
        email: user.email,
      });
    } else {
      setUser(null);
    }

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar campanhas:", error);
      setCampaigns([]);
      setLoading(false);
      return;
    }

    setCampaigns(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0%, #111827 45%, #1f2937 100%)",
        color: "#f9fafb",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <section
          style={{
            marginBottom: 32,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: 24,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "start",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 36,
                  margin: 0,
                  marginBottom: 8,
                  fontWeight: 800,
                }}
              >
                RPG Manager
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: 16,
                }}
              >
                Gerencie campanhas, personagens, fichas e recursos do seu sistema.
              </p>
            </div>

            <AuthButton isLoggedIn={!!user} email={user?.email} />
          </div>

          <div style={{ marginTop: 20 }}>
            <Link
              href="/campaigns/new"
              style={{
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: 12,
                background: "#2563eb",
                color: "white",
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              Nova campanha
            </Link>
          </div>
        </section>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              Campanhas
            </h2>

            <span
              style={{
                color: "#94a3b8",
                fontSize: 14,
              }}
            >
              {loading
                ? "Carregando..."
                : `${campaigns.length} campanha${campaigns.length === 1 ? "" : "s"}`}
            </span>
          </div>

          {loading ? (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px dashed rgba(255,255,255,0.15)",
                borderRadius: 18,
                padding: 24,
                color: "#cbd5e1",
              }}
            >
              Carregando campanhas...
            </div>
          ) : campaigns.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {campaigns.map((campaign) => {
                const isOwner = !!user && campaign.owner_id === user.id;

                return (
                  <div
                    key={campaign.id}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 18,
                      padding: 18,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 20,
                          fontWeight: 800,
                          marginBottom: 8,
                        }}
                      >
                        {campaign.name}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          color: "#94a3b8",
                          fontSize: 13,
                          wordBreak: "break-all",
                        }}
                      >
                        ID: {campaign.id}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <Link
                        href={`/campaign/${campaign.id}`}
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
                        Abrir campanha
                      </Link>

                      {isOwner && (
                        <form action={`/campaigns/${campaign.id}/delete`} method="post">
                          <button
                            type="submit"
                            style={{
                              padding: "10px 14px",
                              borderRadius: 10,
                              border: "1px solid #7f1d1d",
                              background: "#450a0a",
                              color: "#fecaca",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Excluir
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px dashed rgba(255,255,255,0.15)",
                borderRadius: 18,
                padding: 24,
                color: "#cbd5e1",
              }}
            >
              Nenhuma campanha criada ainda.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}