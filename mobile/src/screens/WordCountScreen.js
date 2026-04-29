import { useState, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";

export default function WordCountScreen() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const t = text.trim();
    if (!t)
      return { words: 0, chars: 0, noSpaces: 0, lines: 0 };
    return {
      words: t.split(/\s+/).filter(Boolean).length,
      chars: text.length,
      noSpaces: text.replace(/\s/g, "").length,
      lines: text.split(/\n/).length,
    };
  }, [text]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Paste or type text..."
        placeholderTextColor="#555"
        multiline
        textAlignVertical="top"
      />
      <View style={styles.grid}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stats.words}</Text>
          <Text style={styles.statLabel}>Words</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stats.chars}</Text>
          <Text style={styles.statLabel}>Characters</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stats.noSpaces}</Text>
          <Text style={styles.statLabel}>No spaces</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stats.lines}</Text>
          <Text style={styles.statLabel}>Lines</Text>
        </View>
      </View>
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
  grid: { flexDirection: "row", flexWrap: "wrap", marginTop: 20, gap: 12 },
  stat: {
    width: "47%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  statValue: { fontSize: 28, fontWeight: "700", color: "#64ffda" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 4 },
});
