import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_BASE } from "../api";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import axios from "axios";
import { arrayBufferToBase64 } from "../utils";

export default function ImageToPdfScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Need photo library permission");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) setImages(result.assets.map((a) => a.uri));
    setError("");
  };

  const convert = async () => {
    if (images.length === 0) {
      setError("Select at least one image");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("images", {
          uri: images[i],
          name: `image_${i}.jpg`,
          type: "image/jpeg",
        });
      }
      const r = await axios.post(`${API_BASE}/api/pdf/upload`, formData, {
        responseType: "arraybuffer",
        timeout: 60000,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const base64 = arrayBufferToBase64(r.data);
      const path = FileSystem.cacheDirectory + "converted.pdf";
      await FileSystem.writeAsStringAsync(path, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) await Sharing.shareAsync(path, { mimeType: "application/pdf" });
      else setError("PDF saved. Sharing not available on this device.");
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.pickBtn} onPress={pick}>
        <Text style={styles.pickBtnText}>Select images</Text>
      </TouchableOpacity>
      {images.length > 0 && (
        <ScrollView horizontal style={styles.previewRow} showsHorizontalScrollIndicator={false}>
          {images.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.thumb} />
          ))}
        </ScrollView>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary]}
        onPress={convert}
        disabled={loading || images.length === 0}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Convert to PDF</Text>}
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
  previewRow: { marginTop: 16, maxHeight: 120 },
  thumb: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
  error: { color: "#f44", marginTop: 12, fontSize: 14 },
  btn: { marginTop: 20, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  btnPrimary: { backgroundColor: "#64ffda" },
  btnText: { color: "#000", fontWeight: "700", fontSize: 16 },
});
