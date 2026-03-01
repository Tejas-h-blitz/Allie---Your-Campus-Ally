"use client";

interface CommandBarProps {
    prompt: string;
    onChange: (val: string) => void;
    onGenerate: () => void;
    isGenerating: boolean;
    localInference: boolean;
    onToggleLocal: () => void;
}

export default function CommandBar({
    prompt,
    onChange,
    onGenerate,
    isGenerating,
    localInference,
    onToggleLocal,
}: CommandBarProps) {
    return (
        <div
            style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--amd-border)",
                background: "var(--amd-surface)",
            }}
        >
            {/* Title row */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h1
                        style={{
                            fontSize: 18,
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                            background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Allie
                    </h1>
                    <p style={{ fontSize: 11, color: "var(--amd-text-muted)", marginTop: 1 }}>
                        Your Campus Ally · One prompt → Copy · Poster · Reel
                    </p>
                </div>

                {/* AMD Local Inference Toggle */}
                <button
                    onClick={onToggleLocal}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: localInference
                            ? "rgba(0,210,106,0.1)"
                            : "rgba(255,255,255,0.05)",
                        border: localInference
                            ? "1px solid rgba(0,210,106,0.4)"
                            : "1px solid var(--amd-border)",
                        borderRadius: 999,
                        padding: "6px 14px",
                        cursor: "pointer",
                        transition: "all 0.3s",
                    }}
                >
                    {/* Toggle dot */}
                    <div style={{ position: "relative", width: 36, height: 20 }}>
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: 999,
                                background: localInference ? "var(--amd-green)" : "rgba(255,255,255,0.1)",
                                transition: "background 0.3s",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: 2,
                                left: localInference ? 18 : 2,
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                background: "#fff",
                                boxShadow: localInference ? "0 0 6px rgba(0,210,106,0.8)" : "none",
                                transition: "left 0.3s, box-shadow 0.3s",
                            }}
                        />
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <div
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: localInference ? "var(--amd-green)" : "var(--amd-text-muted)",
                                letterSpacing: "0.04em",
                                lineHeight: 1.2,
                            }}
                        >
                            AMD Ryzen™ AI
                        </div>
                        <div style={{ fontSize: 9, color: "var(--amd-text-dim)", letterSpacing: "0.02em" }}>
                            Local Inference
                        </div>
                    </div>
                </button>
            </div>

            {/* Command Input */}
            <div
                className="glow-focus"
                style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--amd-border)",
                    borderRadius: 12,
                    padding: "6px 6px 6px 16px",
                    transition: "border-color 0.2s",
                }}
            >
                {/* Search/Prompt icon */}
                <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    style={{ color: "var(--amd-blue-light)", flexShrink: 0 }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>

                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isGenerating && onGenerate()}
                    placeholder='Try "Pizza Party at the Union" or "Chess Club Social"...'
                    style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        color: "var(--amd-text)",
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: "inherit",
                    }}
                />

                {isGenerating && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, paddingRight: 8 }}>
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "var(--amd-blue-light)",
                                animation: "green-pulse 1s ease-in-out infinite",
                            }}
                        />
                        <span style={{ fontSize: 11, color: "var(--amd-blue-light)", fontWeight: 600 }}>
                            Generating…
                        </span>
                    </div>
                )}

                <button
                    className="btn-generate"
                    onClick={onGenerate}
                    disabled={isGenerating || !prompt.trim()}
                >
                    {isGenerating ? "⚡ Working…" : "⚡ Generate"}
                </button>
            </div>
        </div>
    );
}
