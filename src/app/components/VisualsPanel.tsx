"use client";
import { useState } from "react";
import SkeletonLoader from "./SkeletonLoader";

interface VisualsPanelProps {
    isLoading: boolean;
    hasContent: boolean;
    prompt: string;
    onEditPrompt: (newPrompt: string) => void;
}

// ─── Event-type theme detector ────────────────────────────────────────────────
interface EventTheme {
    emoji: string;
    gradient: string;
    accentColor: string;
    patternEmoji: string;
    label: string;
}

function getEventTheme(prompt: string): EventTheme {
    const p = prompt.toLowerCase();
    if (p.match(/pizza|food|eat|dinner|lunch|feast|bbq|chicken|burger|snack/))
        return { emoji: "🍽️", gradient: "linear-gradient(145deg,#1a0a00 0%,#3d1500 40%,#7a2c00 100%)", accentColor: "#FF6B2B", patternEmoji: "🍕", label: "Food Fiesta" };
    if (p.match(/tug|war|rope|pull|outdoor|field/))
        return { emoji: "🪢", gradient: "linear-gradient(145deg,#001a0a 0%,#00380f 40%,#005c18 100%)", accentColor: "#00D26A", patternEmoji: "💪", label: "Team Showdown" };
    if (p.match(/chess|strategy|board|tournament|compete/))
        return { emoji: "♟️", gradient: "linear-gradient(145deg,#0a0a1a 0%,#0f0f35 40%,#1a1a55 100%)", accentColor: "#7C83FD", patternEmoji: "♟️", label: "Strategy Battle" };
    if (p.match(/music|concert|jazz|band|song|guitar|dance|festival|sing/))
        return { emoji: "🎵", gradient: "linear-gradient(145deg,#1a0020 0%,#3d0050 40%,#7a00a0 100%)", accentColor: "#C84BFF", patternEmoji: "🎶", label: "Music Night" };
    if (p.match(/hackathon|code|tech|programming|amd|ai|software|computer|build/))
        return { emoji: "💻", gradient: "linear-gradient(145deg,#000d1a 0%,#001a35 40%,#002a55 100%)", accentColor: "#005CB9", patternEmoji: "⚡", label: "Tech Sprint" };
    if (p.match(/sport|cricket|football|soccer|basketball|run|marathon|athletic/))
        return { emoji: "🏆", gradient: "linear-gradient(145deg,#1a0505 0%,#350a0a 40%,#6b0f0f 100%)", accentColor: "#FF4444", patternEmoji: "🏅", label: "Sports Day" };
    if (p.match(/art|paint|design|creative|exhibition|gallery|sketch|draw/))
        return { emoji: "🎨", gradient: "linear-gradient(145deg,#1a0010 0%,#350020 40%,#6b0040 100%)", accentColor: "#FF6EC7", patternEmoji: "🖌️", label: "Art Show" };
    if (p.match(/party|celebrat|welcome|birthday|theme|social|mixer|fun/))
        return { emoji: "🎉", gradient: "linear-gradient(145deg,#1a1500 0%,#352900 40%,#6b5200 100%)", accentColor: "#FFD700", patternEmoji: "🎊", label: "Celebration" };
    if (p.match(/workshop|seminar|talk|lecture|class|study|learn|training/))
        return { emoji: "📚", gradient: "linear-gradient(145deg,#001515 0%,#002a2a 40%,#004444 100%)", accentColor: "#00AEEF", patternEmoji: "💡", label: "Learning Session" };
    // Default: generic campus event
    return { emoji: "⭐", gradient: "linear-gradient(145deg,#0B0E14 0%,#0d1929 40%,#0f2545 100%)", accentColor: "#005CB9", patternEmoji: "🎯", label: "Campus Event" };
}

// Prettify the prompt for the poster title
function toTitleCase(str: string): string {
    return str
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

// ─── Generated Poster Component ──────────────────────────────────────────────
function GeneratedPoster({ prompt }: { prompt: string }) {
    const theme = getEventTheme(prompt);
    const title = toTitleCase(prompt);
    const words = title.split(" ");

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                minHeight: 220,
                background: theme.gradient,
                borderRadius: 12,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 20px",
                gap: 14,
            }}
        >
            {/* Background decorative pattern */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    overflow: "hidden",
                    opacity: 0.07,
                    fontSize: 64,
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gridTemplateRows: "repeat(6,1fr)",
                    alignItems: "center",
                    justifyItems: "center",
                }}
            >
                {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} style={{ lineHeight: 1 }}>
                        {theme.patternEmoji}
                    </span>
                ))}
            </div>

            {/* Top accent bar */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, transparent, ${theme.accentColor}, ${theme.accentColor}, transparent)`,
                }}
            />
            {/* Bottom accent bar */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, transparent, ${theme.accentColor}, ${theme.accentColor}, transparent)`,
                }}
            />

            {/* Main Emoji */}
            <div
                style={{
                    fontSize: 56,
                    lineHeight: 1,
                    filter: `drop-shadow(0 0 20px ${theme.accentColor}88)`,
                    zIndex: 1,
                }}
            >
                {theme.emoji}
            </div>

            {/* Event Name */}
            <div style={{ zIndex: 1, textAlign: "center" }}>
                {words.length <= 3 ? (
                    <h2
                        style={{
                            fontSize: words.join("").length > 18 ? 22 : 28,
                            fontWeight: 900,
                            color: "#fff",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                            textShadow: `0 0 30px ${theme.accentColor}88`,
                            margin: 0,
                            textTransform: "uppercase",
                        }}
                    >
                        {title}
                    </h2>
                ) : (
                    <div>
                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 900,
                                color: "#fff",
                                letterSpacing: "0.02em",
                                lineHeight: 1.2,
                                textShadow: `0 0 30px ${theme.accentColor}88`,
                                margin: 0,
                                textTransform: "uppercase",
                            }}
                        >
                            {words.slice(0, Math.ceil(words.length / 2)).join(" ")}
                        </h2>
                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 900,
                                letterSpacing: "0.02em",
                                lineHeight: 1.2,
                                margin: 0,
                                textTransform: "uppercase",
                                color: theme.accentColor,
                                textShadow: `0 0 20px ${theme.accentColor}66`,
                            }}
                        >
                            {words.slice(Math.ceil(words.length / 2)).join(" ")}
                        </h2>
                    </div>
                )}
            </div>

            {/* Label badge */}
            <div
                style={{
                    zIndex: 1,
                    background: `${theme.accentColor}22`,
                    border: `1px solid ${theme.accentColor}55`,
                    borderRadius: 999,
                    padding: "4px 14px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: theme.accentColor,
                    textTransform: "uppercase",
                }}
            >
                {theme.label}
            </div>

            {/* Details row */}
            <div
                style={{
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 4,
                }}
            >
                {["📍 Campus Grounds", "📅 This Weekend", "🎟️ Free Entry"].map((item) => (
                    <span
                        key={item}
                        style={{
                            fontSize: 9,
                            color: "rgba(255,255,255,0.6)",
                            fontWeight: 500,
                        }}
                    >
                        {item}
                    </span>
                ))}
            </div>

            {/* Glow ring */}
            <div
                style={{
                    position: "absolute",
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${theme.accentColor}22 0%, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function VisualsPanel({
    isLoading,
    hasContent,
    prompt,
    onEditPrompt,
}: VisualsPanelProps) {
    const [editMode, setEditMode] = useState(false);
    const [editValue, setEditValue] = useState(prompt);
    const [hovering, setHovering] = useState(false);

    const handleSaveEdit = () => {
        onEditPrompt(editValue);
        setEditMode(false);
    };

    return (
        <div
            className="glass flex flex-col h-full"
            style={{ borderRadius: 16, overflow: "hidden", minHeight: 0 }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "16px 16px 12px",
                    borderBottom: "1px solid var(--amd-border)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>🎨</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Visuals</span>
                    <span
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "var(--amd-blue-light)",
                            background: "rgba(0,92,185,0.15)",
                            border: "1px solid rgba(0,92,185,0.3)",
                            borderRadius: 999,
                            padding: "2px 7px",
                        }}
                    >
                        DALL-E 3
                    </span>
                </div>

                {hasContent && !isLoading && (
                    <button className="btn-icon" onClick={() => setEditMode(true)}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                        Edit Prompt
                    </button>
                )}
            </div>

            {/* Image Display Area */}
            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12, minHeight: 0, position: "relative" }}>
                {isLoading ? (
                    <div
                        className="fade-in-up"
                        style={{
                            flex: 1,
                            borderRadius: 12,
                            overflow: "hidden",
                            position: "relative",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--amd-border)",
                            minHeight: 180,
                        }}
                    >
                        <SkeletonLoader fullBlock />
                        <div className="scan-beam" />
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    background: "rgba(11,14,20,0.85)",
                                    border: "1px solid var(--amd-border-blue)",
                                    borderRadius: 10,
                                    padding: "10px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: "var(--amd-blue-light)",
                                        animation: "green-pulse 1s ease-in-out infinite",
                                    }}
                                />
                                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--amd-blue-light)" }}>
                                    Generating poster…
                                </span>
                            </div>
                        </div>
                    </div>
                ) : !hasContent ? (
                    <div
                        style={{
                            flex: 1,
                            borderRadius: 12,
                            border: "1px dashed var(--amd-border)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            color: "var(--amd-text-dim)",
                            minHeight: 180,
                        }}
                    >
                        <span style={{ fontSize: 40 }}>🖼️</span>
                        <p style={{ fontSize: 12, textAlign: "center", lineHeight: 1.5 }}>
                            AI-generated poster will appear here
                        </p>
                    </div>
                ) : (
                    <div
                        key={prompt}
                        className="fade-in-up"
                        style={{ flex: 1, position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer", minHeight: 180 }}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                    >
                        <GeneratedPoster prompt={prompt} />

                        {/* Hover Edit Overlay */}
                        {hovering && (
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "rgba(11,14,20,0.65)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backdropFilter: "blur(4px)",
                                    borderRadius: 12,
                                }}
                                onClick={() => setEditMode(true)}
                            >
                                <div
                                    style={{
                                        border: "1px solid var(--amd-border-blue)",
                                        borderRadius: 10,
                                        padding: "12px 24px",
                                        background: "rgba(0,92,185,0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#fff" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Edit Prompt</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Edit Modal */}
                {editMode && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(11,14,20,0.9)",
                            backdropFilter: "blur(8px)",
                            borderRadius: 16,
                        }}
                    >
                        <div
                            className="glass"
                            style={{ borderRadius: 14, padding: 20, width: "90%", maxWidth: 340 }}
                        >
                            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>✏️ Edit Poster Prompt</h3>
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                rows={3}
                                style={{
                                    width: "100%",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid var(--amd-border-blue)",
                                    borderRadius: 8,
                                    padding: "10px 12px",
                                    color: "var(--amd-text)",
                                    fontSize: 13,
                                    fontFamily: "inherit",
                                    outline: "none",
                                    resize: "none",
                                    lineHeight: 1.5,
                                }}
                            />
                            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                                <button className="btn-icon" onClick={() => setEditMode(false)}>Cancel</button>
                                <button
                                    className="btn-generate"
                                    style={{ padding: "8px 20px", fontSize: 12, borderRadius: 8 }}
                                    onClick={handleSaveEdit}
                                >
                                    Regenerate
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
