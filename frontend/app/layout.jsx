import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BlazeAI | Free Online Productivity Tools",
    template: "%s | BlazeAI",
  },
  description:
    "Free online tools for PDF conversion, image compression, JSON formatting, password generation, currency conversion, and more.",
  keywords: [
    "BlazeAI",
    "online tools",
    "PDF tools",
    "image compressor",
    "JSON formatter",
    "word counter",
    "currency converter",
    "password generator",
  ],
  applicationName: "BlazeAI",
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "BlazeAI",
    title: "BlazeAI | Free Online Productivity Tools",
    description:
      "Use fast, free tools for PDF, image, text, JSON, and conversion workflows.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "BlazeAI productivity tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlazeAI | Free Online Productivity Tools",
    description:
      "Use fast, free tools for PDF, image, text, JSON, and conversion workflows.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="ml-[72px] flex min-h-screen flex-1 flex-col md:ml-64">
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
