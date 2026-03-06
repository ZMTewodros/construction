import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

const FooterLogo = () => (
  <span className="flex items-center bg-white rounded shadow-sm py-1 pl-1.5 pr-3 space-x-2">
    <span className="flex-none flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        width={32}
        height={32}
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
      <span className="text-[#64748B] font-bold text-[10px] tracking-tight uppercase">
        ትሑት ኢንጅነሪንግ
      </span>
      <span className="text-[#1E40AF] font-black text-xs -mt-0.5 tracking-tighter">
        TIHUT ENGINEERING
      </span>
    </span>
  </span>
);

const Footer = () => {
  return (
    // Background set to Orange with reduced padding
    <footer className="bg-[#EA580C] text-white py-8 border-t border-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Brand Column */}
        <div className="space-y-3">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <FooterLogo />
          </Link>
          <p className="text-orange-50 text-[10px] leading-relaxed max-w-xs font-medium">
            Building Ethiopia&apos;s future with humility, integrity, and world-class engineering.
          </p>
          <div className="flex space-x-3 pt-1">
            <Facebook size={14} className="text-white hover:text-blue-800 transition-colors cursor-pointer" />
            <Twitter size={14} className="text-white hover:text-blue-800 transition-colors cursor-pointer" />
            <Linkedin size={14} className="text-white hover:text-blue-800 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-orange-200">
            Links
          </h4>
          <ul className="space-y-1.5 text-white text-[11px] font-medium">
            <li><Link href="/" className="hover:text-orange-200 transition-colors">Home</Link></li>
            <li><Link href="/services" className="hover:text-orange-200 transition-colors">Services</Link></li>
            <li><Link href="/projects" className="hover:text-orange-200 transition-colors">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-orange-200 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Expertise */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-orange-200">
            Expertise
          </h4>
          <ul className="space-y-1.5 text-white text-[11px] font-medium">
            <li className="cursor-default">General Contractor</li>
            <li className="cursor-default">Wholesales</li>
            <li className="cursor-default">Landscape Architecture</li>
            <li className="cursor-default">Finishing Work</li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-orange-200">
            Contact
          </h4>
          <ul className="space-y-2 text-white text-[11px] font-medium">
            <li className="flex items-center space-x-2">
              <MapPin size={12} className="text-white opacity-80"/> 
              <span>Addis Ababa, Ethiopia</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={12} className="text-white opacity-80"/> 
              <span>+251 966 858 982</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={12} className="text-white opacity-80"/> 
              <span className="truncate">tihutengineering@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-orange-100 text-[8px] uppercase tracking-[0.3em] mt-8 border-t border-orange-400/30 pt-4">
          &copy; {new Date().getFullYear()} Tihut Engineering.
        </div>
      </div>
    </footer>
  );
};

export default Footer;