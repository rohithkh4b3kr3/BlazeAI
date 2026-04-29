"use client";

import { useState } from "react";
import axios from "axios";
import API_BASE from "@/lib/api";

export default function PlaygrrismPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const check = async () => {
    if (!text.trim()) {
      setError("Enter some text to check.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/plagiarism/check`, { text: text.trim() });
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Check failed. Ensure backend is running and HUGGINGFACE_API_KEY is set.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-[#64ffda] md:text-4xl">Plagiarism Check</h1>
      <p className="mb-8 text-gray-400">Check text with Hugging Face model.</p>
      <div className="w-full max-w-2xl space-y-6 rounded-2xl border border-gray-700 bg-gray-900 p-6 md:p-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to check..."
          className="h-48 w-full resize-none rounded-xl border border-gray-700 bg-gray-800 p-4 text-gray-100 outline-none focus:border-[#64ffda]"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          onClick={check}
          disabled={loading}
          className="w-full rounded-xl bg-[#64ffda] py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Checking…" : "Check Plagiarism"}
        </button>
        {result != null && (
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
            <p className="mb-2 text-sm text-gray-400">Result</p>
            <pre className="whitespace-pre-wrap break-words text-sm text-gray-200">
              {typeof result === "object" ? JSON.stringify(result, null, 2) : String(result)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
