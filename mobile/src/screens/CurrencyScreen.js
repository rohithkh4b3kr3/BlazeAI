import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { get } from "../api";

export default function CurrencyScreen() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("EUR");
  const [amount, setAmount] = useState("1");
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadList, setLoadList] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    get("/api/currency/currencies")
      .then((r) => setCurrencies(Object.entries(r.data).map(([code, name]) => ({ code, name }))))
      .catch(() => setError("Could not load currencies"))
      .finally(() => setLoadList(false));
  }, []);

  useEffect(() => {
    const n = parseFloat(amount);
    if (!amount || isNaN(n) || n < 0) {
      setResult(null);
      setRate(null);
      return;
    }
    if (fromCur === toCur) {
      setResult(n);
      setRate(1);
      return;
    }
    setLoading(true);
    setError("");
    get("/api/currency/convert", {
      params: { amount: n, from_currency: fromCur, to_currency: toCur },
    })
      .then((r) => {
        setResult(r.data.result);
        setRate(r.data.rate);
      })
      .catch((e) => setError(e.response?.data?.error || "Conversion failed"))
      .finally(() => setLoading(false));
  }, [amount, fromCur, toCur]);

  const list = currencies.length ? currencies : [{ code: "USD", name: "US Dollar" }, { code: "EUR", name: "Euro" }];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor="#555"
      />
      <Text style={styles.label}>From</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {list.map(({ code }) => (
          <TouchableOpacity
            key={code}
            style={[styles.chip, fromCur === code && styles.chipActive]}
            onPress={() => setFromCur(code)}
          >
            <Text style={[styles.chipText, fromCur === code && styles.chipTextActive]}>{code}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.label}>To</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {list.map(({ code }) => (
          <TouchableOpacity
            key={code}
            style={[styles.chip, toCur === code && styles.chipActive]}
            onPress={() => setToCur(code)}
          >
            <Text style={[styles.chipText, toCur === code && styles.chipTextActive]}>{code}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.resultBox}>
        {loading ? (
          <ActivityIndicator color="#64ffda" />
        ) : result != null ? (
          <>
            <Text style={styles.resultText}>
              {result.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toCur}
            </Text>
            {rate != null && fromCur !== toCur && (
              <Text style={styles.rate}>1 {fromCur} = {rate.toFixed(4)} {toCur}</Text>
            )}
          </>
        ) : (
          <Text style={styles.placeholder}>Enter amount</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  label: { fontSize: 14, color: "#888", marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#333",
  },
  chips: { marginBottom: 8, maxHeight: 50 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  chipActive: { borderColor: "#64ffda", backgroundColor: "#0d2a24" },
  chipText: { color: "#888", fontWeight: "600" },
  chipTextActive: { color: "#64ffda" },
  error: { color: "#f44", marginTop: 12, fontSize: 14 },
  resultBox: {
    marginTop: 24,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
    minHeight: 80,
    justifyContent: "center",
  },
  resultText: { fontSize: 24, fontWeight: "700", color: "#64ffda" },
  rate: { fontSize: 14, color: "#888", marginTop: 8 },
  placeholder: { color: "#555", fontSize: 16 },
});
