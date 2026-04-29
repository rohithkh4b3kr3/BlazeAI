"use client";

import { useState } from "react";

export default function JsonFormatterPage() {
  const [raw, setRaw] = useState("");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    setError("");
    if (!raw.trim()) {
      setError("Enter some JSON first.");
      return;
    }
    try {
      setFormatted(JSON.stringify(JSON.parse(raw), null, indent));
    } catch (e) {
      setError("Invalid JSON: " + e.message);
      setFormatted("");
    }
  };

  const minify = () => {
    setError("");
    if (!raw.trim()) {
      setError("Enter some JSON first.");
      return;
    }
    try {
      setFormatted(JSON.stringify(JSON.parse(raw)));
    } catch (e) {
      setError("Invalid JSON: " + e.message);
      setFormatted("");
    }
  };

  const copy = () => {
    if (formatted) {
      navigator.clipboard.writeText(formatted);
      alert("Copied!");
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-[#64ffda] md:text-4xl">JSON Formatter</h1>
      <p className="mb-8 text-gray-400">Format, validate, and minify JSON.</p>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-gray-400">Paste JSON</label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder='{"name": "value"}'
            className="h-64 w-full rounded-xl border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-gray-100 outline-none focus:border-[#64ffda]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-400">Result</label>
          <textarea
            readOnly
            value={formatted}
            placeholder="Result"
            className="h-64 w-full rounded-xl border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-gray-100"
          />
        </div>
      </div>
      {error && <p className="mt-2 w-full max-w-4xl text-sm text-red-400">{error}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-gray-400">
          Indent:
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
          </select>
        </label>
        <button onClick={format} className="rounded-xl bg-[#64ffda] px-6 py-3 font-semibold text-black hover:opacity-90">
          Format
        </button>
        <button onClick={minify} className="rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-600">
          Minify
        </button>
        <button onClick={copy} disabled={!formatted} className="rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white disabled:opacity-50">
          Copy
        </button>
      </div>
    </div>
  );
}
