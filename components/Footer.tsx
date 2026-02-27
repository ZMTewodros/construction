import React from 'react';
import Link from 'next/link';
import { HardHat, Phone, Mail, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A192F] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-white/10 p-2 rounded-sm">
              <HardHat className="text-[#F59E0B] w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">
              Ethio<span className="text-[#F59E0B]">Construction</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Building Ethiopia&apos;s future with integrity, quality, and innovation.
          </p>
          <div className="flex space-x-4">
            <Facebook size={20} className="hover:text-[#F59E0B] cursor-pointer" />
            <Twitter size={20} className="hover:text-[#F59E0B] cursor-pointer" />
            <Linkedin size={20} className="hover:text-[#F59E0B] cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold uppercase tracking-wider mb-6 border-b border-[#F59E0B] w-fit pb-2">Quick Links</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/projects" className="hover:text-white">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold uppercase tracking-wider mb-6 border-b border-[#F59E0B] w-fit pb-2">Services</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>Residential</li>
            <li>Commercial</li>
            <li>Industrial</li>
            <li>Project Management</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold uppercase tracking-wider mb-6 border-b border-[#F59E0B] w-fit pb-2">Contact</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-center space-x-3"><MapPin size={18} className="text-[#F59E0B]"/> <span>Addis Ababa, Ethiopia</span></li>
            <li className="flex items-center space-x-3"><Phone size={18} className="text-[#F59E0B]"/> <span>+251 11 123 4567</span></li>
            <li className="flex items-center space-x-3"><Mail size={18} className="text-[#F59E0B]"/> <span>info@ethioconstruction.com</span></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-20 border-t border-white/10 pt-8">
        &copy; {new Date().getFullYear()} Ethio Construction.
      </div>
    </footer>
  );
};

export default Footer;