"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Loader2, User } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  message: string;
  rating: number;
  image_url: string;
  created_at: string;
}

export const Testimonials = () => {
  const [list, setList] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setList(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [list]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center bg-white">
        <Loader2 className="animate-spin text-[#15803d]" size={40} />
      </div>
    );
  }

  if (list.length === 0) return null;

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      {/* Subtle Background Pattern using Logo Blue */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#1E40AF 1px, transparent 1px)`, 
          backgroundSize: '30px 30px' 
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-[#1E40AF] mb-4">
            Client <span className="text-[#15803d]">Testimonials</span>
          </h2>
          <div className="h-1.5 w-24 bg-[#15803d] mx-auto mb-4"></div>
          <p className="text-slate-500 tracking-widest text-[15px] font-bold">
            What our partners say about Tihut Engineering
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={list[index].id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="bg-[#1E40AF] p-8 md:p-12 relative rounded-2xl shadow-2xl"
            >
              {/* Quote icon using Logo Green for accent */}
              <Quote className="absolute top-6 left-6 text-[#15803d]/20" size={60} />
              
              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`${i < (list[index].rating || 5) ? "text-[#15803d] fill-[#15803d]" : "text-blue-900"}`} 
                      size={18} 
                    />
                  ))}
                </div>
                
                <p className="text-lg md:text-2xl text-white italic leading-relaxed mb-10 font-medium">
                  &quot;{list[index].message}&quot;
                </p>

                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 border-t border-white/10 pt-10">
                  {/* Avatar with Logo Green Border */}
                  <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-full border-4 border-[#15803d] shadow-lg bg-blue-900">
                    {list[index].image_url ? (
                      <Image
                        src={list[index].image_url} 
                        alt={list[index].name} 
                        fill
                        sizes="(max-width: 768px) 112px, 128px"
                        priority
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="text-blue-300" size={56} />
                      </div>
                    )}
                  </div>

                  <div className="text-center md:text-left">
                    <h4 className="text-white font-black tracking-wider text-xl md:text-2xl">
                      {list[index].name}
                    </h4>
                    <p className="text-[#15803d] text-xs md:text-sm font-bold tracking-[0.25em] mt-2">
                      {list[index].position}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots using Logo Blue and Light Grey */}
          {list.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 transition-all rounded-full ${
                    index === i ? "bg-[#1E40AF] w-10" : "bg-slate-200 w-2"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};