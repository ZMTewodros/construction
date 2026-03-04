'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "About Us",
    href: "/about",
    subLinks: [
      { name: "Company Profile", href: "/about" },
      { name: "Our Team", href: "/about/team" },
      { name: "Our Partners", href: "/about/partners" },
      { name: "HSE Policy", href: "/about/hse" },
      { name: "CSR Initiatives", href: "/about/csr" }
    ]
  },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Contact Us", href: "/contact" }
];

function LogoBlock() {
  return (
    <span className="flex items-center bg-white rounded-md shadow-sm py-2 pl-3 pr-6 space-x-4">
      <span className="flex-none flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          width={64}
          height={64}
          className="block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="18" y="10" width="9" height="70" fill="#1E40AF" />
          <rect x="8" y="25" width="42" height="9" fill="#1E40AF" />
          <rect x="18" y="71" width="28" height="9" fill="#1E40AF" />
          <rect x="58" y="45" width="9" height="35" fill="#64748B" />
          <rect x="32" y="45" width="35" height="9" fill="#64748B" />
        </svg>
      </span>
      <span className="flex flex-col justify-center leading-tight">
        <span className="text-[#64748B] font-bold text-lg md:text-xl font-ethiopic tracking-tight">
          ትሑት ኢንጅነሪንግ
        </span>
        <span className="text-[#1E40AF] font-bold text-lg md:text-2xl -mt-1 tracking-tighter" style={{ fontFamily: 'Arial Black, sans-serif' }}>
          TIHUT ENGINEERING
        </span>
        <span className="italic text-green-700 text-[11px] md:text-[13px] mt-1 font-serif -ml-20">
          Engineering with humility
        </span>
      </span>
    </span>
  );
}

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
        scrolled ? "bg-white py-3 shadow-xl" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="block" aria-label="Tihut Engineering Home">
          <LogoBlock />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => setHovered(link.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                href={link.href}
                className={`font-bold uppercase text-[12px] tracking-widest transition-all py-2 ${
                  scrolled
                    ? "text-[#1E40AF] hover:text-[#64748B]"
                    : "text-white hover:text-white/70"
                }`}
              >
                {link.name}
              </Link>

              {/* DROPDOWN - TRIGGERED BY HOVER */}
              <AnimatePresence>
                {link.subLinks && hovered === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-0 pt-2 w-64 z-[110]"
                  >
                    <div className="bg-white shadow-2xl border-t-4 border-[#1E40AF] flex flex-col py-3">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="px-6 py-3 text-[#1E40AF] hover:bg-slate-50 text-[11px] font-bold uppercase tracking-widest transition-colors border-b border-slate-50 last:border-0"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className={`${scrolled ? "text-[#1E40AF]" : "text-white"} lg:hidden`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
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
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col space-y-3">
                  <Link
                    href={link.href}
                    onClick={() => !link.subLinks && setIsOpen(false)}
                    className="text-[#1E40AF] text-base font-bold uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                  {link.subLinks && (
                    <div className="flex flex-col space-y-4 ml-4 border-l-2 border-slate-200 pl-4 py-1">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-[#1E40AF]"
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