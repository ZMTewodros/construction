"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Partner {
  id: string;
  logo_url: string;
}

export default function OurPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('partners')
          .select('id, logo_url')
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        if (data) setPartners(data);
      } catch (err) {
        console.error("Error fetching partners:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#1E40AF]" size={48} />
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-4"
        >
          <h1 className="text-sm md:text-xl font-black tracking-[0.4em] text-[#15803D] uppercase">
            Professional Network
          </h1>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-[#1E40AF] tracking-tighter mb-6 uppercase">
          Our Trusted <span className="text-[#15803D]">Clients & Partners</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          Tihut Engineering collaborates with industry leaders and local stakeholders 
          to deliver excellence across every project we undertake in Ethiopia.
        </p>
        <div className="w-24 h-1.5 bg-[#15803D] mx-auto mt-10"></div>
      </section>

      {/* LOGO GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6">
        {partners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partners.map((partner) => (
              <motion.div 
                key={partner.id} 
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl flex items-center justify-center h-48 transition-all group"
              >
                <div className="relative w-full h-full">
                  <Image 
                    src={partner.logo_url} 
                    alt="Tihut Partner Logo" 
                    fill 
                    className="object-contain transition-transform duration-500 group-hover:scale-110" 
                    unoptimized // Crucial for keeping original quality from Supabase storage
                    priority
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No partners registered yet.</p>
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-32">
        <div className="bg-[#1E40AF] rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#15803D] rounded-full -mr-16 -mt-16 opacity-20"></div>
          <h3 className="text-xl md:text-3xl font-black mb-6 relative z-10 uppercase">Become a Partner</h3>
          <p className="text-blue-100 mb-10 text-lg relative z-10">
            Join our network of excellence and help us build the foundations of Ethiopia together.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#15803D] hover:bg-white hover:text-[#1E40AF] text-white font-bold uppercase transition-all rounded-sm relative z-10"
          >
            Contact Us <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}