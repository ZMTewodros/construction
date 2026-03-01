// "use client";

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Star, Quote } from 'lucide-react';
// import Image from 'next/image';

// const testimonials = [
//   {
//     id: 1,
//     name: "Abebe Kebede",
//     role: "CEO, Addis Real Estate",
//     content: "Ethio Construction delivered our flagship office building ahead of schedule. Their attention to structural detail and finishing quality is unmatched in the region.",
//     rating: 5,
//     img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
//   },
//   {
//     id: 2,
//     name: "Sara Tadesse",
//     role: "Homeowner",
//     content: "Building my dream home was a stress-free experience thanks to their professional project management. They kept me informed at every stage.",
//     rating: 5,
//     img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
//   },
//   {
//     id: 3,
//     name: "Dawit Mengistu",
//     role: "Operations Manager, Adama Logistics",
//     content: "The warehouse facilities they built for us are robust and perfectly designed for our heavy machinery. A truly reliable partner.",
//     rating: 4,
//     img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
//   }
// ];

// export const Testimonials = () => {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % testimonials.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <section className="py-24 bg-white blueprint-bg overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-black uppercase text-navy mb-4">Client <span className="text-accent">Testimonials</span></h2>
//           <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">What our partners say about us</p>
//         </div>

//         <div className="relative max-w-4xl mx-auto">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -50 }}
//               transition={{ duration: 0.5 }}
//               className="bg-navy p-12 md:p-20 relative"
//             >
//               <Quote className="absolute top-10 left-10 text-accent/20" size={80} />
              
//               <div className="relative z-10">
//                 <div className="flex mb-6">
//                   {[...Array(testimonials[index].rating)].map((_, i) => (
//                     <Star key={i} className="text-accent fill-accent" size={20} />
//                   ))}
//                 </div>
                
//                 <p className="text-xl md:text-2xl text-white italic leading-relaxed mb-10">
//                   &quot;{testimonials[index].content}&quot;
//                 </p>

//                 <div className="flex items-center space-x-4">
//                   <Image
//                     src={testimonials[index].img} 
//                     alt={testimonials[index].name} 
//                     className="w-16 h-16 rounded-full border-2 border-accent object-cover"
//                     width={64}
//                     height={64}
//                   />
//                   <div>
//                     <h4 className="text-white font-black uppercase tracking-wider">{testimonials[index].name}</h4>
//                     <p className="text-accent text-xs font-bold uppercase tracking-widest">{testimonials[index].role}</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           {/* Dots */}
//           <div className="flex justify-center mt-10 space-x-2">
//             {testimonials.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setIndex(i)}
//                 className={`w-3 h-3 rounded-full transition-all ${
//                   index === i ? "bg-navy w-8" : "bg-gray-300"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };


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
        <Loader2 className="animate-spin text-[#F59E0B]" size={40} />
      </div>
    );
  }

  if (list.length === 0) return null;

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#0A192F 1px, transparent 1px)`, 
          backgroundSize: '30px 30px' 
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-[#0A192F] mb-4">
            Client <span className="text-[#F59E0B]">Testimonials</span>
          </h2>
          <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">
            What our partners say about Ethio Construction
          </p>
        </div>

        {/* COMPACT BLOCK SIZE: max-w-3xl instead of 4xl */}
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={list[index].id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="bg-[#0A192F] p-8 md:p-12 relative rounded-3xl shadow-2xl border border-white/5"
            >
              <Quote className="absolute top-6 left-6 text-[#F59E0B]/10" size={60} />
              
              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`${i < (list[index].rating || 5) ? "text-[#F59E0B] fill-[#F59E0B]" : "text-gray-600"}`} 
                      size={16} 
                    />
                  ))}
                </div>
                
                <p className="text-lg md:text-2xl text-white italic leading-relaxed mb-10 font-medium">
                  &quot;{list[index].message}&quot;
                </p>

                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 border-t border-white/10 pt-10">
                  {/* SIGNIFICANTLY INCREASED PHOTO SIZE: w-32 h-32 */}
                  <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-full border-4 border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-slate-800">
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
                        <User className="text-gray-400" size={56} />
                      </div>
                    )}
                  </div>

                  <div className="text-center md:text-left">
                    <h4 className="text-white font-black uppercase tracking-wider text-xl md:text-2xl">
                      {list[index].name}
                    </h4>
                    <p className="text-[#F59E0B] text-xs md:text-sm font-bold uppercase tracking-[0.25em] mt-2">
                      {list[index].position}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {list.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 transition-all rounded-full ${
                    index === i ? "bg-[#0A192F] w-10" : "bg-gray-200 w-2"
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