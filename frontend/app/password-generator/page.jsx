"use client";

import { useState, useCallback } from "react";

const CHARS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let pool = "";
    if (lower) pool += CHARS.lower;
    if (upper) pool += CHARS.upper;
    if (digits) pool += CHARS.digits;
    if (symbols) pool += CHARS.symbols;
    if (!pool) {
      setPassword("");
      return;
    }
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, (b) => pool[b % pool.length]).join(""));
    setCopied(false);
  }, [length, lower, upper, digits, symbols]);

  const copy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-[#64ffda] md:text-4xl">Password Generator</h1>
      <p className="mb-8 text-gray-400">Generate secure random passwords.</p>
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-700 bg-gray-900 p-6 md:p-8">
        <div className="flex gap-2">
          <input
            readOnly
            value={password}
            className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 font-mono text-gray-100"
          />
          <button
            onClick={copy}
            disabled={!password}
            className="rounded-xl bg-[#64ffda] px-4 py-3 font-semibold text-black disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <button onClick={generate} className="w-full rounded-xl bg-[#64ffda] py-3 font-semibold text-black hover:opacity-90">
          Generate
        </button>
        <div>
          <label className="mb-2 flex items-center justify-between text-gray-300">
            <span>Length</span>
            <span>{length}</span>
          </label>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[#64ffda]"
          />
        </div>
        <div className="flex flex-col gap-3">
          {[
            { state: lower, set: setLower, label: "Lowercase (a-z)" },
            { state: upper, set: setUpper, label: "Uppercase (A-Z)" },
            { state: digits, set: setDigits, label: "Digits (0-9)" },
            { state: symbols, set: setSymbols, label: "Symbols" },
          ].map(({ state, set, label }) => (
            <label key={label} className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={state} onChange={(e) => set(e.target.checked)} className="accent-[#64ffda]" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
