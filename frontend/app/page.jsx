"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
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
  FaArrowRight,
  FaBolt,
} from "react-icons/fa";

const features = [
  { title: "Image → PDF", desc: "Turn images into one PDF in one click.", path: "/pdf", icon: FaFilePdf },
  { title: "JSON Formatter", desc: "Format, validate & minify JSON instantly.", path: "/json-formatter", icon: FaCode },
  { title: "Image Compressor", desc: "Shrink file size without losing quality.", path: "/image-compressor", icon: FaCompressAlt },
  { title: "Word Counter", desc: "Words, characters & lines in real time.", path: "/word-counter", icon: FaSortNumericDown },
  { title: "PDF → Word", desc: "Convert PDFs to editable Word docs.", path: "/pdf-to-word", icon: FaFileWord },
  { title: "Remove Background", desc: "Clean PNGs with transparent background.", path: "/remove-background", icon: FaImage },
  { title: "Password Generator", desc: "Strong, random passwords in one tap.", path: "/password-generator", icon: FaKey },
  { title: "Unit Converter", desc: "Length, weight & temperature.", path: "/unit-converter", icon: FaExchangeAlt },
  { title: "Currency Converter", desc: "Convert 30+ currencies with live rates.", path: "/currency-converter", icon: FaDollarSign },
  { title: "Plagiarism Check", desc: "Check text with AI-powered detection.", path: "/playgrrism", icon: FaCheckSquare },
  { title: "YT Summariser", desc: "Summarise YouTube videos in seconds.", path: "/summariser", icon: FaYoutube },
  { title: "Translator", desc: "Translate across languages.", path: "/translator", icon: FaLanguage },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="relative min-h-full w-full overflow-x-hidden">
      {/* Background: gradient + subtle grid */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 40%, transparent 70%, rgba(0,0,0,0.9) 100%),
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(100,255,218,0.12), transparent),
              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[88vh]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 rounded-full border border-[#64ffda]/30 bg-[#64ffda]/5 px-4 py-2 text-sm text-[#64ffda] backdrop-blur-sm"
        >
          <FaBolt className="text-xs" />
          <span>Free tools, no sign-up</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          All your productivity tools,{" "}
          <span className="bg-gradient-to-r from-[#64ffda] to-[#52e8d4] bg-clip-text text-transparent">
            one place
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl"
        >
          PDFs, images, JSON, passwords, units & more. Fast, simple, and free.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#tools"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#64ffda] px-8 py-4 font-semibold text-black shadow-lg shadow-[#64ffda]/20 transition hover:bg-[#52e8d4] hover:shadow-[#64ffda]/30 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-offset-2 focus:ring-offset-black"
          >
            Explore tools
            <FaArrowRight className="text-sm transition group-hover:translate-x-1" />
          </a>
          <span className="text-sm text-gray-500">or pick from the sidebar →</span>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a
            href="#tools"
            className="flex flex-col items-center gap-2 text-gray-500 transition hover:text-gray-400"
            aria-label="Scroll to tools"
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="block h-6 w-5 rounded-full border-2 border-gray-500"
            />
          </a>
        </motion.div>
      </section>

      {/* Tools grid */}
      <section
        id="tools"
        className="relative z-10 scroll-mt-8 px-6 pb-24 pt-4 md:px-10 lg:px-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-6xl"
        >
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            Choose a tool
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-gray-400">
            Click any card to open the tool. No account needed.
          </p>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.path} variants={item}>
                  <Link
                    href={f.path}
                    className="group relative flex overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 p-6 transition duration-300 hover:border-[#64ffda]/40 hover:bg-gray-900 hover:shadow-lg hover:shadow-[#64ffda]/5 focus:outline-none focus:ring-2 focus:ring-[#64ffda]/50 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    <span className="absolute right-4 top-4 text-gray-600 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                      <FaArrowRight className="text-sm" />
                    </span>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#64ffda]/10 text-[#64ffda] transition group-hover:bg-[#64ffda]/20 group-hover:scale-105">
                      <Icon className="text-xl" />
                    </span>
                    <div className="ml-4 min-w-0 flex-1 pr-8">
                      <h3 className="font-semibold text-white group-hover:text-[#64ffda]">
                        {f.title}
                      </h3>
                      <p className="mt-1 text-sm leading-snug text-gray-400">
                        {f.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
