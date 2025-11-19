"use client";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <div className="p-12 text-red-500 font-mono">
      <h1 className="text-2xl mb-4">System Error</h1>
      <pre>{error.message}</pre>
    </div>
  );
}

