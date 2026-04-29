import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";

export default function JsonFormatterScreen() {
  const [raw, setRaw] = useState("");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    setError("");
    if (!raw.trim()) {
      setError("Enter JSON first");
      return;
    }
    try {
      setFormatted(JSON.stringify(JSON.parse(raw), null, indent));
    } catch (e) {
      setError("Invalid JSON: " + e.message);
      setFormatted("");
    }
  };

  const minify = () => {
    setError("");
    if (!raw.trim()) {
      setError("Enter JSON first");
      return;
    }
    try {
      setFormatted(JSON.stringify(JSON.parse(raw)));
    } catch (e) {
      setError("Invalid JSON: " + e.message);
      setFormatted("");
    }
  };

  const copy = async () => {
    if (formatted) await Clipboard.setStringAsync(formatted);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Paste JSON</Text>
      <TextInput
        style={styles.input}
        value={raw}
        onChangeText={setRaw}
        placeholder='{"name": "value"}'
        placeholderTextColor="#555"
        multiline
        textAlignVertical="top"
      />
      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={format}>
          <Text style={styles.btnText}>Format</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={minify}>
          <Text style={styles.btnTextSecondary}>Minify</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={copy}
          disabled={!formatted}
        >
          <Text style={styles.btnTextSecondary}>Copy</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.label}>Result</Text>
      <TextInput
        style={styles.input}
        value={formatted}
        editable={false}
        placeholder="Formatted output"
        placeholderTextColor="#555"
        multiline
        textAlignVertical="top"
      />
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
    fontSize: 14,
    fontFamily: "monospace",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#333",
  },
  row: { flexDirection: "row", gap: 10, marginTop: 12, flexWrap: "wrap" },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  btnPrimary: { backgroundColor: "#64ffda" },
  btnSecondary: { backgroundColor: "#333" },
  btnText: { color: "#000", fontWeight: "700" },
  btnTextSecondary: { color: "#fff", fontWeight: "600" },
  error: { color: "#f44", marginTop: 8, fontSize: 14 },
});
