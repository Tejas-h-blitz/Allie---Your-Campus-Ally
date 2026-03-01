"use client";
import { useState } from "react";

const NAV_ITEMS = [
    {
        id: "campaigns",
        label: "Campaigns",
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
    },
    {
        id: "schedule",
        label: "Schedule",
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
    },
    {
        id: "brain",
        label: "Campus Brain",
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
            </svg>
        ),
    },
    {
        id: "settings",
        label: "Settings",
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

interface SidebarProps {
    active: string;
    onSelect: (id: string) => void;
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className="hidden md:flex flex-col items-center py-6 gap-2 h-full"
                style={{
                    width: 72,
                    minWidth: 72,
                    background: "var(--amd-surface)",
                    borderRight: "1px solid var(--amd-border)",
                }}
            >
                {/* Allie Logo */}
                <div className="mb-6 flex flex-col items-center">
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #6D28D9 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 18px rgba(59,130,246,0.6)",
                            fontSize: 18,
                        }}
                    >
                        🧠
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#60A5FA", marginTop: 4, letterSpacing: "0.05em" }}>ALLIE</span>
                </div>

                <div className="flex flex-col gap-1 w-full px-2 flex-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = active === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item.id)}
                                title={item.label}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 10,
                                    padding: "12px 0",
                                    transition: "all 0.2s",
                                    color: isActive ? "#fff" : "var(--amd-text-muted)",
                                    background: isActive
                                        ? "linear-gradient(135deg, rgba(0,92,185,0.35) 0%, rgba(0,112,224,0.2) 100%)"
                                        : "transparent",
                                    border: isActive
                                        ? "1px solid rgba(0,92,185,0.5)"
                                        : "1px solid transparent",
                                    boxShadow: isActive ? "0 0 12px rgba(0,92,185,0.3)" : "none",
                                    cursor: "pointer",
                                }}
                            >
                                {item.icon}
                            </button>
                        );
                    })}
                </div>

                {/* Version badge */}
                <div style={{ fontSize: 9, color: "var(--amd-text-dim)", letterSpacing: "0.05em", marginTop: "auto" }}>
                    v1.0
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav
                className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 justify-around items-center py-3"
                style={{
                    background: "var(--amd-surface)",
                    borderTop: "1px solid var(--amd-border)",
                    backdropFilter: "blur(16px)",
                }}
            >
                {NAV_ITEMS.map((item) => {
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 3,
                                color: isActive ? "var(--amd-blue-light)" : "var(--amd-text-muted)",
                                transition: "color 0.2s",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px 12px",
                            }}
                        >
                            {item.icon}
                            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.05em" }}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </>
    );
}
