import { useState, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";

const UNITS = {
  length: [
    { name: "Meter", toBase: 1 },
    { name: "Km", toBase: 1000 },
    { name: "Cm", toBase: 0.01 },
    { name: "Mile", toBase: 1609.344 },
    { name: "Foot", toBase: 0.3048 },
    { name: "Inch", toBase: 0.0254 },
  ],
  weight: [
    { name: "Kg", toBase: 1 },
    { name: "Gram", toBase: 0.001 },
    { name: "Pound", toBase: 0.453592 },
    { name: "Ounce", toBase: 0.0283495 },
  ],
  temp: [
    { name: "Celsius", id: "c" },
    { name: "Fahrenheit", id: "f" },
    { name: "Kelvin", id: "k" },
  ],
};

function convertTemp(v, fromId, toId) {
  let c = v;
  if (fromId === "f") c = ((v - 32) * 5) / 9;
  if (fromId === "k") c = v - 273.15;
  if (toId === "f") return (c * 9) / 5 + 32;
  if (toId === "k") return c + 273.15;
  return c;
}

export default function UnitConverterScreen() {
  const [category, setCategory] = useState("length");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState("1");

  const list = UNITS[category];
  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    if (category === "temp") {
      return convertTemp(v, list[fromIdx].id, list[toIdx].id).toFixed(4);
    }
    const base = v * list[fromIdx].toBase;
    return (base / list[toIdx].toBase).toFixed(6);
  }, [value, fromIdx, toIdx, category, list]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {["length", "weight", "temp"].map((c) => (
          <Text
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(c)}
          >
            {c}
          </Text>
        ))}
      </View>
      <Text style={styles.label}>Value</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor="#555"
      />
      <Text style={styles.label}>From: {list[fromIdx].name}</Text>
      <View style={styles.chipRow}>
        {list.map((u, i) => (
          <Text
            key={u.name}
            style={[styles.chip, fromIdx === i && styles.chipActive]}
            onPress={() => setFromIdx(i)}
          >
            {u.name}
          </Text>
        ))}
      </View>
      <Text style={styles.label}>To: {list[toIdx].name}</Text>
      <View style={styles.chipRow}>
        {list.map((u, i) => (
          <Text
            key={u.name}
            style={[styles.chip, toIdx === i && styles.chipActive]}
            onPress={() => setToIdx(i)}
          >
            {u.name}
          </Text>
        ))}
      </View>
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          {result !== "" ? `${result} ${list[toIdx].name}` : "—"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  label: { fontSize: 14, color: "#888", marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#333",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    color: "#888",
    fontSize: 14,
    overflow: "hidden",
  },
  chipActive: { backgroundColor: "#0d2a24", color: "#64ffda" },
  resultBox: {
    marginTop: 24,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  resultText: { fontSize: 22, fontWeight: "700", color: "#64ffda" },
});
