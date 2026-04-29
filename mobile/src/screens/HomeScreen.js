import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { get } from "../api";
import { API_BASE } from "../config";

const TOOLS = [
  { id: "Currency", title: "Currency", desc: "Convert currencies", icon: "cash-outline" },
  { id: "WordCount", title: "Word Counter", desc: "Words & characters", icon: "document-text-outline" },
  { id: "Password", title: "Password", desc: "Secure passwords", icon: "key-outline" },
  { id: "JsonFormatter", title: "JSON", desc: "Format & minify", icon: "code-slash-outline" },
  { id: "UnitConverter", title: "Units", desc: "Length, weight, temp", icon: "resize-outline" },
  { id: "Plagiarism", title: "Plagiarism", desc: "Check with AI", icon: "shield-checkmark-outline" },
  { id: "ImageToPdf", title: "Image → PDF", desc: "Images to one PDF", icon: "images-outline" },
  { id: "ImageCompress", title: "Compress", desc: "Shrink image size", icon: "contract-outline" },
  { id: "RemoveBg", title: "Remove BG", desc: "Transparent PNG", icon: "cut-outline" },
  { id: "PdfToWord", title: "PDF → Word", desc: "Convert to DOCX", icon: "document-outline" },
];

function ConnectionStatus({ connected, loading, onRefresh }) {
  if (loading) {
    return (
      <View style={[styles.statusPill, styles.statusLoading]}>
        <ActivityIndicator size="small" color="#64ffda" />
        <Text style={styles.statusText}>Checking…</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity
      onPress={onRefresh}
      activeOpacity={0.8}
      style={[styles.statusPill, connected ? styles.statusOk : styles.statusOffline]}
    >
      <Ionicons
        name={connected ? "cloud-done-outline" : "cloud-offline-outline"}
        size={18}
        color="#fff"
      />
      <Text style={styles.statusText}>
        {connected ? "Backend connected" : "Backend offline"}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const [backendOk, setBackendOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const isNarrow = width < 400;
  const cardWidth = isNarrow ? "100%" : (width - 20 * 3) / 2;

  const checkBackend = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await get("/api/health");
      setBackendOk(res?.data?.status === "ok");
    } catch {
      setBackendOk(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkBackend();
    }, [checkBackend])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => checkBackend(true)}
            tintColor="#64ffda"
          />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.title}>
            Blaze<Text style={styles.accent}>AI</Text>
          </Text>
          <Text style={styles.tagline}>All your tools in one place</Text>
          <View style={styles.statusWrap}>
            <ConnectionStatus
              connected={backendOk}
              loading={loading}
              onRefresh={() => checkBackend(true)}
            />
          </View>
          {!backendOk && !loading && (
            <Text style={styles.hint}>
              Same WiFi as your PC? Set REAL_DEVICE_API_HOST in src/config.js to your computer’s IP.
            </Text>
          )}
        </View>

        <View style={styles.toolGrid}>
          {TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[styles.card, { width: isNarrow ? "100%" : cardWidth }]}
              onPress={() => navigation.navigate(tool.id)}
              activeOpacity={0.85}
            >
              <View style={styles.cardIconWrap}>
                <Ionicons name={tool.icon} size={28} color="#64ffda" />
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>{tool.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={1}>{tool.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  hero: { paddingTop: 8, paddingBottom: 20 },
  title: { fontSize: 40, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },
  accent: { color: "#64ffda" },
  tagline: { fontSize: 17, color: "#888", marginTop: 4 },
  statusWrap: { marginTop: 16 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  statusOk: { backgroundColor: "rgba(100, 255, 218, 0.2)" },
  statusOffline: { backgroundColor: "rgba(255, 80, 80, 0.25)" },
  statusLoading: { backgroundColor: "#1a1a1a" },
  statusText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: "#666",
    maxWidth: 320,
  },
  toolGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(100, 255, 218, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#64ffda", marginBottom: 2 },
  cardDesc: { fontSize: 12, color: "#888" },
  bottomPad: { height: 24 },
});
