"use client";

interface SkeletonLoaderProps {
    lines?: number;
    height?: number;
    className?: string;
    fullBlock?: boolean;
}

export default function SkeletonLoader({
    lines = 3,
    height = 16,
    className = "",
    fullBlock = false,
}: SkeletonLoaderProps) {
    if (fullBlock) {
        return (
            <div
                className={`skeleton ${className}`}
                style={{ width: "100%", height: "100%", minHeight: 160, borderRadius: 12 }}
            />
        );
    }

    const widths = ["100%", "85%", "92%", "70%", "88%", "60%"];

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton"
                    style={{
                        height,
                        width: widths[i % widths.length],
                        borderRadius: 6,
                    }}
                />
            ))}
        </div>
    );
}
