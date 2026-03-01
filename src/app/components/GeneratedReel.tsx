"use client";
import { useEffect, useRef, useCallback } from "react";

type EventType = "food" | "sports" | "music" | "tech" | "party" | "general";

function detectEvent(prompt: string): EventType {
    const p = prompt.toLowerCase();
    if (p.match(/pizza|food|eat|dinner|lunch|feast|bbq|chicken|burger|snack|meal/)) return "food";
    if (p.match(/tug|war|rope|sport|cricket|football|soccer|run|marathon|athletic|basket|gym|race/)) return "sports";
    if (p.match(/music|concert|jazz|band|dance|festival|dj|sing|cultural|folk|garba/)) return "music";
    if (p.match(/hack|code|tech|program|amd|ai|software|computer|build|debug/)) return "tech";
    if (p.match(/party|celebrat|birthday|social|mixer|farewell|welcome|theme/)) return "party";
    return "general";
}

function getTitle(prompt: string) {
    return prompt.length > 20 ? prompt.slice(0, 19) + "…" : prompt;
}

// ─── SPORTS ANIMATION ─────────────────────────────────────────────────────────
function drawSports(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, prompt: string) {
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
    sky.addColorStop(0, "#1a6fc4"); sky.addColorStop(1, "#90c8f0");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    // Ground
    const gnd = ctx.createLinearGradient(0, H * 0.65, 0, H);
    gnd.addColorStop(0, "#4CAF50"); gnd.addColorStop(1, "#2E7D32");
    ctx.fillStyle = gnd; ctx.fillRect(0, H * 0.65, W, H);
    // Sun
    ctx.fillStyle = "#FFD700"; ctx.shadowBlur = 18; ctx.shadowColor = "#FFD700";
    ctx.beginPath(); ctx.arc(W * 0.85, H * 0.1, 28, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    // Clouds
    for (let c = 0; c < 2; c++) {
        const cx = ((t * 12 + c * W * 0.5) % (W + 80)) - 40;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        for (let b = 0; b < 3; b++) {
            ctx.beginPath(); ctx.arc(cx + b * 16, H * 0.15 + c * H * 0.08, 12 - b * 2, 0, Math.PI * 2); ctx.fill();
        }
    }
    // Rope
    const ry = H * 0.54; const osc = Math.sin(t * 2.5) * 6;
    ctx.strokeStyle = "#8B4513"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(W * 0.08, ry);
    for (let x = W * 0.08; x <= W * 0.92; x += 4) {
        const prog = (x - W * 0.08) / (W * 0.84);
        ctx.lineTo(x, ry + Math.sin(prog * Math.PI) * 12 + Math.sin(t * 4 + prog * 15) * 2.5 + osc * 0.3);
    }
    ctx.stroke();
    // Red marker
    const mx = W / 2 + osc * 2;
    ctx.fillStyle = "#FF1744"; ctx.fillRect(mx - 4, ry - 10, 8, 20);
    // Stick figures
    function fig(x: number, y: number, col: string, dir: number, seed: number) {
        const la = Math.sin(t * 3.5 + seed) * 0.35;
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(x, y - 26, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x, y - 19); ctx.lineTo(x, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y - 13); ctx.lineTo(x + dir * (14 + la * 4), y - 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y - 13); ctx.lineTo(x + dir * 11, y - 18 + la * 3); ctx.stroke();
        const lg = Math.sin(t * 3.5 + seed + 1.5) * 0.4;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 7 + lg * 4, y + 18); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 7 - lg * 4, y + 18); ctx.stroke();
    }
    [[-55, -38, -22, -8].map(o => [W * 0.3 + o + osc, H * 0.60, "#1565C0", -1]),
    [8, 22, 38, 55].map(o => [W * 0.7 + o - osc, H * 0.60, "#C62828", 1])].forEach((team, ti) => {
        team.forEach(([x, y, c, d], i) => fig(x as number, y as number, c as string, d as number, ti * 4 + i));
    });
    // Crowd
    const cc = ["#E65100", "#6A1B9A", "#00695C", "#1B5E20", "#B71C1C", "#0D47A1", "#F57F17", "#880E4F"];
    for (let i = 0; i < 22; i++) {
        const cx = (i / 21) * W; const cy = H * 0.74 + Math.sin(t * 2.8 + i * 0.9) * 6;
        ctx.fillStyle = cc[i % cc.length];
        ctx.beginPath(); ctx.arc(cx, cy, 11, Math.PI, 0); ctx.fill();
        ctx.fillStyle = "#FFCC80"; ctx.beginPath(); ctx.arc(cx, cy - 12, 6, 0, Math.PI * 2); ctx.fill();
    }
    // Title bar
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, 54);
    ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.min(16, W / 11)}px Inter,sans-serif`; ctx.textAlign = "center";
    ctx.fillText(getTitle(prompt).toUpperCase(), W / 2, 22);
    ctx.font = "bold 9px Inter,sans-serif"; ctx.fillStyle = "#FFD700"; ctx.fillText("⚡ SPORTS REEL", W / 2, 40);
}

// ─── MUSIC ANIMATION ─────────────────────────────────────────────────────────
function drawMusic(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, prompt: string) {
    ctx.fillStyle = "#0D0020"; ctx.fillRect(0, 0, W, H);
    // Spotlight beams
    [[0.2, "#0096FF"], [0.5, "#FFD700"], [0.8, "#FF6B00"]].forEach(([bx, col], i) => {
        const ax = Math.sin(t * 0.6 + i * 1.3) * 0.35;
        const g = ctx.createLinearGradient(W * (+bx) + ax * 60, 0, W * (+bx) + ax * 60 + 50, H * 0.6);
        g.addColorStop(0, (col as string).replace(")", ",0.18)")); g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(W * (+bx) + ax * 40, 0);
        ctx.lineTo(W * (+bx) - 50 + ax * 40, H * 0.6); ctx.lineTo(W * (+bx) + 50 + ax * 40, H * 0.6);
        ctx.closePath(); ctx.fill();
    });
    // EQ bars
    const bc = 14; const bw = (W * 0.8) / bc;
    for (let i = 0; i < bc; i++) {
        const bh = (0.25 + Math.abs(Math.sin(t * 3.5 + i * 0.65)) * 0.45) * H * 0.28;
        const hue = (i / bc) * 80 + 240;
        ctx.fillStyle = `hsl(${hue},100%,60%)`; ctx.shadowBlur = 10; ctx.shadowColor = `hsl(${hue},100%,60%)`;
        ctx.beginPath(); ctx.roundRect(W * 0.1 + i * bw + 2, H * 0.7 - bh, bw - 4, bh, 3); ctx.fill();
        // reflection
        ctx.globalAlpha = 0.18;
        ctx.beginPath(); ctx.roundRect(W * 0.1 + i * bw + 2, H * 0.7, bw - 4, bh * 0.4, 2); ctx.fill();
        ctx.globalAlpha = 1;
    }
    ctx.shadowBlur = 0;
    // Floating notes
    const notes = ["♩", "♪", "♫", "♬"];
    for (let n = 0; n < 10; n++) {
        const ny = H - ((t * (35 + n * 4) + n * 60) % (H + 40));
        const nx = (n * 0.098 + 0.04) * W + Math.sin(t + n * 0.7) * 12;
        ctx.globalAlpha = Math.min(1, (H - ny) / H * 2.5) * 0.85;
        ctx.fillStyle = `hsl(${(n * 36 + 270) % 360},80%,70%)`;
        ctx.font = `${13 + (n % 3) * 6}px serif`; ctx.textAlign = "left"; ctx.fillText(notes[n % 4], nx, ny);
    }
    ctx.globalAlpha = 1;
    // Artist silhouette
    const ax = W / 2, ay = H * 0.62;
    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.ellipse(ax, ay, 20, 32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ax, ay - 38, 13, 0, Math.PI * 2); ctx.fill();
    // Mic arm
    ctx.strokeStyle = "#000"; ctx.lineWidth = 3;
    const ma = Math.sin(t * 1.5) * 0.4;
    ctx.beginPath(); ctx.moveTo(ax, ay - 18); ctx.lineTo(ax + 28 * Math.cos(ma - 0.5), ay - 10 + 15 * Math.sin(ma)); ctx.stroke();
    ctx.fillStyle = "#1A003A"; ctx.fillRect(0, H * 0.68, W, H * 0.05);
    // Title bar
    ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(0, 0, W, 54);
    ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.min(16, W / 11)}px Inter,sans-serif`; ctx.textAlign = "center";
    ctx.fillText(getTitle(prompt).toUpperCase(), W / 2, 22);
    ctx.font = "bold 9px Inter,sans-serif"; ctx.fillStyle = "#BB86FC"; ctx.fillText("🎵 MUSIC REEL", W / 2, 40);
}

// ─── FOOD ANIMATION ───────────────────────────────────────────────────────────
function drawFood(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, prompt: string) {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#FF6B35"); bg.addColorStop(0.5, "#FF9A4A"); bg.addColorStop(1, "#FFC107");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#7B3F00"; ctx.fillRect(0, H * 0.72, W, H * 0.28);
    ctx.fillStyle = "#8B4513"; ctx.fillRect(0, H * 0.72, W, 5);
    // Plate
    const px = W / 2, py = H * 0.62, pr = W * 0.31;
    ctx.fillStyle = "#fff"; ctx.shadowBlur = 20; ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#E0E0E0"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(px, py, pr - 5, 0, Math.PI * 2); ctx.stroke();
    // Food items
    [[-2, -10, 18, "#FF4500"], [18, 8, 15, "#FFD700"], [-18, 12, 14, "#4CAF50"], [5, 22, 17, "#FF8C00"], [-6, -22, 11, "#9C27B0"]].forEach(([fx, fy, fr, fc]) => {
        ctx.fillStyle = fc as string;
        ctx.beginPath(); ctx.arc(px + (fx as number), py + (fy as number), (fr as number) + Math.sin(t * 2.2 + (fx as number)) * 1.5, 0, Math.PI * 2); ctx.fill();
    });
    // Fork & knife
    ctx.strokeStyle = "#9E9E9E"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px - pr - 15, py - 28); ctx.lineTo(px - pr - 15, py + 28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + pr + 15, py - 28); ctx.lineTo(px + pr + 15, py + 28); ctx.stroke();
    // Steam
    for (let s = 0; s < 3; s++) {
        const sx = px + (s - 1) * 22; const ph = t * 1.5 + s * 1.3;
        ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); let sy = py - pr; ctx.moveTo(sx, sy);
        for (let r = 0; r < 25; r++) { sy -= 3.5; ctx.lineTo(sx + Math.sin(ph + r * 0.5) * 10, sy); }
        ctx.stroke();
    }
    // Sparkles
    for (let i = 0; i < 8; i++) {
        const sa = (i / 8) * Math.PI * 2 + t * 0.6;
        const sr = 68 + Math.sin(t * 2 + i) * 10;
        const sx = px + Math.cos(sa) * sr * 1.4, sy = py + Math.sin(sa) * sr * 0.65;
        const al = (Math.sin(t * 3 + i) + 1) / 2;
        ctx.fillStyle = `rgba(255,255,200,${al})`; ctx.font = "13px serif"; ctx.textAlign = "center"; ctx.fillText("✨", sx, sy);
    }
    ctx.fillStyle = "rgba(120,40,0,0.65)"; ctx.fillRect(0, 0, W, 54);
    ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.min(16, W / 11)}px Inter,sans-serif`; ctx.textAlign = "center";
    ctx.fillText(getTitle(prompt).toUpperCase(), W / 2, 22);
    ctx.font = "bold 9px Inter,sans-serif"; ctx.fillStyle = "#FFD700"; ctx.fillText("🍽️ FOOD REEL", W / 2, 40);
}

// ─── TECH ANIMATION ───────────────────────────────────────────────────────────
function drawTech(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, prompt: string) {
    ctx.fillStyle = "#050A14"; ctx.fillRect(0, 0, W, H);
    const chs = "01AIHKabcde<>{}[]AMD01NEXUS#$%&"; const cs = 11;
    const cols = Math.floor(W / cs);
    for (let c = 0; c < cols; c++) {
        const seed = c * 137.508; const spd = 0.5 + (seed % 1.3);
        for (let r = 0; r < 6; r++) {
            const y = ((t * spd * 28 + (seed * 6.3) % H + r * cs * 3.5) % (H + cs * 8)) - cs * 4;
            if (y < 0 || y > H) continue;
            const al = r === 0 ? 1 : Math.max(0, 1 - r / 6) * 0.55;
            ctx.fillStyle = r === 0 ? `rgba(0,230,118,${al})` : `rgba(0,150,80,${al})`;
            ctx.shadowBlur = r === 0 ? 6 : 0; ctx.shadowColor = "#00E676";
            ctx.font = `${cs}px monospace`; ctx.textAlign = "left";
            ctx.fillText(chs[Math.floor((t * 6 + c * 3 + r) % chs.length)], c * cs, y);
        }
    }
    ctx.shadowBlur = 0;
    // Central AMD chip
    const cx = W / 2, cy = H * 0.45, cs2 = 62;
    ctx.shadowBlur = 25; ctx.shadowColor = "#005CB9";
    const cg = ctx.createLinearGradient(cx - cs2 / 2, cy - cs2 / 2, cx + cs2 / 2, cy + cs2 / 2);
    cg.addColorStop(0, "#001040"); cg.addColorStop(1, "#003090");
    ctx.fillStyle = cg; ctx.fillRect(cx - cs2 / 2, cy - cs2 / 2, cs2, cs2);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#005CB9"; ctx.lineWidth = 2; ctx.strokeRect(cx - cs2 / 2, cy - cs2 / 2, cs2, cs2);
    // Pins
    for (let p = 0; p < 5; p++) {
        const py = cy - cs2 / 2 + 8 + p * (cs2 - 16) / 4;
        ctx.strokeStyle = `rgba(0,188,212,${0.5 + Math.sin(t + p) * 0.4})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx - cs2 / 2, py); ctx.lineTo(cx - cs2 / 2 - 14, py); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + cs2 / 2, py); ctx.lineTo(cx + cs2 / 2 + 14, py); ctx.stroke();
    }
    ctx.fillStyle = "#fff"; ctx.font = "bold 16px Inter,monospace"; ctx.textAlign = "center"; ctx.fillText("AMD", cx, cy + 4);
    ctx.font = "bold 8px Inter,monospace"; ctx.fillStyle = "#00BCD4"; ctx.fillText("RYZEN™ AI", cx, cy + 18);
    // Orbit
    const oa = t * 1.2;
    ctx.strokeStyle = `rgba(0,92,185,${0.4 + Math.sin(t) * 0.2})`; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy, cs2, cs2 * 0.5, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#FFD700"; ctx.shadowBlur = 8; ctx.shadowColor = "#FFD700";
    ctx.beginPath(); ctx.arc(cx + Math.cos(oa) * cs2, cy + Math.sin(oa) * cs2 * 0.5, 5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0,10,30,0.8)"; ctx.fillRect(0, 0, W, 54);
    ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.min(15, W / 12)}px Inter,sans-serif`; ctx.textAlign = "center";
    ctx.fillText(getTitle(prompt).toUpperCase(), W / 2, 22);
    ctx.font = "bold 9px Inter,sans-serif"; ctx.fillStyle = "#00BCD4"; ctx.fillText("💻 TECH REEL", W / 2, 40);
}

// ─── PARTY ANIMATION ──────────────────────────────────────────────────────────
function drawParty(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, prompt: string) {
    ctx.fillStyle = "#0A001F"; ctx.fillRect(0, 0, W, H);
    const cc = ["#FF6B6B", "#FFE66D", "#4ECDC4", "#95E1D3", "#F38181", "#A8D8EA", "#AA96DA", "#FCBAD3", "#FFEAA7", "#DFE6E9"];
    for (let i = 0; i < 55; i++) {
        const ix = i * 0.0195 + 0.01, spd = 0.28 + (i * 0.07) % 0.65;
        const y = ((t * spd * 70 + (i * 87) % H) % H);
        ctx.save(); ctx.translate(ix * W + Math.sin(t + i * 0.5) * 18, y); ctx.rotate(t * 2 + i);
        const sz = 3.5 + (i % 5) * 1.2; ctx.fillStyle = cc[i % cc.length];
        if (i % 3 === 0) ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
        else if (i % 3 === 1) { ctx.beginPath(); ctx.arc(0, 0, sz / 2, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(sz * .8, sz * .5); ctx.lineTo(-sz * .8, sz * .5); ctx.closePath(); ctx.fill(); }
        ctx.restore();
    }
    // Fireworks
    [[0.25, 0.32], [0.72, 0.28], [0.5, 0.55]].forEach(([fx, fy], fi) => {
        const ph = (t * 0.9 + fi * 0.8) % 2.2;
        if (ph < 1.8) {
            const maxR = 55 * Math.min(ph * 2, 1), al = Math.max(0, 1 - ph * 0.7);
            const hue = (fi * 120 + t * 40) % 360;
            ctx.strokeStyle = `hsla(${hue},100%,65%,${al})`; ctx.lineWidth = 2;
            ctx.shadowBlur = 8; ctx.shadowColor = `hsl(${hue},100%,65%)`;
            for (let a = 0; a < 14; a++) {
                const ang = (a / 14) * Math.PI * 2;
                ctx.beginPath(); ctx.moveTo(fx * W, fy * H); ctx.lineTo(fx * W + Math.cos(ang) * maxR, fy * H + Math.sin(ang) * maxR); ctx.stroke();
            }
            ctx.shadowBlur = 0;
        }
    });
    // Big emoji pulsing
    const emojis = ["🎉", "🥳", "🎊"];
    const sc = 1 + Math.sin(t * 2.8) * 0.18;
    ctx.save(); ctx.translate(W / 2, H * 0.62); ctx.scale(sc, sc);
    ctx.font = "56px serif"; ctx.textAlign = "center"; ctx.fillText(emojis[Math.floor(t * 0.5) % 3], 0, 0);
    ctx.restore();
    // Crowd
    for (let i = 0; i < 20; i++) {
        const cx = (i / 19) * W, cy = H * 0.83 + Math.sin(t * 3.2 + i * 0.8) * 7;
        ctx.fillStyle = "#2A005F"; ctx.beginPath(); ctx.arc(cx, cy, 13, Math.PI, 0); ctx.fill();
        ctx.fillStyle = "#FFCC80"; ctx.beginPath(); ctx.arc(cx, cy - 15, 7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "rgba(10,0,31,0.75)"; ctx.fillRect(0, 0, W, 54);
    ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.min(16, W / 11)}px Inter,sans-serif`; ctx.textAlign = "center";
    ctx.fillText(getTitle(prompt).toUpperCase(), W / 2, 22);
    ctx.font = "bold 9px Inter,sans-serif"; ctx.fillStyle = "#FFE66D"; ctx.fillText("🎉 PARTY REEL", W / 2, 40);
}

// ─── GENERAL (Allie branded) ──────────────────────────────────────────────────
function drawGeneral(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, prompt: string) {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0B0E14"); bg.addColorStop(0.7, "#001240"); bg.addColorStop(1, "#000820");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // Stars
    for (let i = 0; i < 70; i++) {
        const al = (Math.sin(t * 2 + i * 0.6) + 1) / 2;
        const r = 0.4 + (i % 3) * 0.5;
        ctx.fillStyle = `rgba(255,255,255,${al * 0.75})`;
        ctx.beginPath(); ctx.arc((i * 0.0144 + 0.01) * W, (i * 0.0127 + 0.015) * H * 0.8, r, 0, Math.PI * 2); ctx.fill();
    }
    // Allie logo circle
    const cx = W / 2, cy = H * 0.42, lr = 52;
    ctx.shadowBlur = 28; ctx.shadowColor = "#3B82F6";
    const lg = ctx.createRadialGradient(cx, cy, 0, cx, cy, lr);
    lg.addColorStop(0, "#60A5FA"); lg.addColorStop(0.55, "#3B82F6"); lg.addColorStop(1, "#6D28D9");
    ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(cx, cy, lr, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    // Brain icon (simplified)
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "22px serif"; ctx.textAlign = "center"; ctx.fillText("🧠", cx, cy + 8);
    // Orbit ring
    const oa = t * 0.9;
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy, lr + 16, (lr + 16) * 0.45, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#FFD700"; ctx.shadowBlur = 8; ctx.shadowColor = "#FFD700";
    ctx.beginPath(); ctx.arc(cx + Math.cos(oa) * (lr + 16), cy + Math.sin(oa) * (lr + 16) * 0.45, 5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    // "Allie" brand
    ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.font = "bold 20px Inter,sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Allie", cx, cy + lr + 28);
    ctx.font = "10px Inter,sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillText("Your Campus Ally", cx, cy + lr + 44);
    // Wave
    ctx.strokeStyle = "rgba(59,130,246,0.5)"; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 3) { const wy = H * 0.78 + Math.sin(x * 0.05 + t * 2.2) * 10; x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy); }
    ctx.stroke();
    // Title
    ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(0, 0, W, 54);
    ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.min(16, W / 11)}px Inter,sans-serif`; ctx.textAlign = "center";
    ctx.fillText(getTitle(prompt).toUpperCase(), W / 2, 22);
    ctx.font = "bold 9px Inter,sans-serif"; ctx.fillStyle = "#60A5FA"; ctx.fillText("🎓 CAMPUS REEL", W / 2, 40);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GeneratedReel({ prompt }: { prompt: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const startRef = useRef<number>(0);
    const eventType = detectEvent(prompt);

    const draw = useCallback((ts: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        if (!startRef.current) startRef.current = ts;
        const t = (ts - startRef.current) / 1000;
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.textBaseline = "alphabetic";

        switch (eventType) {
            case "sports": drawSports(ctx, W, H, t, prompt); break;
            case "music": drawMusic(ctx, W, H, t, prompt); break;
            case "food": drawFood(ctx, W, H, t, prompt); break;
            case "tech": drawTech(ctx, W, H, t, prompt); break;
            case "party": drawParty(ctx, W, H, t, prompt); break;
            default: drawGeneral(ctx, W, H, t, prompt); break;
        }

        // Allie watermark
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.font = "bold 8px Inter,sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("Allie · Your Campus Ally", W - 8, H - 8);

        animRef.current = requestAnimationFrame(draw);
    }, [eventType, prompt]);

    useEffect(() => {
        startRef.current = 0;
        animRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animRef.current); };
    }, [draw]);

    return (
        <canvas
            ref={canvasRef}
            width={270}
            height={480}
            style={{ width: "100%", height: "100%", display: "block" }}
        />
    );
}
