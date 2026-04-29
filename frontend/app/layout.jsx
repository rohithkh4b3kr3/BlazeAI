import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "BlazeAI - Tools",
  description: "JSON formatter, image tools, PDF, word counter, and more.",
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
