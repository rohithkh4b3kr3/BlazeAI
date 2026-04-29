import { FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black py-8 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
        <h2 className="text-xl font-bold">
          Blaze<span className="text-[#64ffda]">AI</span>
        </h2>
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
          <p className="text-sm text-gray-400">Subscribe for updates</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="rounded-l-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-[#64ffda]"
            />
            <button className="rounded-r-lg bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700">
              Subscribe
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6">
        
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} BlazeAI</p>
        </div>
      </div>
    </footer>
  );
}
