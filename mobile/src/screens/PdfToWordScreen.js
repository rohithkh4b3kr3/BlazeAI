import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { API_BASE } from "../api";
import axios from "axios";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { arrayBufferToBase64 } from "../utils";

export default function PdfToWordScreen() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    setFile(result.assets[0]);
    setError("");
  };

  const convert = async () => {
    if (!file) {
      setError("Select a PDF first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("pdf", {
        uri: file.uri,
        name: file.name || "document.pdf",
        type: "application/pdf",
      });
      const r = await axios.post(`${API_BASE}/api/pdf-to-word`, formData, {
        responseType: "arraybuffer",
        timeout: 60000,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const base64 = arrayBufferToBase64(r.data);
      const path = FileSystem.cacheDirectory + "converted.docx";
      await FileSystem.writeAsStringAsync(path, base64, { encoding: FileSystem.EncodingType.Base64 });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path, { mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      else setError("DOCX saved. Sharing not available.");
    } catch (e) {
      setError(e.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.pickBtn} onPress={pick}>
        <Text style={styles.pickBtnText}>{file ? file.name : "Select PDF"}</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={convert} disabled={loading || !file}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Convert to Word</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20 },
  pickBtn: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  pickBtnText: { color: "#64ffda", fontWeight: "600", fontSize: 16 },
  error: { color: "#f44", marginTop: 12, fontSize: 14 },
  btn: { marginTop: 20, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  btnPrimary: { backgroundColor: "#64ffda" },
  btnText: { color: "#000", fontWeight: "700", fontSize: 16 },
});
