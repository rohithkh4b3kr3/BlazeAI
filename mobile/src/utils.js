import { encode } from "base64-arraybuffer";

export function arrayBufferToBase64(buffer) {
  return encode(buffer);
}
