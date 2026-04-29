"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaFilePdf,
  FaCode,
  FaCompressAlt,
  FaSortNumericDown,
  FaFileWord,
  FaImage,
  FaKey,
  FaExchangeAlt,
  FaDollarSign,
  FaCheckSquare,
  FaYoutube,
  FaLanguage,
} from "react-icons/fa";

const navItems = [
  { href: "/", label: "Home", icon: FaHome },
  { href: "/pdf", label: "Image → PDF", icon: FaFilePdf },
  { href: "/json-formatter", label: "JSON Formatter", icon: FaCode },
  { href: "/image-compressor", label: "Image Compressor", icon: FaCompressAlt },
  { href: "/word-counter", label: "Word Counter", icon: FaSortNumericDown },
  { href: "/pdf-to-word", label: "PDF → Word", icon: FaFileWord },
  { href: "/remove-background", label: "Remove BG", icon: FaImage },
  { href: "/password-generator", label: "Password", icon: FaKey },
  { href: "/unit-converter", label: "Unit Converter", icon: FaExchangeAlt },
  { href: "/currency-converter", label: "Currency", icon: FaDollarSign },
  { href: "/playgrrism", label: "Plagiarism", icon: FaCheckSquare },
  { href: "/summariser", label: "YT Summariser", icon: FaYoutube },
  { href: "/translator", label: "Translator", icon: FaLanguage },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[72px] min-w-[72px] border-r border-gray-800 bg-black md:w-64 md:min-w-64 md:px-4">
      <div className="flex h-full flex-col">
        {/* Logo - icon only on mobile, full text on md+ */}
        <Link
          href="/"
          className="flex items-center justify-center px-2 py-5 md:justify-start md:px-4"
        >
          <span className="text-xl font-bold text-white md:text-2xl">
            <span className="md:hidden">B</span>
            <span className="hidden md:inline">Blaze</span>
            <span className="hidden md:inline md:text-[#64ffda]">AI</span>
          </span>
        </Link>

        {/* Nav - Twitter style vertical list */}
        <nav className="flex flex-1 flex-col gap-1 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-full px-3 py-3 text-left transition-colors md:px-4 ${
                  isActive
                    ? "font-bold text-[#64ffda]"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <Icon className="h-6 w-6 shrink-0 md:h-5 md:w-5" />
                <span className="hidden truncate md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom - Sign in style button */}
        <div className="p-3 md:p-4">
          <button className="w-full rounded-full bg-[#64ffda] py-2.5 font-bold text-black transition hover:bg-[#52e8d4] md:py-3">
            Sign in
          </button>
        </div>
      </div>
    </aside>
  );
}
