import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { post } from "../api";

export default function PlagiarismScreen() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const check = async () => {
    if (!text.trim()) {
      setError("Enter text to check");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const r = await post("/api/plagiarism/check", { text: text.trim() });
      setResult(r.data.result);
    } catch (e) {
      setError(e.response?.data?.error || "Check failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Paste or type text to check..."
        placeholderTextColor="#555"
        multiline
        textAlignVertical="top"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary]}
        onPress={check}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.btnText}>Check Plagiarism</Text>
        )}
      </TouchableOpacity>
      {result != null && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Result</Text>
          <Text style={styles.resultText}>
            {typeof result === "object" ? JSON.stringify(result, null, 2) : String(result)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    minHeight: 160,
    borderWidth: 1,
    borderColor: "#333",
  },
  error: { color: "#f44", marginTop: 12, fontSize: 14 },
  btn: { marginTop: 16, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  btnPrimary: { backgroundColor: "#64ffda" },
  btnText: { color: "#000", fontWeight: "700", fontSize: 16 },
  resultBox: {
    marginTop: 24,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  resultLabel: { fontSize: 12, color: "#888", marginBottom: 8 },
  resultText: { color: "#ccc", fontSize: 14 },
});
