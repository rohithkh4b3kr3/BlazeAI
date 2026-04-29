"use client";

import { useState } from "react";
import axios from "axios";
import API_BASE from "@/lib/api";

export default function PdfPage() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
    setError("");
  };

  const handleUpload = async () => {
    if (!files.length) {
      setError("Select at least one image.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));
    try {
      const res = await axios.post(`${API_BASE}/api/pdf/upload`, formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const d = err.response?.data;
      if (d?.text) {
        d.text().then((t) => {
          try {
            setError(JSON.parse(t).error || "Upload failed.");
          } catch {
            setError("Upload failed.");
          }
        }).catch(() => setError("Upload failed."));
      } else {
        setError(err.response?.data?.error || "Upload failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-[#64ffda] md:text-4xl">Image → PDF</h1>
      <p className="mb-8 text-gray-400">Select images and download as one PDF.</p>
      <div className="w-full max-w-3xl space-y-6 rounded-2xl border border-gray-700 bg-gray-900 p-6 md:p-8">
        <label className="block">
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          <div className="cursor-pointer rounded-lg border border-gray-600 bg-gray-800 py-4 text-center text-gray-300 transition hover:border-[#64ffda]">
            Select images
          </div>
        </label>
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="h-40 rounded-lg border border-gray-700 object-cover" />
            ))}
          </div>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full rounded-xl bg-[#64ffda] py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Converting…" : "Upload & Download PDF"}
        </button>
      </div>
    </div>
  );
}
