"use client";

import React, { useState, useEffect, useCallback } from 'react';
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

  // Use useCallback to prevent unnecessary re-renders
  const fetchTestimonials = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) setLoading(true);

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // PGRST303 is the "JWT Expired" code
        if (error.code === 'PGRST303' && !isRetry) {
          console.warn("JWT Expired. Attempting silent refresh...");
          // Force the client to refresh the session
          const { error: refreshError } = await supabase.auth.getSession();
          if (!refreshError) {
            return fetchTestimonials(true); // Retry once with new token
          }
        }
        throw error;
      }

      if (data) setList(data);
    } catch (err: any) {
      console.error("Critical error fetching testimonials:", err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Carousel timer
  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, 8000); // Increased to 8s for readability
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
            TRUSTED BY LEADERS ACROSS THE INDUSTRY
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={list[index].id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-[#1E40AF] p-8 md:p-16 relative rounded-3xl shadow-2xl border border-white/5"
            >
              <Quote className="absolute top-8 left-8 text-[#15803d]/10" size={80} />
              
              <div className="relative z-10">
                <div className="flex mb-8 justify-center md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`${i < (list[index].rating || 5) ? "text-[#15803d] fill-[#15803d]" : "text-blue-900"}`} 
                      size={20} 
                    />
                  ))}
                </div>
                
                <p className="text-xl md:text-3xl text-white italic leading-relaxed mb-12 font-medium text-center md:text-left">
                  &quot;{list[index].message}&quot;
                </p>

                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 border-t border-white/10 pt-10">
                  <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-full border-4 border-[#15803d] bg-blue-900 shadow-xl">
                    {list[index].image_url ? (
                      <Image
                        src={list[index].image_url} 
                        alt={list[index].name} 
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="text-blue-300" size={40} />
                      </div>
                    )}
                  </div>

                  <div className="text-center md:text-left">
                    <h4 className="text-white font-black tracking-wider text-2xl">
                      {list[index].name}
                    </h4>
                    <p className="text-[#15803d] text-sm font-black uppercase tracking-[0.2em] mt-1">
                      {list[index].position}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          {list.length > 1 && (
            <div className="flex justify-center mt-12 space-x-4">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 transition-all duration-500 rounded-full ${
                    index === i ? "bg-[#1E40AF] w-12" : "bg-slate-200 w-3 hover:bg-slate-300"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};