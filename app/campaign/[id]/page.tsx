"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Campaign = {
  id: string;
  name: string;
};

type Character = {
  id: string;
  campaign_id: string;
  name: string;
  class: string;
  hp_current: number;
  hp_max: number;
  initiative_bonus: number;
};

type CharacterSheet = {
  id: string;
  character_id: string;
  raiz: string;
  genesis: string;
  pv_current: number;
  pv_max: number;
  pe_current: number;
  pe_max: number;
  pr_current: number;
  pr_max: number;
  furia: number;
  destino: number;
  espirito: number;
  impulso: number;
  estrategia: number;
  runico: number;
  pernas: string;
  bracos: string;
  tronco: string;
  cabeca: string;
  hacksivers: number;
  inventario: string;
  triunfos: string;
};

type Weapon = {
  id: string;
  character_id: string;
  name: string;
  damage: string;
  range: string;
  action: string;
};

type WeaponCatalogItem = {
  name: string;
  damage: string;
  range: string;
  action: string;
  category: string;
};

type CampaignPageProps = {
  params: Promise<{ id: string }>;
};

const domains = [
  { name: "Brutalidade", attribute: "Fúria" },
  { name: "Crime", attribute: "Estratégia" },
  { name: "Determinação", attribute: "Espírito" },
  { name: "Direção", attribute: "Impulso" },
  { name: "Esconder", attribute: "Estratégia" },
  { name: "Furtividade", attribute: "Impulso" },
  { name: "Iniciativa", attribute: "Impulso" },
  { name: "Intimidação", attribute: "Fúria" },
  { name: "Investigação", attribute: "Estratégia" },
  { name: "Leveza", attribute: "Impulso" },
  { name: "Luta", attribute: "Fúria" },
  { name: "Medicina", attribute: "Estratégia" },
  { name: "Percepção", attribute: "Destino" },
  { name: "Persuasão", attribute: "Destino" },
  { name: "Precisão", attribute: "Impulso" },
  { name: "Pressentimento", attribute: "Destino" },
  { name: "Reflexo", attribute: "Impulso" },
  { name: "Religião", attribute: "Destino" },
  { name: "Resiliência", attribute: "Espírito" },
  { name: "Runologia", attribute: "Rúnico" },
  { name: "Saberes", attribute: "Estratégia" },
  { name: "Sobrevivência", attribute: "Estratégia" },
  { name: "Tática", attribute: "Estratégia" },
  { name: "Vontade", attribute: "Espírito" },
];

const WEAPON_CATALOG: WeaponCatalogItem[] = [
  {
    name: "Machado de duas lâminas",
    damage: "2d8",
    action: "C",
    range: "Toque",
    category: "Armas pesadas",
  },
  {
    name: "Martelo de Impacto",
    damage: "2d10",
    action: "I",
    range: "Toque",
    category: "Armas pesadas",
  },
  {
    name: "Lança Pesada",
    damage: "2d10",
    action: "P",
    range: "Toque",
    category: "Armas pesadas",
  },
  {
    name: "Maça de ossos",
    damage: "2d12",
    action: "I",
    range: "Toque",
    category: "Armas pesadas",
  },
  {
    name: "Espada Extremamente Pesada",
    damage: "3d12",
    action: "C",
    range: "Toque",
    category: "Armas pesadas",
  },
  {
    name: "Tridente de batalha",
    damage: "2d12",
    action: "P",
    range: "Toque",
    category: "Armas pesadas",
  },
  {
    name: "Sabre",
    damage: "2d10",
    action: "C",
    range: "Toque",
    category: "Armas pesadas",
  },

  {
    name: "Adaga serrilhada",
    damage: "1d10",
    action: "C",
    range: "Toque",
    category: "Armas leves",
  },
  {
    name: "Espada curta reta",
    damage: "1d12",
    action: "C",
    range: "Toque",
    category: "Armas leves",
  },
  {
    name: "Adaga de Gancho",
    damage: "1d6",
    action: "C",
    range: "Toque",
    category: "Armas leves",
  },
  {
    name: "Clava espinhosa",
    damage: "1d10",
    action: "I",
    range: "Toque",
    category: "Armas leves",
  },
  {
    name: "Porrete de pedra",
    damage: "1d10",
    action: "I",
    range: "Toque",
    category: "Armas leves",
  },
  {
    name: "Lâminas Gêmeas",
    damage: "1d10",
    action: "C",
    range: "Toque",
    category: "Armas leves",
  },
  {
    name: "Espada de Punho Circular",
    damage: "1d12",
    action: "C",
    range: "Toque",
    category: "Armas leves",
  },

  {
    name: "Lança",
    damage: "1d12",
    action: "P",
    range: "Toque/Curto",
    category: "Armas de arremesso",
  },
  {
    name: "Adaga de arremesso",
    damage: "1d8",
    action: "P",
    range: "Toque/Curto",
    category: "Armas de arremesso",
  },
  {
    name: "Faca de Arremesso",
    damage: "1d10",
    action: "P",
    range: "Toque/Curto",
    category: "Armas de arremesso",
  },
  {
    name: "Machado de Arremesso",
    damage: "1d12",
    action: "P",
    range: "Toque/Curto",
    category: "Armas de arremesso",
  },
  {
    name: "Bola de Ferro com corrente",
    damage: "1d8",
    action: "I",
    range: "Toque/Curto",
    category: "Armas de arremesso",
  },
  {
    name: "Boomerangue afiado",
    damage: "1d8",
    action: "C",
    range: "Curto",
    category: "Armas de arremesso",
  },

  {
    name: "Arco Curto",
    damage: "1d10",
    action: "P",
    range: "Médio",
    category: "Armas de alcance",
  },
  {
    name: "Arco Longo",
    damage: "1d12",
    action: "P",
    range: "Longo",
    category: "Armas de alcance",
  },
  {
    name: "Besta Leve",
    damage: "1d10+2",
    action: "P",
    range: "Médio",
    category: "Armas de alcance",
  },
  {
    name: "Besta Pesada",
    damage: "1d12+2",
    action: "P",
    range: "Longo",
    category: "Armas de alcance",
  },
  {
    name: "Dardo Envenenado",
    damage: "1d6",
    action: "P",
    range: "Curto/Médio",
    category: "Armas de alcance",
  },
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function findWeaponByName(name: string) {
  const normalizedName = normalizeText(name);
  return WEAPON_CATALOG.find(
    (weapon) => normalizeText(weapon.name) === normalizedName
  );
}

function getDomainBaseValue(sheet: CharacterSheet | null, attribute: string) {
  if (!sheet) return 0;

  switch (attribute) {
    case "Fúria":
      return sheet.furia;
    case "Destino":
      return sheet.destino;
    case "Espírito":
      return sheet.espirito;
    case "Impulso":
      return sheet.impulso;
    case "Estratégia":
      return sheet.estrategia;
    case "Rúnico":
      return sheet.runico;
    default:
      return 0;
  }
}

export default function CampaignPage({ params }: CampaignPageProps) {
  const [campaignId, setCampaignId] = useState("");
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [sheet, setSheet] = useState<CharacterSheet | null>(null);
  const [weapons, setWeapons] = useState<Weapon[]>([]);

  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterClass, setNewCharacterClass] = useState("");

  const [newWeaponName, setNewWeaponName] = useState("");
  const [newWeaponDamage, setNewWeaponDamage] = useState("");
  const [newWeaponRange, setNewWeaponRange] = useState("");
  const [newWeaponAction, setNewWeaponAction] = useState("");

  const selectedCharacter = useMemo(
    () => characters.find((c) => c.id === selectedCharacterId) || null,
    [characters, selectedCharacterId]
  );

  async function loadCampaign(id: string) {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao carregar campanha:", error);
      return;
    }

    setCampaign(data);
  }

  async function loadCharacters(id: string) {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("campaign_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao carregar personagens:", error);
      return;
    }

    const loadedCharacters = data || [];
    setCharacters(loadedCharacters);

    if (!selectedCharacterId && loadedCharacters.length > 0) {
      setSelectedCharacterId(loadedCharacters[0].id);
    }
  }

  async function loadSheet(characterId: string) {
    const { data, error } = await supabase
      .from("character_sheets")
      .select("*")
      .eq("character_id", characterId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao carregar ficha:", error);
      return;
    }

    if (data) {
      setSheet(data);
      return;
    }

    const { data: createdSheet, error: createError } = await supabase
      .from("character_sheets")
      .insert([{ character_id: characterId }])
      .select()
      .single();

    if (createError) {
      console.error("Erro ao criar ficha:", createError);
      return;
    }

    setSheet(createdSheet);
  }

  async function loadWeapons(characterId: string) {
    const { data, error } = await supabase
      .from("character_weapons")
      .select("*")
      .eq("character_id", characterId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao carregar armas:", error);
      return;
    }

    setWeapons(data || []);
  }

  async function createCharacter() {
    if (!campaignId) return;
    if (!newCharacterName.trim() || !newCharacterClass.trim()) return;

    const { data, error } = await supabase
      .from("characters")
      .insert([
        {
          campaign_id: campaignId,
          name: newCharacterName,
          class: newCharacterClass,
          hp_current: 10,
          hp_max: 10,
          initiative_bonus: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar personagem:", error);
      return;
    }

    const { error: sheetError } = await supabase
      .from("character_sheets")
      .insert([{ character_id: data.id }]);

    if (sheetError) {
      console.error("Erro ao criar ficha inicial:", sheetError);
    }

    setNewCharacterName("");
    setNewCharacterClass("");

    await loadCharacters(campaignId);
    setSelectedCharacterId(data.id);
  }

  async function updateCharacterField(
    field: keyof Character,
    value: string | number
  ) {
    if (!selectedCharacterId) return;

    const { error } = await supabase
      .from("characters")
      .update({ [field]: value })
      .eq("id", selectedCharacterId);

    if (error) {
      console.error("Erro ao atualizar personagem:", error);
      return;
    }

    await loadCharacters(campaignId);
  }

  async function updateSheetField(
    field: keyof CharacterSheet,
    value: string | number
  ) {
    if (!sheet) return;

    const { data, error } = await supabase
      .from("character_sheets")
      .update({ [field]: value })
      .eq("id", sheet.id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar ficha:", error);
      return;
    }

    setSheet(data);
  }

  function autofillWeaponFields(weaponName: string) {
    const matchedWeapon = findWeaponByName(weaponName);

    if (!matchedWeapon) return;

    setNewWeaponDamage(matchedWeapon.damage);
    setNewWeaponRange(matchedWeapon.range);
    setNewWeaponAction(matchedWeapon.action);
  }

  function handleWeaponNameChange(value: string) {
    setNewWeaponName(value);
    autofillWeaponFields(value);
  }

  async function createWeapon() {
    if (!selectedCharacterId) return;
    if (!newWeaponName.trim()) return;

    const { error } = await supabase.from("character_weapons").insert([
      {
        character_id: selectedCharacterId,
        name: newWeaponName,
        damage: newWeaponDamage,
        range: newWeaponRange,
        action: newWeaponAction,
      },
    ]);

    if (error) {
      console.error("Erro ao criar arma:", error);
      return;
    }

    setNewWeaponName("");
    setNewWeaponDamage("");
    setNewWeaponRange("");
    setNewWeaponAction("");

    loadWeapons(selectedCharacterId);
  }

  async function deleteWeapon(weaponId: string) {
    const { error } = await supabase
      .from("character_weapons")
      .delete()
      .eq("id", weaponId);

    if (error) {
      console.error("Erro ao excluir arma:", error);
      return;
    }

    if (selectedCharacterId) {
      loadWeapons(selectedCharacterId);
    }
  }

  useEffect(() => {
    async function init() {
      const resolvedParams = await params;
      setCampaignId(resolvedParams.id);
      await loadCampaign(resolvedParams.id);
      await loadCharacters(resolvedParams.id);
    }

    init();
  }, [params]);

  useEffect(() => {
    if (!selectedCharacterId) {
      setSheet(null);
      setWeapons([]);
      return;
    }

    loadSheet(selectedCharacterId);
    loadWeapons(selectedCharacterId);
  }, [selectedCharacterId]);

  const initiativeCalculated =
    (sheet?.impulso || 0) + (selectedCharacter?.initiative_bonus || 0);

  return (
    <main
      style={{
        padding: 24,
        backgroundColor: "#111827",
        minHeight: "100vh",
        color: "#f9fafb",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>
        {campaign ? campaign.name : "Campanha"}
      </h1>

      <p style={{ marginBottom: 24 }}>
        Interface da campanha com ficha completa do personagem.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <aside
          style={{
            background: "#1f2937",
            padding: 16,
            borderRadius: 12,
            border: "1px solid #374151",
          }}
        >
          <h2 style={{ marginBottom: 12 }}>Personagens</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <input
              value={newCharacterName}
              onChange={(e) => setNewCharacterName(e.target.value)}
              placeholder="Nome do personagem"
              style={{ padding: 10, borderRadius: 8, border: "1px solid #4b5563" }}
            />

            <input
              value={newCharacterClass}
              onChange={(e) => setNewCharacterClass(e.target.value)}
              placeholder="Classe"
              style={{ padding: 10, borderRadius: 8, border: "1px solid #4b5563" }}
            />

            <button
              onClick={createCharacter}
              style={{
                padding: 10,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Criar personagem
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {characters.length > 0 ? (
              characters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacterId(character.id)}
                  style={{
                    textAlign: "left",
                    padding: 12,
                    borderRadius: 10,
                    border:
                      selectedCharacterId === character.id
                        ? "2px solid #93c5fd"
                        : "1px solid #4b5563",
                    background:
                      selectedCharacterId === character.id
                        ? "#374151"
                        : "#111827",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <strong>{character.name}</strong>
                  <br />
                  <span>{character.class}</span>
                </button>
              ))
            ) : (
              <p>Nenhum personagem criado ainda.</p>
            )}
          </div>
        </aside>

        <section
          style={{
            background: "#f3f4f6",
            color: "#111827",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #d1d5db",
          }}
        >
          {selectedCharacter && sheet ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div>
                  <label>Nome</label>
                  <input
                    value={selectedCharacter.name}
                    onChange={(e) => updateCharacterField("name", e.target.value)}
                    style={{ width: "100%", padding: 10, marginTop: 4 }}
                  />
                </div>

                <div>
                  <label>Classe</label>
                  <input
                    value={selectedCharacter.class}
                    onChange={(e) => updateCharacterField("class", e.target.value)}
                    style={{ width: "100%", padding: 10, marginTop: 4 }}
                  />
                </div>

                <div>
                  <label>Raiz</label>
                  <input
                    value={sheet.raiz}
                    onChange={(e) => updateSheetField("raiz", e.target.value)}
                    style={{ width: "100%", padding: 10, marginTop: 4 }}
                  />
                </div>

                <div>
                  <label>Gênesis</label>
                  <input
                    value={sheet.genesis}
                    onChange={(e) => updateSheetField("genesis", e.target.value)}
                    style={{ width: "100%", padding: 10, marginTop: 4 }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div style={{ background: "#e5e7eb", padding: 12, borderRadius: 10 }}>
                  <strong>PV</strong>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      type="number"
                      value={sheet.pv_current}
                      onChange={(e) =>
                        updateSheetField("pv_current", Number(e.target.value))
                      }
                      style={{ width: "50%", padding: 8 }}
                    />
                    <input
                      type="number"
                      value={sheet.pv_max}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        updateSheetField("pv_max", value);
                        updateCharacterField("hp_max", value);
                      }}
                      style={{ width: "50%", padding: 8 }}
                    />
                  </div>
                </div>

                <div style={{ background: "#e5e7eb", padding: 12, borderRadius: 10 }}>
                  <strong>PE</strong>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      type="number"
                      value={sheet.pe_current}
                      onChange={(e) =>
                        updateSheetField("pe_current", Number(e.target.value))
                      }
                      style={{ width: "50%", padding: 8 }}
                    />
                    <input
                      type="number"
                      value={sheet.pe_max}
                      onChange={(e) =>
                        updateSheetField("pe_max", Number(e.target.value))
                      }
                      style={{ width: "50%", padding: 8 }}
                    />
                  </div>
                </div>

                <div style={{ background: "#e5e7eb", padding: 12, borderRadius: 10 }}>
                  <strong>PR-FV</strong>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      type="number"
                      value={sheet.pr_current}
                      onChange={(e) =>
                        updateSheetField("pr_current", Number(e.target.value))
                      }
                      style={{ width: "50%", padding: 8 }}
                    />
                    <input
                      type="number"
                      value={sheet.pr_max}
                      onChange={(e) =>
                        updateSheetField("pr_max", Number(e.target.value))
                      }
                      style={{ width: "50%", padding: 8 }}
                    />
                  </div>
                </div>
              </div>

              <h2 style={{ marginBottom: 12 }}>Atributos</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {[
                  { label: "Fúria", field: "furia" },
                  { label: "Destino", field: "destino" },
                  { label: "Espírito", field: "espirito" },
                  { label: "Impulso", field: "impulso" },
                  { label: "Estratégia", field: "estrategia" },
                  { label: "Rúnico", field: "runico" },
                ].map((item) => (
                  <div
                    key={item.field}
                    style={{
                      background: "#dbeafe",
                      padding: 12,
                      borderRadius: 10,
                      textAlign: "center",
                    }}
                  >
                    <strong>{item.label}</strong>
                    <input
                      type="number"
                      value={sheet[item.field as keyof CharacterSheet] as number}
                      onChange={(e) =>
                        updateSheetField(
                          item.field as keyof CharacterSheet,
                          Number(e.target.value)
                        )
                      }
                      style={{
                        width: "100%",
                        padding: 8,
                        marginTop: 8,
                        textAlign: "center",
                      }}
                    />
                  </div>
                ))}
              </div>

              <h2 style={{ marginBottom: 12 }}>Cálculos automáticos</h2>

              <div
                style={{
                  background: "#ecfeff",
                  padding: 16,
                  borderRadius: 10,
                  marginBottom: 24,
                }}
              >
                <p>
                  <strong>Iniciativa calculada:</strong> Impulso ({sheet.impulso})
                  {" + "}
                  bônus manual ({selectedCharacter.initiative_bonus}) ={" "}
                  <strong>{initiativeCalculated}</strong>
                </p>
              </div>

              <h2 style={{ marginBottom: 12 }}>Partes do corpo</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div>
                  <label>Pernas (1-3)</label>
                  <textarea
                    value={sheet.pernas}
                    onChange={(e) => updateSheetField("pernas", e.target.value)}
                    style={{ width: "100%", minHeight: 80, marginTop: 4, padding: 8 }}
                  />
                </div>

                <div>
                  <label>Braços (4-6)</label>
                  <textarea
                    value={sheet.bracos}
                    onChange={(e) => updateSheetField("bracos", e.target.value)}
                    style={{ width: "100%", minHeight: 80, marginTop: 4, padding: 8 }}
                  />
                </div>

                <div>
                  <label>Tronco (7-9)</label>
                  <textarea
                    value={sheet.tronco}
                    onChange={(e) => updateSheetField("tronco", e.target.value)}
                    style={{ width: "100%", minHeight: 80, marginTop: 4, padding: 8 }}
                  />
                </div>

                <div>
                  <label>Cabeça (10)</label>
                  <textarea
                    value={sheet.cabeca}
                    onChange={(e) => updateSheetField("cabeca", e.target.value)}
                    style={{ width: "100%", minHeight: 80, marginTop: 4, padding: 8 }}
                  />
                </div>
              </div>

              <h2 style={{ marginBottom: 12 }}>Armas</h2>

              <div
                style={{
                  background: "#e5e7eb",
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 16,
                }}
              >
                <label style={{ display: "block", marginBottom: 6 }}>
                  Nome da arma
                </label>
                <input
                  list="weapon-catalog"
                  value={newWeaponName}
                  onChange={(e) => handleWeaponNameChange(e.target.value)}
                  placeholder="Digite ou escolha uma arma do sistema"
                  style={{ width: "100%", padding: 10, marginBottom: 10 }}
                />

                <datalist id="weapon-catalog">
                  {WEAPON_CATALOG.map((weapon) => (
                    <option key={weapon.name} value={weapon.name}>
                      {weapon.category}
                    </option>
                  ))}
                </datalist>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: 8,
                  }}
                >
                  <input
                    value={newWeaponDamage}
                    onChange={(e) => setNewWeaponDamage(e.target.value)}
                    placeholder="Dano"
                    style={{ padding: 10 }}
                  />
                  <input
                    value={newWeaponRange}
                    onChange={(e) => setNewWeaponRange(e.target.value)}
                    placeholder="Alcance"
                    style={{ padding: 10 }}
                  />
                  <input
                    value={newWeaponAction}
                    onChange={(e) => setNewWeaponAction(e.target.value)}
                    placeholder="Ação"
                    style={{ padding: 10 }}
                  />
                  <button onClick={createWeapon} style={{ padding: "10px 14px" }}>
                    Adicionar
                  </button>
                </div>
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: 24,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #9ca3af", padding: 8, textAlign: "left" }}>
                      Nome
                    </th>
                    <th style={{ border: "1px solid #9ca3af", padding: 8, textAlign: "left" }}>
                      Dano
                    </th>
                    <th style={{ border: "1px solid #9ca3af", padding: 8, textAlign: "left" }}>
                      Alcance
                    </th>
                    <th style={{ border: "1px solid #9ca3af", padding: 8, textAlign: "left" }}>
                      Ação
                    </th>
                    <th style={{ border: "1px solid #9ca3af", padding: 8, textAlign: "left" }}>
                      Remover
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weapons.length > 0 ? (
                    weapons.map((weapon) => (
                      <tr key={weapon.id}>
                        <td style={{ border: "1px solid #9ca3af", padding: 8 }}>
                          {weapon.name}
                        </td>
                        <td style={{ border: "1px solid #9ca3af", padding: 8 }}>
                          {weapon.damage}
                        </td>
                        <td style={{ border: "1px solid #9ca3af", padding: 8 }}>
                          {weapon.range}
                        </td>
                        <td style={{ border: "1px solid #9ca3af", padding: 8 }}>
                          {weapon.action}
                        </td>
                        <td style={{ border: "1px solid #9ca3af", padding: 8 }}>
                          <button onClick={() => deleteWeapon(weapon.id)}>
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ border: "1px solid #9ca3af", padding: 8 }}
                      >
                        Nenhuma arma cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h2 style={{ marginBottom: 12 }}>Domínios</h2>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: 24,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #9ca3af", padding: 8, textAlign: "left" }}>
                      Domínio
                    </th>
                    <th style={{ border: "1px solid #9ca3af", padding: 8, textAlign: "left" }}>
                      Atributo
                    </th>
                    <th style={{ border: "1px solid #9ca3af", padding: 8, textAlign: "left" }}>
                      Valor base
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map((domain) => (
                    <tr key={domain.name}>
                      <td style={{ border: "1px solid #9ca3af", padding: 8 }}>
                        {domain.name}
                      </td>
                      <td style={{ border: "1px solid #9ca3af", padding: 8 }}>
                        {domain.attribute}
                      </td>
                      <td style={{ border: "1px solid #9ca3af", padding: 8 }}>
                        {getDomainBaseValue(sheet, domain.attribute)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 style={{ marginBottom: 12 }}>Inventário e recursos</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div>
                  <label>Inventário</label>
                  <textarea
                    value={sheet.inventario}
                    onChange={(e) => updateSheetField("inventario", e.target.value)}
                    style={{ width: "100%", minHeight: 160, marginTop: 4, padding: 10 }}
                  />
                </div>

                <div>
                  <label>Hacksivers</label>
                  <input
                    type="number"
                    value={sheet.hacksivers}
                    onChange={(e) =>
                      updateSheetField("hacksivers", Number(e.target.value))
                    }
                    style={{ width: "100%", padding: 10, marginTop: 4 }}
                  />
                </div>
              </div>

              <h2 style={{ marginBottom: 12 }}>Triunfos</h2>
              <textarea
                value={sheet.triunfos}
                onChange={(e) => updateSheetField("triunfos", e.target.value)}
                style={{ width: "100%", minHeight: 180, padding: 10 }}
              />
            </>
          ) : (
            <p>Selecione ou crie um personagem para abrir a ficha.</p>
          )}
        </section>
      </div>
    </main>
  );
}