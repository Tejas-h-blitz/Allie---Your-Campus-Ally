"use client";
import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import CommandBar from "./components/CommandBar";
import CopywriterPanel from "./components/CopywriterPanel";
import VisualsPanel from "./components/VisualsPanel";
import MotionPanel from "./components/MotionPanel";

export default function Home() {
  const [activeNav, setActiveNav] = useState("campaigns");
  const [superPrompt, setSuperPrompt] = useState("Pizza Party at the Union");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [localInference, setLocalInference] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [generationSeed, setGenerationSeed] = useState(0);

  const handleGenerate = useCallback(() => {
    if (!superPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setHasContent(false);
    setCurrentPrompt(superPrompt);
    setGenerationSeed((s) => s + 1);

    // Simulate API orchestration delay (2.5s)
    setTimeout(() => {
      setIsGenerating(false);
      setHasContent(true);
    }, 2500);
  }, [superPrompt, isGenerating]);

  const handleEditPrompt = (newPrompt: string) => {
    setSuperPrompt(newPrompt);
    // Re-trigger generation with the new prompt
    setIsGenerating(true);
    setHasContent(false);
    setCurrentPrompt(newPrompt);
    setTimeout(() => {
      setIsGenerating(false);
      setHasContent(true);
    }, 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "var(--amd-black)",
      }}
    >
      {/* Sidebar */}
      <Sidebar active={activeNav} onSelect={setActiveNav} />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Command Bar */}
        <CommandBar
          prompt={superPrompt}
          onChange={setSuperPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          localInference={localInference}
          onToggleLocal={() => setLocalInference((v) => !v)}
        />

        {/* Dashboard Area */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "20px",
            paddingBottom: "80px", // extra space for mobile bottom nav
          }}
        >
          {/* Section Label */}
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                height: 1,
                flex: 1,
                background: "linear-gradient(90deg, var(--amd-blue) 0%, transparent 100%)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "var(--amd-text-muted)",
                textTransform: "uppercase",
              }}
            >
              Triple-Threat Pack
            </span>
            <div
              style={{
                height: 1,
                flex: 1,
                background: "linear-gradient(90deg, transparent 0%, var(--amd-blue) 100%)",
              }}
            />
          </div>

          {/* 3-Column Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              height: "calc(100vh - 160px)",
              minHeight: 480,
            }}
            className="dashboard-grid"
          >
            {/* Column 1 — Copywriter */}
            <div style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
              <CopywriterPanel
                isLoading={isGenerating}
                hasContent={hasContent}
                prompt={currentPrompt}
                localInference={localInference}
                generationSeed={generationSeed}
              />
            </div>

            {/* Column 2 — Visuals */}
            <div style={{ minHeight: 0, display: "flex", flexDirection: "column", position: "relative" }}>
              <VisualsPanel
                isLoading={isGenerating}
                hasContent={hasContent}
                prompt={currentPrompt}
                onEditPrompt={handleEditPrompt}
              />
            </div>

            {/* Column 3 — Motion */}
            <div style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
              <MotionPanel
                isLoading={isGenerating}
                hasContent={hasContent}
                prompt={currentPrompt}
              />
            </div>
          </div>

          {/* Status bar at bottom */}
          {(isGenerating || hasContent) && (
            <div
              className="fade-in-up"
              style={{
                marginTop: 16,
                padding: "10px 16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--amd-border)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isGenerating ? "var(--amd-blue-light)" : "var(--amd-green)",
                    animation: isGenerating ? "green-pulse 1s ease-in-out infinite" : "none",
                    boxShadow: isGenerating
                      ? "0 0 8px var(--amd-blue-glow)"
                      : "0 0 8px rgba(0,210,106,0.5)",
                  }}
                />
                <span style={{ fontSize: 11, color: "var(--amd-text-muted)", fontWeight: 600 }}>
                  {isGenerating ? "Orchestrating content generation…" : "Content ready"}
                </span>
              </div>

              {hasContent && (
                <>
                  <span style={{ fontSize: 10, color: "var(--amd-text-dim)" }}>·</span>
                  <span style={{ fontSize: 11, color: "var(--amd-text-dim)" }}>
                    Prompt: &quot;{currentPrompt}&quot;
                  </span>
                  {localInference && (
                    <>
                      <span style={{ fontSize: 10, color: "var(--amd-text-dim)" }}>·</span>
                      <span style={{ fontSize: 11, color: "var(--amd-green)", fontWeight: 600 }}>
                        ✓ Text generated locally via AMD Ryzen™ AI (Llama-3)
                      </span>
                    </>
                  )}
                </>
              )}

              <div style={{ marginLeft: "auto", display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { label: "Text", service: localInference ? "Local · Llama-3" : "Gemini 1.5 Flash", color: localInference ? "var(--amd-green)" : "var(--amd-blue-light)" },
                  { label: "Poster", service: "DALL-E 3", color: "#E57373" },
                  { label: "Video", service: "Luma Dream Machine", color: "#A855F7" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, color: "var(--amd-text-dim)" }}>{item.label}:</span>
                    <span style={{ fontSize: 10, color: item.color, fontWeight: 600 }}>{item.service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive grid style override */}
      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
            min-height: unset !important;
          }
          .dashboard-grid > div {
            min-height: 420px;
          }
        }
        @media (max-width: 1100px) and (min-width: 901px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
