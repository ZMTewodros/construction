"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "About US",
    href: "/about",
    subLinks: [
      { name: "Company Profile", href: "/about" },
      { name: "Our Team", href: "/about/team" },
    ],
  },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Contact US", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
const [hovered, setHovered] = useState<string | null>(null);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? "bg-[#0D2447] py-4 shadow-2xl" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-[#C2912E] p-2 rounded-md shadow-lg group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <span className="text-[#C2912E] font-bold text-xl uppercase tracking-tight">
            Ethio Construction
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => setHovered(link.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                href={link.href}
                className="text-white/90 hover:text-[#C2912E] font-semibold uppercase text-[11px] tracking-widest transition-all"
              >
                {link.name}
              </Link>

              {/* OVID STYLE DROPDOWN */}
              {link.subLinks && (
                <AnimatePresence>
                  {hovered === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.25 }}
                      className="absolute left-0 mt-6 w-60 bg-[#1c1c1c] shadow-2xl"
                    >
                      <div className="flex flex-col py-6 px-8 space-y-6">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="text-white/70 hover:text-white text-[11px] uppercase tracking-widest transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#0D2447] border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-8 space-y-6">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col space-y-3">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-white text-base font-bold uppercase tracking-widest hover:text-[#C2912E]"
                  >
                    {link.name}
                  </Link>

                  {link.subLinks && (
                    <div className="flex flex-col space-y-2 ml-4 border-l border-[#C2912E]/30 pl-4">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="text-white/50 text-xs font-bold uppercase tracking-widest hover:text-[#C2912E]"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}