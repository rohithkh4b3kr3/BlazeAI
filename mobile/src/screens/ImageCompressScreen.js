import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_BASE } from "../api";
import axios from "axios";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { arrayBufferToBase64 } from "../utils";

export default function ImageCompressScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [resultUri, setResultUri] = useState(null);
  const [quality, setQuality] = useState(85);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Need photo library permission");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setResultUri(null);
      setError("");
    }
  };

  const compress = async () => {
    if (!imageUri) {
      setError("Select an image first");
      return;
    }
    setLoading(true);
    setError("");
    setResultUri(null);
    try {
      const formData = new FormData();
      formData.append("image", { uri: imageUri, name: "image.jpg", type: "image/jpeg" });
      formData.append("quality", String(quality));
      const r = await axios.post(`${API_BASE}/api/compress`, formData, {
        responseType: "arraybuffer",
        timeout: 30000,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const base64 = arrayBufferToBase64(r.data);
      const path = FileSystem.cacheDirectory + "compressed.jpg";
      await FileSystem.writeAsStringAsync(path, base64, { encoding: FileSystem.EncodingType.Base64 });
      setResultUri(path);
    } catch (e) {
      setError(e.message || "Compress failed");
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    if (resultUri && (await Sharing.isAvailableAsync())) await Sharing.shareAsync(resultUri);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.pickBtn} onPress={pick}>
        <Text style={styles.pickBtnText}>Select image</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Quality: {quality}%</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setQuality((q) => Math.max(1, q - 5))}>
          <Text style={styles.stepper}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qualityNum}>{quality}</Text>
        <TouchableOpacity onPress={() => setQuality((q) => Math.min(100, q + 5))}>
          <Text style={styles.stepper}>+</Text>
        </TouchableOpacity>
      </View>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={compress} disabled={loading || !imageUri}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Compress</Text>}
      </TouchableOpacity>
      {resultUri && (
        <>
          <Image source={{ uri: resultUri }} style={styles.preview} />
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={share}>
            <Text style={styles.btnTextSecondary}>Share</Text>
          </TouchableOpacity>
        </>
      )}
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
  label: { color: "#888", marginTop: 16, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 16 },
  stepper: { fontSize: 28, color: "#64ffda", fontWeight: "700" },
  qualityNum: { fontSize: 20, color: "#fff", fontWeight: "700" },
  preview: { width: "100%", height: 200, borderRadius: 12, marginTop: 12, backgroundColor: "#1a1a1a" },
  error: { color: "#f44", marginTop: 12, fontSize: 14 },
  btn: { marginTop: 16, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  btnPrimary: { backgroundColor: "#64ffda" },
  btnSecondary: { backgroundColor: "#333", marginTop: 10 },
  btnText: { color: "#000", fontWeight: "700", fontSize: 16 },
  btnTextSecondary: { color: "#fff", fontWeight: "600" },
});
