"use client";

import { useState } from "react";
import axios from "axios";
import API_BASE from "@/lib/api";

export default function ImageCompressorPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(85);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f);
    setResultUrl("");
    setError("");
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const compress = async () => {
    if (!file) {
      setError("Select an image first.");
      return;
    }
    setLoading(true);
    setError("");
    setResultUrl("");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("quality", quality);
    try {
      const res = await axios.post(`${API_BASE}/api/compress`, formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResultUrl(URL.createObjectURL(res.data));
    } catch (err) {
      setError(err.response?.data?.error || "Compression failed.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "compressed.jpg";
    a.click();
  };

  return (
    <div className="flex min-h-full flex-col items-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-[#64ffda] md:text-4xl">Image Compressor</h1>
      <p className="mb-8 text-gray-400">Reduce size with adjustable quality.</p>
      <div className="w-full max-w-3xl space-y-6 rounded-2xl border border-gray-700 bg-gray-900 p-6 md:p-8">
        <label className="block">
          <span className="text-sm text-gray-400">Select image</span>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="mt-2 block w-full text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-[#64ffda] file:px-4 file:py-2 file:text-black"
          />
        </label>
        <div>
          <label className="mb-2 block text-sm text-gray-400">Quality: {quality}%</label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-[#64ffda]"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {preview && (
            <div>
              <p className="mb-2 text-sm text-gray-400">Original</p>
              <img src={preview} alt="Original" className="max-h-64 rounded-lg bg-gray-800 object-contain" />
            </div>
          )}
          {resultUrl && (
            <div>
              <p className="mb-2 text-sm text-gray-400">Compressed</p>
              <img src={resultUrl} alt="Compressed" className="max-h-64 rounded-lg bg-gray-800 object-contain" />
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-4">
          <button
            onClick={compress}
            disabled={loading || !file}
            className="rounded-xl bg-[#64ffda] px-6 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Compressing…" : "Compress"}
          </button>
          {resultUrl && (
            <button onClick={download} className="rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-600">
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
