import { Platform } from "react-native";

// Set your computer's LAN IP when using a real device (same WiFi as phone).
// Example: "192.168.1.100" → backend at http://192.168.1.100:5000
const REAL_DEVICE_API_HOST = null;

function getApiBase() {
  if (REAL_DEVICE_API_HOST) {
    return `http://${REAL_DEVICE_API_HOST}:5000`;
  }
  // Android emulator: 10.0.2.2 is the host machine. iOS simulator: localhost works.
  return Platform.OS === "android"
    ? "http://10.0.2.2:5000"
    : "http://localhost:5000";
}

export const API_BASE = getApiBase();
