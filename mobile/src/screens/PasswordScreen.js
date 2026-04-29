import { useState, useCallback } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Crypto from "expo-crypto";

const CHARS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function PasswordScreen() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    let pool = "";
    if (lower) pool += CHARS.lower;
    if (upper) pool += CHARS.upper;
    if (digits) pool += CHARS.digits;
    if (symbols) pool += CHARS.symbols;
    if (!pool) {
      setPassword("");
      return;
    }
    const bytes = await Crypto.getRandomBytesAsync(length);
    let result = "";
    for (let i = 0; i < length; i++) result += pool[bytes[i] % pool.length];
    setPassword(result);
    setCopied(false);
  }, [length, lower, upper, digits, symbols]);

  const copy = async () => {
    if (password) {
      await Clipboard.setStringAsync(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const Toggle = ({ label, value, onValueChange }) => (
    <TouchableOpacity
      style={[styles.toggle, value && styles.toggleOn]}
      onPress={() => onValueChange(!value)}
    >
      <Text style={styles.toggleText}>{label}</Text>
      <Text style={styles.toggleCheck}>{value ? "✓" : ""}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={password}
          editable={false}
          placeholder="Generated password"
          placeholderTextColor="#555"
        />
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={copy}
          disabled={!password}
        >
          <Text style={styles.btnText}>{copied ? "Copied!" : "Copy"}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.btn, styles.btnPrimary, styles.btnFull]} onPress={generate}>
        <Text style={styles.btnText}>Generate</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Length: {length}</Text>
      <View style={styles.sliderRow}>
        <TouchableOpacity onPress={() => setLength((l) => Math.max(8, l - 1))}>
          <Text style={styles.sliderBtn}>−</Text>
        </TouchableOpacity>
        <Text style={styles.lengthNum}>{length}</Text>
        <TouchableOpacity onPress={() => setLength((l) => Math.min(64, l + 1))}>
          <Text style={styles.sliderBtn}>+</Text>
        </TouchableOpacity>
      </View>
      <Toggle label="Lowercase (a-z)" value={lower} onValueChange={setLower} />
      <Toggle label="Uppercase (A-Z)" value={upper} onValueChange={setUpper} />
      <Toggle label="Digits (0-9)" value={digits} onValueChange={setDigits} />
      <Toggle label="Symbols" value={symbols} onValueChange={setSymbols} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  btn: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, justifyContent: "center" },
  btnPrimary: { backgroundColor: "#64ffda" },
  btnFull: { width: "100%", marginBottom: 20 },
  btnText: { color: "#000", fontWeight: "700", fontSize: 16 },
  label: { color: "#888", marginBottom: 8 },
  sliderRow: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 20 },
  sliderBtn: { fontSize: 28, color: "#64ffda", fontWeight: "700", minWidth: 44, textAlign: "center" },
  lengthNum: { fontSize: 20, color: "#fff", fontWeight: "700", minWidth: 40, textAlign: "center" },
  toggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  toggleOn: { borderColor: "#64ffda" },
  toggleText: { color: "#fff", fontSize: 16 },
  toggleCheck: { color: "#64ffda", fontWeight: "700" },
});
