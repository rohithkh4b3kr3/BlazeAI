const API_BASE = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default API_BASE;
