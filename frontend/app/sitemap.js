export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const routes = [
    "",
    "/pdf",
    "/json-formatter",
    "/image-compressor",
    "/word-counter",
    "/pdf-to-word",
    "/remove-background",
    "/password-generator",
    "/unit-converter",
    "/currency-converter",
    "/playgrrism",
    "/translator",
    "/summariser",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
