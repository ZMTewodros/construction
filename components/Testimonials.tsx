"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Abebe Kebede",
    role: "CEO, Addis Real Estate",
    content: "Ethio Construction delivered our flagship office building ahead of schedule. Their attention to structural detail and finishing quality is unmatched in the region.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "Sara Tadesse",
    role: "Homeowner",
    content: "Building my dream home was a stress-free experience thanks to their professional project management. They kept me informed at every stage.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 3,
    name: "Dawit Mengistu",
    role: "Operations Manager, Adama Logistics",
    content: "The warehouse facilities they built for us are robust and perfectly designed for our heavy machinery. A truly reliable partner.",
    rating: 4,
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  }
];

export const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-white blueprint-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase text-navy mb-4">Client <span className="text-accent">Testimonials</span></h2>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">What our partners say about us</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-navy p-12 md:p-20 relative"
            >
              <Quote className="absolute top-10 left-10 text-accent/20" size={80} />
              
              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(testimonials[index].rating)].map((_, i) => (
                    <Star key={i} className="text-accent fill-accent" size={20} />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-white italic leading-relaxed mb-10">
                  &quot;{testimonials[index].content}&quot;
                </p>

                <div className="flex items-center space-x-4">
                  <Image
                    src={testimonials[index].img} 
                    alt={testimonials[index].name} 
                    className="w-16 h-16 rounded-full border-2 border-accent object-cover"
                    width={64}
                    height={64}
                  />
                  <div>
                    <h4 className="text-white font-black uppercase tracking-wider">{testimonials[index].name}</h4>
                    <p className="text-accent text-xs font-bold uppercase tracking-widest">{testimonials[index].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center mt-10 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === i ? "bg-navy w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
