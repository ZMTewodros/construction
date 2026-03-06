"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, MapPin, Calendar, Clock, LayoutGrid, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Fetch error:", error);
        router.push('/projects');
      } else {
        setProject(data);
      }
    } catch (err) {
      console.error("System error:", err);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Infinite Auto-play Timer
  useEffect(() => {
    if (!project?.image_urls || project.image_urls.length <= 1) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % project.image_urls.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [project]);

  const paginate = (newDirection: number) => {
    const images = project?.image_urls || [];
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#1E40AF] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Tihut Project</p>
      </div>
    );
  }

  if (!project) return null;

  const images = project.image_urls || [];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen overflow-hidden">
      {/* 1. HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-30">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-slate-500 hover:text-[#1E40AF] mb-10 font-black uppercase text-[11px] tracking-[0.25em] transition-all"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Portfolio
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-12 bg-[#15803D]" />
            <span className="text-[10px] font-black text-[#15803D] uppercase tracking-[0.4em]">
              Featured Project
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-[#1E40AF] uppercase leading-[0.85] tracking-tighter mb-4">
            {project.title}
          </h1>
        </motion.div>
      </div>

      {/* 2. SLIDING IMAGE GALLERY - DECREASED HEIGHT */}
      <section className="py-4 bg-slate-50 border-y border-slate-100 relative group z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden rounded-3xl shadow-2xl bg-slate-200">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 }
                }}
                className="absolute inset-0"
              >
                <Image 
                  src={images[currentIndex]} 
                  alt={`${project.title} - image`} 
                  fill 
                  className="object-cover"
                  unoptimized
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Manual Controls */}
            <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => paginate(-1)}
                className="p-4 bg-white/90 rounded-full text-[#1E40AF] hover:bg-[#15803D] hover:text-white transition-all shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => paginate(1)}
                className="p-4 bg-white/90 rounded-full text-[#1E40AF] hover:bg-[#15803D] hover:text-white transition-all shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Counter Badge */}
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xl z-10">
              <p className="text-[10px] font-black text-[#1E40AF] uppercase tracking-widest">
                {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-6">
            {images.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  currentIndex === i ? "bg-[#1E40AF] w-12" : "bg-slate-200 w-4"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. TECHNICAL SPECS */}
      <div className="bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-[#15803D] uppercase tracking-widest">
                <MapPin size={14} /> Location
              </div>
              <p className="text-xl font-black text-slate-800 uppercase tracking-tighter">{project.location}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-[#15803D] uppercase tracking-widest">
                <Clock size={14} /> Duration
              </div>
              <p className="text-xl font-black text-slate-800 uppercase tracking-tighter">{project.timeline}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-[#15803D] uppercase tracking-widest">
                <Calendar size={14} /> Completion
              </div>
              <p className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                {new Date(project.created_at).getFullYear()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-[#15803D] uppercase tracking-widest">
                <LayoutGrid size={14} /> Category
              </div>
              <p className="text-xl font-black text-[#1E40AF] uppercase tracking-tighter">{project.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CONTENT & CTA */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-black text-[#1E40AF] uppercase mb-8 tracking-tighter flex items-center gap-4">
              Project Brief <span className="h-[2px] flex-1 bg-slate-100" />
            </h3>
            <p className="text-slate-600 text-xl leading-relaxed whitespace-pre-line font-medium italic">
              {project.description}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-[#1E40AF] p-10 md:p-14 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CheckCircle2 size={160} />
              </div>

              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#15803D] mb-4">Tihut Engineering</h4>
              <h3 className="text-3xl md:text-4xl font-black uppercase leading-tight mb-8 tracking-tighter">
                Let&apos;s build your next vision together.
              </h3>
              
              <button 
                onClick={() => router.push('/contact')}
                className="group w-full py-5 bg-white text-[#1E40AF] font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-[#15803D] hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 relative z-10"
              >
                Contact us for inquiries
                <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  ); 
}