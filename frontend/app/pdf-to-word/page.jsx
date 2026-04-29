"use client";

import { useState } from "react";
import axios from "axios";
import API_BASE from "@/lib/api";

export default function PdfToWordPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setError("");
  };

  const convert = async () => {
    if (!file?.name?.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const res = await axios.post(`${API_BASE}/api/pdf-to-word`, formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.error || "Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-[#64ffda] md:text-4xl">PDF → Word</h1>
      <p className="mb-8 text-gray-400">Convert PDF to editable Word (.docx).</p>
      <div className="w-full max-w-xl space-y-6 rounded-2xl border border-gray-700 bg-gray-900 p-6 md:p-8">
        <label className="block">
          <span className="text-sm text-gray-400">Select PDF</span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={onFileChange}
            className="mt-2 block w-full text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-[#64ffda] file:px-4 file:py-2 file:text-black"
          />
        </label>
        {file && <p className="text-sm text-gray-400">Selected: {file.name}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          onClick={convert}
          disabled={loading || !file}
          className="w-full rounded-xl bg-[#64ffda] py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Converting…" : "Convert & Download"}
        </button>
      </div>
    </div>
  );
}
