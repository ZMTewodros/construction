import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

const FooterLogo = () => (
  <span className="flex items-center bg-white rounded-md shadow-sm py-2 pl-3 pr-6 space-x-4">
    {/* SVG icon */}
    <span className="flex-none flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        width={64}
        height={64}
        className="block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue 't' part */}
        <rect x="18" y="10" width="9" height="70" fill="#1E40AF" />
        <rect x="8" y="25" width="42" height="9" fill="#1E40AF" />
        <rect x="18" y="71" width="28" height="9" fill="#1E40AF" />
        
        {/* Grey 'h' part */}
        <rect x="58" y="45" width="9" height="35" fill="#64748B" />
        <rect x="32" y="45" width="35" height="9" fill="#64748B" />
      </svg>
    </span>
    {/* Texts */}
    <span className="flex flex-col justify-center leading-tight">
      <span className="text-[#64748B] font-bold text-lg md:text-xl tracking-tight">
        ትሑት ኢንጅነሪንግ
      </span>
      <span className="text-[#1E40AF] font-bold text-lg md:text-2xl -mt-1 tracking-tighter" style={{ fontFamily: 'Arial Black, sans-serif' }}>
        TIHUT ENGINEERING
      </span>
      <span className="italic text-[#15803d] text-[11px] md:text-[13px] mt-1 font-serif -ms-20">
        Engineering with humility
      </span>
    </span>
  </span>
);

const Footer = () => {
  return (
    <footer className="bg-[#ea580c] text-white pt-20 pb-10 border-t border-orange-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <FooterLogo />
          </Link>
          <p className="text-orange-50 text-sm leading-relaxed max-w-xs font-medium">
            Building Ethiopia&apos;s future with humility, integrity, and world-class engineering precision.
          </p>
          <div className="flex space-x-4">
            <Facebook size={20} className="text-white hover:text-[#1E40AF] transition-colors cursor-pointer" />
            <Twitter size={20} className="text-white hover:text-[#1E40AF] transition-colors cursor-pointer" />
            <Linkedin size={20} className="text-white hover:text-[#1E40AF] transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-white border-b-2 border-[#1E40AF] w-fit pb-1">
            Navigation
          </h4>
          <ul className="space-y-4 text-orange-100 text-sm font-medium">
            <li><Link href="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">Home</Link></li>
            <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">About Us</Link></li>
            <li><Link href="/services" className="hover:text-white hover:translate-x-1 transition-all inline-block">Services</Link></li>
            <li><Link href="/projects" className="hover:text-white hover:translate-x-1 transition-all inline-block">Our Projects</Link></li>
            <li><Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact</Link></li>
          </ul>
        </div>

        {/* Expertise */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-white border-b-2 border-[#1E40AF] w-fit pb-1">
            Expertise
          </h4>
          <ul className="space-y-4 text-orange-100 text-sm font-medium">
            <li className="hover:text-white cursor-default">General Contractor</li>
            <li className="hover:text-white cursor-default">Wholesale</li>
            <li className="hover:text-white cursor-default">Landscape Architecture</li>
            <li className="hover:text-white cursor-default">Finishing Work</li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-white border-b-2 border-[#1E40AF] w-fit pb-1">
            Get In Touch
          </h4>
          <ul className="space-y-4 text-orange-100 text-sm font-medium">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-[#1E40AF] shrink-0 mt-0.5 bg-white rounded-full p-0.5"/> 
              <span>Addis Ababa, Ethiopia</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-[#1E40AF] shrink-0 bg-white rounded-full p-0.5"/> 
              <span>+251 966 858 982</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-[#1E40AF] shrink-0 bg-white rounded-full p-0.5"/> 
              <span className="break-all">Tihutengineering@Gmail.Com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-orange-200 text-[10px] uppercase tracking-widest mt-20 border-t border-orange-500/50 pt-8">
          &copy; {new Date().getFullYear()} Tihut Engineering. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;