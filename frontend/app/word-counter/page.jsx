"use client";

import { useState, useMemo } from "react";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const t = text.trim();
    if (!t) return { words: 0, chars: 0, charsNoSpaces: 0, lines: 0 };
    return {
      words: t.split(/\s+/).filter(Boolean).length,
      chars: text.length,
      charsNoSpaces: text.replace(/\s/g, "").length,
      lines: text.split(/\n/).length,
    };
  }, [text]);

  return (
    <div className="flex min-h-full flex-col items-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-[#64ffda] md:text-4xl">Word Counter</h1>
      <p className="mb-8 text-gray-400">Count words, characters, and lines.</p>
      <div className="w-full max-w-3xl space-y-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text..."
          className="h-72 w-full resize-none rounded-xl border border-gray-700 bg-gray-900 p-4 text-gray-100 outline-none focus:border-[#64ffda]"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { value: stats.words, label: "Words" },
            { value: stats.chars, label: "Characters" },
            { value: stats.charsNoSpaces, label: "No spaces" },
            { value: stats.lines, label: "Lines" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-xl border border-gray-700 bg-gray-900 p-4 text-center">
              <p className="text-3xl font-bold text-[#64ffda]">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
