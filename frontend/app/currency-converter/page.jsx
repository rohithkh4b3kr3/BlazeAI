"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "@/lib/api";
import { FaDollarSign } from "react-icons/fa";

export default function CurrencyConverterPage() {
  const [currencies, setCurrencies] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1");
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/currency/currencies`)
      .then((res) => setCurrencies(res.data))
      .catch(() => setError("Could not load currencies."))
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) < 0) {
      setResult(null);
      setRate(null);
      return;
    }
    if (!fromCurrency || !toCurrency) {
      setResult(null);
      setRate(null);
      return;
    }
    if (fromCurrency === toCurrency) {
      setResult(Number(amount));
      setRate(1);
      return;
    }
    setLoading(true);
    setError("");
    const params = {
      amount: Number(amount),
      from_currency: String(fromCurrency).trim(),
      to_currency: String(toCurrency).trim(),
    };
    axios
      .get(`${API_BASE}/api/currency/convert`, { params })
      .then((res) => {
        setResult(res.data.result);
        setRate(res.data.rate);
      })
      .catch((err) => setError(err.response?.data?.error || "Conversion failed."))
      .finally(() => setLoading(false));
  }, [amount, fromCurrency, toCurrency]);

  const currencyList = Object.keys(currencies).length
    ? Object.entries(currencies).map(([code, name]) => ({
        code,
        name: typeof name === "string" ? name : code,
      }))
    : [
        { code: "USD", name: "US Dollar" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "British Pound" },
        { code: "INR", name: "Indian Rupee" },
        { code: "JPY", name: "Japanese Yen" },
      ];

  return (
    <div className="flex min-h-full flex-col items-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-[#64ffda] md:text-4xl">
        Currency Converter
      </h1>
      <p className="mb-8 text-gray-400">
        Convert between 30+ currencies using live exchange rates.
      </p>

      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-gray-700 bg-gray-900 p-6 md:p-8">
        <div>
          <label className="mb-2 block text-sm text-gray-400">Amount</label>
          <div className="relative">
            <FaDollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 py-3 pl-11 pr-4 text-white outline-none focus:border-[#64ffda]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm text-gray-400">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              disabled={loadingList}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-[#64ffda] focus:outline-none disabled:opacity-50"
            >
              {currencyList.map(({ code, name }) => (
                <option key={code} value={code}>
                  {code} – {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-400">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              disabled={loadingList}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-[#64ffda] focus:outline-none disabled:opacity-50"
            >
              {currencyList.map(({ code, name }) => (
                <option key={code} value={code}>
                  {code} – {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
          <p className="mb-1 text-sm text-gray-400">Result</p>
          {loading ? (
            <p className="text-xl text-gray-500">Converting…</p>
          ) : result != null ? (
            <>
              <p className="text-2xl font-bold text-[#64ffda]">
                {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCurrency}
              </p>
              {rate != null && fromCurrency !== toCurrency && (
                <p className="mt-2 text-sm text-gray-500">
                  1 {fromCurrency} = {rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCurrency}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">Enter an amount to convert.</p>
          )}
        </div>
      </div>
    </div>
  );
}
