import { useState, useRef, useCallback, useEffect } from "react";

// ── Helpers ──────────────────────────────────────────
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function extractBlocks(html) {
  const blocks = [];
  // 1) exercise-enunciat
  const enunciatRe = /(<div\s+class="exercise-enunciat">)([\s\S]*?)(<\/div>)/g;
  let m;
  while ((m = enunciatRe.exec(html)) !== null) {
    blocks.push({
      id: `enunciat-${blocks.length}`,
      type: "Enunciat",
      prefix: m[1],
      original: m[2],
      suffix: m[3],
      start: m.index,
      fullMatch: m[0],
    });
  }
  // 2) consell-box
  const consellRe = /(<div\s+class="consell-box">)([\s\S]*?)(<\/div>)/g;
  while ((m = consellRe.exec(html)) !== null) {
    // extract title from <strong>
    const titleM = m[2].match(/<strong>(.*?)<\/strong>/);
    const title = titleM ? titleM[1].replace(/💡\s*/, "").trim() : "Consell";
    blocks.push({
      id: `consell-${blocks.length}`,
      type: `Consell: ${title}`,
      prefix: m[1],
      original: m[2],
      suffix: m[3],
      start: m.index,
      fullMatch: m[0],
    });
  }
  // 3) data-code
  const codeRe = /(data-code=")([\s\S]*?)("[\s>])/g;
  while ((m = codeRe.exec(html)) !== null) {
    blocks.push({
      id: `code-${blocks.length}`,
      type: "Codi inicial",
      prefix: m[1],
      original: m[2],
      suffix: m[3],
      start: m.index,
      fullMatch: m[0],
      isCode: true,
    });
  }
  // Sort by position in file
  blocks.sort((a, b) => a.start - b.start);
  return blocks;
}

function applyChanges(html, blocks, edits) {
  let result = html;
  // Process in reverse order to preserve positions
  const sorted = [...blocks].sort((a, b) => b.start - a.start);
  for (const block of sorted) {
    const edit = edits[block.id];
    if (!edit || edit.action === "keep") continue;
    if (edit.action === "delete") {
      result = result.replace(block.fullMatch, "");
    } else if (edit.action === "edit") {
      const newFull = block.prefix + edit.content + block.suffix;
      result = result.replace(block.fullMatch, newFull);
    }
  }
  return result;
}

// ── Inline styles ────────────────────────────────────
const palette = {
  bg: "#FAF9F6",
  surface: "#FFFFFF",
  border: "#E2DFD8",
  borderFocus: "#6B8F71",
  text: "#2D2A24",
  textMuted: "#8A857A",
  accent: "#6B8F71",
  accentHover: "#5A7D60",
  danger: "#C45D4E",
  dangerBg: "#FDF0EE",
  keepBg: "#F0F7F1",
  editBg: "#FFF9EC",
  aiPurple: "#7C6FA0",
  aiPurpleHover: "#6B5E8F",
  codeBg: "#F5F3EF",
};

const font = {
  sans: "'DM Sans', 'Helvetica Neue', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
};

// ── Components ───────────────────────────────────────

function Badge({ children, color, bg }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "0.2rem 0.55rem",
        borderRadius: "4px",
        color: color,
        background: bg,
        fontFamily: font.mono,
      }}
    >
      {children}
    </span>
  );
}

function ActionButton({ children, active, onClick, color, bg, hoverBg, disabled, title }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0.4rem 0.9rem",
        border: active ? `2px solid ${color}` : "2px solid transparent",
        borderRadius: "6px",
        background: active ? bg : hovered ? "#F5F4F0" : "transparent",
        color: active ? color : palette.textMuted,
        fontWeight: active ? 700 : 500,
        fontSize: "0.82rem",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: font.sans,
        transition: "all 0.15s ease",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function BlockEditor({ block, edit, onChange, onAiSuggest, aiLoading }) {
  const action = edit?.action || "keep";
  const content = edit?.content ?? block.original;

  const setAction = (a) => {
    onChange({ ...edit, action: a, content: a === "keep" ? block.original : content });
  };

  const borderColor =
    action === "delete" ? palette.danger : action === "edit" ? "#D4A843" : palette.accent;

  return (
    <div
      style={{
        border: `1.5px solid ${borderColor}`,
        borderRadius: "10px",
        background: palette.surface,
        marginBottom: "1.1rem",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.7rem 1rem",
          borderBottom: `1px solid ${palette.border}`,
          background: "#FDFCFA",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <Badge
          color={
            block.type.startsWith("Consell")
              ? "#0369A1"
              : block.isCode
              ? "#7C2D12"
              : "#065F46"
          }
          bg={
            block.type.startsWith("Consell")
              ? "#E0F2FE"
              : block.isCode
              ? "#FFF7ED"
              : "#D1FAE5"
          }
        >
          {block.type}
        </Badge>

        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          <ActionButton
            active={action === "keep"}
            onClick={() => setAction("keep")}
            color={palette.accent}
            bg={palette.keepBg}
          >
            ✓ Mantenir
          </ActionButton>
          <ActionButton
            active={action === "edit"}
            onClick={() => setAction("edit")}
            color="#B8860B"
            bg={palette.editBg}
          >
            ✎ Editar
          </ActionButton>
          <ActionButton
            active={action === "delete"}
            onClick={() => setAction("delete")}
            color={palette.danger}
            bg={palette.dangerBg}
          >
            ✕ Eliminar
          </ActionButton>
          <ActionButton
            onClick={onAiSuggest}
            disabled={aiLoading}
            color={palette.aiPurple}
            bg="#F3F0FA"
            title="Demana a la IA una reescriptura"
          >
            {aiLoading ? "⏳ …" : "✦ IA"}
          </ActionButton>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: 0, minHeight: "100px" }}>
        {/* Original */}
        <div
          style={{
            flex: 1,
            padding: "0.9rem 1rem",
            borderRight: `1px solid ${palette.border}`,
            background: "#FDFCFA",
            fontSize: "0.85rem",
            lineHeight: 1.65,
            color: palette.textMuted,
            fontFamily: block.isCode ? font.mono : font.sans,
            whiteSpace: block.isCode ? "pre-wrap" : "normal",
            overflow: "auto",
            maxHeight: "320px",
            opacity: action === "delete" ? 0.35 : 0.7,
            textDecoration: action === "delete" ? "line-through" : "none",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: palette.textMuted,
              marginBottom: "0.5rem",
              fontFamily: font.mono,
              fontWeight: 700,
            }}
          >
            Original
          </div>
          {block.isCode ? (
            <pre style={{ margin: 0, fontFamily: font.mono, fontSize: "0.82rem" }}>
              {block.original}
            </pre>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: block.original }} />
          )}
        </div>

        {/* Modified */}
        <div
          style={{
            flex: 1,
            padding: "0.9rem 1rem",
            display: "flex",
            flexDirection: "column",
            background: action === "delete" ? palette.dangerBg : "#fff",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: action === "delete" ? palette.danger : "#B8860B",
              marginBottom: "0.5rem",
              fontFamily: font.mono,
              fontWeight: 700,
            }}
          >
            {action === "keep"
              ? "Sense canvis"
              : action === "delete"
              ? "S'eliminarà"
              : "Versió modificada"}
          </div>
          {action === "delete" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                color: palette.danger,
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              Aquest bloc serà eliminat del fitxer
            </div>
          ) : (
            <textarea
              value={content}
              readOnly={action === "keep"}
              onChange={(e) =>
                onChange({ ...edit, action: "edit", content: e.target.value })
              }
              onFocus={() => {
                if (action === "keep") setAction("edit");
              }}
              style={{
                flex: 1,
                minHeight: "90px",
                border: `1px solid ${action === "keep" ? "transparent" : palette.borderFocus}`,
                borderRadius: "6px",
                padding: "0.7rem",
                fontFamily: block.isCode ? font.mono : font.sans,
                fontSize: "0.85rem",
                lineHeight: 1.65,
                color: palette.text,
                background: action === "keep" ? "#FAFAF8" : "#FFFEF9",
                resize: "vertical",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────
export default function RepteEditor() {
  const [fileName, setFileName] = useState(null);
  const [rawHtml, setRawHtml] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [edits, setEdits] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);
  const fileRef = useRef();

  const handleFile = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const html = ev.target.result;
      setRawHtml(html);
      const b = extractBlocks(html);
      setBlocks(b);
      const initialEdits = {};
      b.forEach((bl) => {
        initialEdits[bl.id] = { action: "keep", content: bl.original };
      });
      setEdits(initialEdits);
      setStatusMsg(null);
    };
    reader.readAsText(file);
  }, []);

  const updateEdit = useCallback((id, edit) => {
    setEdits((prev) => ({ ...prev, [id]: edit }));
  }, []);

  const handleAiSuggest = useCallback(
    async (block) => {
      setAiLoading((prev) => ({ ...prev, [block.id]: true }));
      try {
        const currentContent = edits[block.id]?.content || block.original;
        const systemPrompt = `Ets un editor de textos educatius en català per a un curs de programació amb Karel (un robot).
Reescriu el text que et donaran fent-lo més natural, clar i directe. Mantingues el to informal i motivador.
IMPORTANT:
- Retorna NOMÉS el text HTML resultant, sense explicacions ni markdown.
- Mantingues les etiquetes HTML existents (<strong>, <br>, <code>, <em>, etc.).
- No afegeixis etiquetes noves que no hi siguin.
- Mantingues la mateixa estructura i informació, només millora la redacció.
- Escriu en català natural, evitant frases que sonin a traducció automàtica.`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: systemPrompt,
            messages: [
              {
                role: "user",
                content: `Reescriu aquest bloc de tipus "${block.type}":\n\n${currentContent}`,
              },
            ],
          }),
        });
        const data = await response.json();
        const text = data.content
          ?.filter((c) => c.type === "text")
          .map((c) => c.text)
          .join("\n");
        if (text) {
          setEdits((prev) => ({
            ...prev,
            [block.id]: { action: "edit", content: text },
          }));
        }
      } catch (err) {
        console.error("AI error:", err);
        setStatusMsg("Error al connectar amb la IA. Torna-ho a provar.");
      } finally {
        setAiLoading((prev) => ({ ...prev, [block.id]: false }));
      }
    },
    [edits]
  );

  const handleDownload = useCallback(() => {
    if (!rawHtml) return;
    const modified = applyChanges(rawHtml, blocks, edits);
    const blob = new Blob([modified], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "repte-modificat.html";
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg("✓ Fitxer descarregat!");
  }, [rawHtml, blocks, edits, fileName]);

  const handleSetAllKeep = () => {
    setEdits((prev) => {
      const next = { ...prev };
      for (const b of blocks) next[b.id] = { action: "keep", content: b.original };
      return next;
    });
  };

  const changesCount = Object.values(edits).filter((e) => e.action !== "keep").length;

  // ── Render ─────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        fontFamily: font.sans,
        color: palette.text,
        padding: "0",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header
        style={{
          background: palette.surface,
          borderBottom: `1.5px solid ${palette.border}`,
          padding: "1.2rem 1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.8rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ fontSize: "1.4rem" }}>📝</span>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.15rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Editor de Reptes
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                color: palette.textMuted,
                fontFamily: font.mono,
              }}
            >
              Karelcat — Modifica els textos dels reptes
            </p>
          </div>
        </div>

        {rawHtml && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: font.mono,
                fontSize: "0.78rem",
                color: palette.textMuted,
                background: "#F5F4F0",
                padding: "0.25rem 0.6rem",
                borderRadius: "5px",
              }}
            >
              {fileName} · {blocks.length} blocs · {changesCount} canvis
            </span>
            <button
              onClick={handleSetAllKeep}
              style={{
                padding: "0.45rem 0.9rem",
                border: `1.5px solid ${palette.border}`,
                borderRadius: "6px",
                background: "transparent",
                color: palette.textMuted,
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: font.sans,
                fontWeight: 500,
              }}
            >
              ↺ Reiniciar tot
            </button>
            <button
              onClick={handleDownload}
              disabled={changesCount === 0}
              style={{
                padding: "0.5rem 1.2rem",
                border: "none",
                borderRadius: "6px",
                background: changesCount > 0 ? palette.accent : palette.border,
                color: changesCount > 0 ? "#fff" : palette.textMuted,
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: changesCount > 0 ? "pointer" : "not-allowed",
                fontFamily: font.sans,
                transition: "background 0.15s",
              }}
            >
              ⬇ Descarregar ({changesCount})
            </button>
          </div>
        )}
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.5rem 1.2rem" }}>
        {/* Upload area */}
        {!rawHtml && (
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${palette.border}`,
              borderRadius: "14px",
              padding: "3.5rem 2rem",
              textAlign: "center",
              cursor: "pointer",
              background: palette.surface,
              transition: "border-color 0.2s",
              marginTop: "2rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = palette.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = palette.border)}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".html"
              onChange={handleFile}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>📂</div>
            <p style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.3rem" }}>
              Carrega un fitxer repte-x.html
            </p>
            <p style={{ fontSize: "0.85rem", color: palette.textMuted }}>
              Arrossega o clica per seleccionar el fitxer
            </p>
          </div>
        )}

        {/* Status */}
        {statusMsg && (
          <div
            style={{
              padding: "0.7rem 1rem",
              borderRadius: "8px",
              background: statusMsg.startsWith("✓") ? palette.keepBg : palette.dangerBg,
              color: statusMsg.startsWith("✓") ? palette.accent : palette.danger,
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {statusMsg}
          </div>
        )}

        {/* Info banner */}
        {rawHtml && blocks.length > 0 && (
          <div
            style={{
              background: "#F0F7F1",
              border: `1px solid #C6E0C9`,
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginBottom: "1.2rem",
              fontSize: "0.83rem",
              color: "#2D5A3A",
              lineHeight: 1.6,
            }}
          >
            Per cada bloc, tria una acció: <strong>Mantenir</strong> (no toca res),{" "}
            <strong>Editar</strong> (modifica el text a la dreta) o{" "}
            <strong>Eliminar</strong> (borra el bloc del fitxer). El botó{" "}
            <strong>✦ IA</strong> demana una reescriptura automàtica en català natural.
          </div>
        )}

        {/* Block editors */}
        {blocks.map((block) => (
          <BlockEditor
            key={block.id}
            block={block}
            edit={edits[block.id]}
            onChange={(edit) => updateEdit(block.id, edit)}
            onAiSuggest={() => handleAiSuggest(block)}
            aiLoading={!!aiLoading[block.id]}
          />
        ))}

        {/* Load another */}
        {rawHtml && (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <button
              onClick={() => {
                setRawHtml(null);
                setBlocks([]);
                setEdits({});
                setFileName(null);
                setStatusMsg(null);
              }}
              style={{
                padding: "0.5rem 1.2rem",
                border: `1.5px solid ${palette.border}`,
                borderRadius: "6px",
                background: "transparent",
                color: palette.textMuted,
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: font.sans,
              }}
            >
              ↻ Carregar un altre fitxer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
