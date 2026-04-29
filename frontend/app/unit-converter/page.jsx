"use client";

import { useState, useEffect } from "react";

const UNITS = {
  length: [
    { name: "Meter", toMeter: 1 },
    { name: "Kilometer", toMeter: 1000 },
    { name: "Centimeter", toMeter: 0.01 },
    { name: "Millimeter", toMeter: 0.001 },
    { name: "Mile", toMeter: 1609.344 },
    { name: "Yard", toMeter: 0.9144 },
    { name: "Foot", toMeter: 0.3048 },
    { name: "Inch", toMeter: 0.0254 },
  ],
  weight: [
    { name: "Kilogram", toKg: 1 },
    { name: "Gram", toKg: 0.001 },
    { name: "Milligram", toKg: 0.000001 },
    { name: "Pound", toKg: 0.453592 },
    { name: "Ounce", toKg: 0.0283495 },
    { name: "Ton", toKg: 1000 },
  ],
  temperature: [
    { name: "Celsius", id: "c" },
    { name: "Fahrenheit", id: "f" },
    { name: "Kelvin", id: "k" },
  ],
};

function convertLength(value, fromIdx, toIdx) {
  const arr = UNITS.length;
  const base = value * arr[fromIdx].toMeter;
  return base / arr[toIdx].toMeter;
}

function convertWeight(value, fromIdx, toIdx) {
  const arr = UNITS.weight;
  const base = value * arr[fromIdx].toKg;
  return base / arr[toIdx].toKg;
}

function convertTemp(value, fromId, toId) {
  let c = value;
  if (fromId === "f") c = ((value - 32) * 5) / 9;
  if (fromId === "k") c = value - 273.15;
  if (toId === "f") return (c * 9) / 5 + 32;
  if (toId === "k") return c + 273.15;
  return c;
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState("length");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState("1");
  const [result, setResult] = useState("");

  const list = UNITS[category];

  useEffect(() => {
    const v = parseFloat(value);
    if (Number.isNaN(v)) {
      setResult("");
      return;
    }
    const arr = UNITS[category];
    if (category === "temperature") {
      setResult(convertTemp(v, arr[fromIdx].id, arr[toIdx].id).toFixed(4));
    } else if (category === "length") {
      setResult(convertLength(v, fromIdx, toIdx).toFixed(6));
    } else if (category === "weight") {
      setResult(convertWeight(v, fromIdx, toIdx).toFixed(6));
    }
  }, [value, fromIdx, toIdx, category]);

  return (
    <div className="flex min-h-full flex-col items-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-[#64ffda] md:text-4xl">Unit Converter</h1>
      <p className="mb-8 text-gray-400">Length, weight, and temperature.</p>
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-gray-700 bg-gray-900 p-6 md:p-8">
        <div>
          <label className="mb-2 block text-sm text-gray-400">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setFromIdx(0);
              setToIdx(1);
            }}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white"
          >
            <option value="length">Length</option>
            <option value="weight">Weight</option>
            <option value="temperature">Temperature</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm text-gray-400">From</label>
            <select
              value={fromIdx}
              onChange={(e) => setFromIdx(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white"
            >
              {list.map((u, i) => (
                <option key={u.name} value={i}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-400">To</label>
            <select
              value={toIdx}
              onChange={(e) => setToIdx(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white"
            >
              {list.map((u, i) => (
                <option key={u.name} value={i}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-400">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            step="any"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-[#64ffda]"
          />
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
          <p className="mb-1 text-sm text-gray-400">Result</p>
          <p className="text-2xl font-bold text-[#64ffda]">
            {result !== "" ? `${result} ${list[toIdx].name}` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
