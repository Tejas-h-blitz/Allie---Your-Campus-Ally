"use client";
import { useState, useEffect } from "react";
import GeneratedReel from "./GeneratedReel";

interface MotionPanelProps {
    isLoading: boolean;
    hasContent: boolean;
    prompt: string;
}

export default function MotionPanel({ isLoading, hasContent, prompt }: MotionPanelProps) {
    const [showReel, setShowReel] = useState(false);

    // Show reel when content is ready
    useEffect(() => {
        if (hasContent && prompt) setShowReel(true);
        if (!hasContent && !isLoading) setShowReel(false);
    }, [hasContent, prompt, isLoading]);

    return (
        <div className="glass flex flex-col h-full" style={{ borderRadius: 16, overflow: "hidden", minHeight: 0 }}>
            {/* Header */}
            <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--amd-border)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>🎬</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Motion</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#A855F7", background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 999, padding: "2px 7px" }}>
                        AI REEL
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {showReel && <span style={{ fontSize: 9, color: "#A855F7", fontWeight: 700 }}>✦ Canvas Generated</span>}
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "var(--amd-text-muted)", background: "rgba(255,255,255,0.06)", border: "1px solid var(--amd-border)", borderRadius: 999, padding: "2px 7px" }}>
                        9:16 · REEL
                    </span>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minHeight: 0, overflow: "hidden" }}>

                {/* ── Generating ── */}
                {isLoading && (
                    <div className="fade-in-up" style={{ position: "relative", width: "100%", maxWidth: 200, aspectRatio: "9/16", borderRadius: 14, background: "linear-gradient(145deg,#1a0020,#3d0050,#1a0020)", border: "1px solid rgba(168,85,247,0.4)", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                        <div style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(168,85,247,0.3)", borderTop: "2px solid #A855F7", animation: "spin 1s linear infinite", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 20 }}>🎬</span>
                        </div>
                        <div style={{ textAlign: "center", padding: "0 12px" }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#A855F7", margin: 0 }}>Compositing Reel…</p>
                            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", margin: "4px 0 0", lineHeight: 1.4 }}>
                                {prompt.length > 24 ? prompt.slice(0, 23) + "…" : prompt}
                            </p>
                        </div>
                        <div style={{ position: "absolute", bottom: 12, left: 8, right: 8 }}>
                            {["Analysing prompt", "Generating scene", "Rendering reel"].map((step, i) => (
                                <div key={step} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#A855F7", flexShrink: 0 }} />
                                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Idle ── */}
                {!isLoading && !showReel && (
                    <div style={{ width: "100%", maxWidth: 200, aspectRatio: "9/16", borderRadius: 14, border: "1px dashed var(--amd-border)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--amd-text-dim)", flexShrink: 0 }}>
                        <span style={{ fontSize: 36 }}>🎬</span>
                        <p style={{ fontSize: 11, textAlign: "center", lineHeight: 1.5, padding: "0 12px" }}>AI reel generated from your prompt</p>
                    </div>
                )}

                {/* ── Generated Canvas Reel ── */}
                {showReel && !isLoading && (
                    <div key={prompt} className="fade-in-up" style={{ position: "relative", width: "100%", maxWidth: 200, aspectRatio: "9/16", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(168,85,247,0.5)", flexShrink: 0, boxShadow: "0 0 30px rgba(168,85,247,0.3)" }}>
                        <GeneratedReel prompt={prompt} />
                        {/* Scan line overlay for screen effect */}
                        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(11,14,20,0.85)", borderRadius: 6, padding: "2px 6px", fontSize: 10, fontWeight: 700, color: "#fff" }}>LIVE</div>
                    </div>
                )}

                {/* Storyboard */}
                {showReel && !isLoading && (
                    <div className="fade-in-up" style={{ width: "100%", marginTop: 4 }}>
                        <p style={{ fontSize: 10, color: "var(--amd-text-muted)", marginBottom: 6, fontWeight: 600 }}>STORYBOARD</p>
                        <div style={{ display: "flex", gap: 6 }}>
                            {[0, 1, 2, 3, 4].map((frame) => (
                                <div key={frame} style={{ flex: 1, aspectRatio: "9/16", borderRadius: 6, border: `1px solid ${frame === 0 ? "#A855F7" : "var(--amd-border)"}`, background: `rgba(168,85,247,${0.04 + frame * 0.015})`, position: "relative", overflow: "hidden" }}>
                                    <div style={{ position: "absolute", bottom: 2, left: 0, right: 0, textAlign: "center", fontSize: 8, color: frame === 0 ? "#A855F7" : "var(--amd-text-dim)", fontWeight: 600 }}>{frame + 1}s</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
