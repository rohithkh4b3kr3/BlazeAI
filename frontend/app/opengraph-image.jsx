import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #000000 0%, #0b0f12 60%, #111827 100%)",
          color: "#ffffff",
          padding: "64px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 34, color: "#64ffda", marginBottom: 24 }}>BlazeAI</div>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08, maxWidth: "90%" }}>
          Free Online Productivity Tools
        </div>
        <div style={{ fontSize: 30, marginTop: 24, color: "#cbd5e1", maxWidth: "90%" }}>
          PDF, Image, JSON, Currency, Password and text tools in one place.
        </div>
      </div>
    ),
    size
  );
}
