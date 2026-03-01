import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// ─── Keyword-based fallback video URLs ────────────────────────────────────────
const VIDEO_MAP: { keywords: string[]; url: string; label: string }[] = [
    { keywords: ["pizza", "food", "feast", "bbq", "eat", "dinner", "lunch", "chicken", "burger", "snack"], url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", label: "Food Reel" },
    { keywords: ["sport", "run", "athletic", "football", "cricket", "basketball", "marathon", "tug", "war", "rope", "outdoor", "gym"], url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", label: "Sports Reel" },
    { keywords: ["music", "concert", "jazz", "band", "dance", "festival", "cultural", "dj", "sing"], url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", label: "Music Reel" },
    { keywords: ["hackathon", "code", "tech", "programming", "amd", "ai", "software", "computer", "build"], url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", label: "Tech Reel" },
    { keywords: ["art", "design", "paint", "exhibition", "gallery", "creative", "craft"], url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", label: "Creative Reel" },
    { keywords: ["party", "celebrate", "social", "mixer", "birthday", "welcome", "farewell"], url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", label: "Party Reel" },
];

function getFallbackVideo(prompt: string): { url: string; label: string } {
    const lower = prompt.toLowerCase();
    for (const entry of VIDEO_MAP) {
        if (entry.keywords.some((kw) => lower.includes(kw))) {
            return { url: entry.url, label: entry.label };
        }
    }
    return { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", label: "Campus Reel" };
}

// Try each model in order until one works
const IMAGE_MODELS = [
    "gemini-2.0-flash-exp-image-generation",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
];

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
        return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
        const fallback = getFallbackVideo(prompt);
        return NextResponse.json({ type: "fallback", ...fallback, note: "No API key" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const imagePrompt = `A vibrant, photorealistic, high-energy scene of a university campus event: "${prompt}". 
Show students actively participating, colorful outdoor campus setting, dynamic action. Portrait image.`;

    // Try models one by one
    for (const model of IMAGE_MODELS) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: [{ parts: [{ text: imagePrompt }] }],
                config: {
                    responseModalities: ["IMAGE"],
                },
            });

            const parts = response.candidates?.[0]?.content?.parts ?? [];
            for (const part of parts) {
                if (part.inlineData?.mimeType?.startsWith("image/") && part.inlineData.data) {
                    return NextResponse.json({
                        type: "imagen",
                        imageData: part.inlineData.data,
                        imageMime: part.inlineData.mimeType,
                        label: `${model} Reel`,
                        prompt,
                    });
                }
            }
        } catch {
            // Try next model
            continue;
        }
    }

    // All models failed — use fallback
    const fallback = getFallbackVideo(prompt);
    return NextResponse.json({
        type: "fallback",
        ...fallback,
        note: "AI image unavailable — using themed reel",
    });
}
