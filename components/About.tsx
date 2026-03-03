"use client";

import React from 'react';
import { Award, Users, Target, History, Shield } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="pt-20 bg-white">
      {/* --- HEADER SECTION --- */}
      {/* Grid removed for a clean, solid white professional look */}
      <section className="relative py-24 overflow-hidden bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl text-[#1E40AF] font-black uppercase mb-6">
              Our <span className="text-[#15803d]">Story</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
              Building Ethiopia&apos;s landmarks with a vision for sustainable growth, world-class precision, and engineering excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- MISSION & VISION SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase text-[#1E40AF]">
                  Who We <span className="text-[#15803d]">Are</span>
                </h2>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Tihut Engineering is a premier engineering and construction firm based in Addis Ababa. We are dedicated to transforming the Ethiopian landscape through infrastructure that balances modern innovation with traditional integrity.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Our success is built on a foundation of humility, safety, and a relentless pursuit of quality. We don&apos;t just build structures; we build the future of our communities with precision and care.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-6 bg-white shadow-xl border-t-4 border-[#15803d] rounded-sm">
                  <Target className="text-[#1E40AF] mb-4" size={32} />
                  <h4 className="font-black uppercase text-[#1E40AF] mb-2">Our Mission</h4>
                  <p className="text-sm text-slate-500 font-medium">To deliver superior construction services through innovation, humility, and sustainable engineering practices.</p>
                </div>
                <div className="p-6 bg-white shadow-xl border-t-4 border-[#1E40AF] rounded-sm">
                  <Award className="text-[#15803d] mb-4" size={32} />
                  <h4 className="font-black uppercase text-[#1E40AF] mb-2">Our Vision</h4>
                  <p className="text-sm text-slate-500 font-medium">To be the most trusted construction partner in Ethiopia, recognized for excellence, reliability, and character.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Decorative Frame using Logo Green */}
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[#15803d] z-0 hidden md:block"></div>
              <div className="relative z-10 overflow-hidden shadow-2xl rounded-sm aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000" 
                  alt="Tihut Engineering Construction Team" 
                  fill
                  className="hover:scale-105 transition-transform duration-700 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES SECTION --- */}
      <section className="py-24 bg-slate-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase text-[#1E40AF] mb-4">Our Core Values</h2>
            <div className="h-1.5 w-24 bg-[#15803d] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Integrity", desc: "Honesty and transparency in every contract and calculation." },
              { icon: Users, title: "Humility", desc: "Approaching every challenge with a listening ear and a servant's heart." },
              { icon: Target, title: "Precision", desc: "Unyielding attention to detail in every measurement and milestone." },
              { icon: History, title: "Sustainability", desc: "Building resilient structures for future Ethiopian generations." }
            ].map((value, i) => (
              <div key={i} className="group text-center p-8 bg-white shadow-md hover:shadow-xl transition-all duration-300 border-b-4 border-transparent hover:border-[#15803d]">
                <div className="w-16 h-16 bg-[#1E40AF]/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#1E40AF] transition-colors">
                  <value.icon className="text-[#1E40AF] group-hover:text-white transition-colors" size={28} />
                </div>
                <h4 className="font-black uppercase text-[#1E40AF] mb-3">{value.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}