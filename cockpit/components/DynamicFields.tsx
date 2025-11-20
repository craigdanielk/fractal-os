"use client";

export function DynamicFields({ raw }: { raw: any }) {
    if (!raw) return null;

    return (
        <div className="flex flex-col gap-1 text-xs opacity-80">
            {Object.entries(raw).map(([key, entry]: any) => (
                <div key={key} className="flex items-center justify-between">
                    <span>{key}</span>
                    <span className="opacity-60">{String(JSON.stringify(entry.value))}</span>
                </div>
            ))}
        </div>
    );
}
