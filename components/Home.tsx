"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Shield, Clock, Award, 
  CheckCircle2, Loader2, Heart, ChevronLeft, ChevronRight, MapPin 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  image_urls: string[];
  category: string;
  description: string;
  location?: string;
}

interface Partner {
  id: string;
  logo_url: string;
}

/**
 * Reusable Project Image Slider
 */
function ProjectImageSlider({ images, title }: { images: string[], title: string }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % (images?.length || 1));

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [images, paginate]);

  if (!images || images.length === 0) {
    return <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold uppercase text-xs">No Image Available</div>;
  }

  return (
    <div className="relative w-full h-full group/slider overflow-hidden bg-slate-900">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction < 0 ? 100 : -100 }}
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          className="absolute inset-0"
        >
          <Image src={images[imageIndex]} alt={title} fill className="object-cover" unoptimized />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>(['/assets/hero-bg.jpg']);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const [projectsRes, settingsRes, partnersRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(4),
          supabase.from('site_settings').select('hero_images').eq('id', 1).single(),
          supabase.from('partners').select('id, logo_url').order('created_at', { ascending: true })
        ]);

        if (projectsRes.data) setLatestProjects(projectsRes.data);
        if (partnersRes.data) setPartners(partnersRes.data);
        if (settingsRes.data?.hero_images?.length > 0) setHeroImages(settingsRes.data.hero_images);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, [heroImages]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#1E40AF]" size={48} />
    </div>
  );

  return (
    <div className="overflow-hidden bg-white">
     {/* HERO SECTION */}
<section className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center bg-[#0A192F] pt-20">
  {/* Background Images */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.div
        key={heroImages[currentSlide]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <Image src={heroImages[currentSlide]} alt="Hero" fill priority className="object-cover" unoptimized />
      </motion.div>
    </AnimatePresence>
  </div>

  {/* 1. Centered Content (The Text) */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
    <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[1.1] mb-6">
      Engineering <br className="hidden md:block"/><span className="text-[#15803D]">Legacy</span> in Ethiopia
    </h1>
  </div>

  {/* 2. Bottom-Aligned Stats (Moved outside the text div, kept inside the section) */}
  <div className="absolute bottom-0 right-0 z-20 bg-white p-6 md:p-12 grid grid-cols-3 md:flex gap-6 md:gap-12 shadow-2xl">
    <div>
      <div className="text-2xl md:text-5xl font-black text-[#1E40AF]">4+</div>
      <div className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Years</div>
    </div>
    <div>
      <div className="text-2xl md:text-5xl font-black text-[#1E40AF]">100+</div>
      <div className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Projects Done</div>
    </div>
    <div>
      <div className="text-2xl md:text-5xl font-black text-[#1E40AF]">90+</div>
      <div className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Happy Clients</div>
    </div>
  </div>
</section>

      {/* THE TIHUT STANDARD */}
<section className="py-20 md:py-32 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h3 className="text-[10px] md:text-xs font-black tracking-[0.4em] text-[#15803D] mb-3 uppercase">
        Our Commitment
      </h3>
      <h2 className="text-4xl md:text-6xl font-black text-[#1E40AF] uppercase tracking-tighter">
        The <span className="text-[#15803D]">Tihut</span> Standard
      </h2>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-0">
      {[
        { 
          icon: Shield, 
          title: "Safety", 
          desc: "Zero compromise on site security." 
        },
        { 
          icon: Clock, 
          title: "On-Time", 
          desc: "Strict adherence to project timelines." 
        },
        { 
          icon: Award, 
          title: "Quality", 
          desc: "International grade materials & methods." 
        },
        { 
          icon: CheckCircle2, 
          title: "Expertise", 
          desc: "World-class engineering solutions." 
        },
        { 
          icon: Heart, 
          title: "Humility", 
          desc: "Service-driven professional approach." 
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -5 }}
          className="group relative p-8 flex flex-col items-center justify-center text-center bg-slate-50 border-b-4 border-transparent hover:border-[#15803D] hover:bg-white hover:shadow-xl transition-all duration-300"
        >
          <div className="mb-6 p-4 rounded-full bg-white group-hover:bg-[#1E40AF]/5 transition-colors">
            <item.icon className="text-[#1E40AF] group-hover:scale-110 transition-transform duration-300" size={32} />
          </div>
          <h4 className="font-black text-sm uppercase tracking-widest text-black mb-2">
            {item.title}
          </h4>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
            {item.desc}
          </p>
          
          {/* Decorative Corner Element matching the logo style */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-200 group-hover:border-[#15803D]" />
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* CLIENTS & PARTNERS - RESTORED TO PARTNER PAGE STYLE */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-[10px] md:text-xs font-black tracking-[0.4em] text-[#15803D] mb-3 uppercase">Professional Network</h3>
            <h2 className="text-3xl md:text-5xl font-black text-[#1E40AF] tracking-tighter uppercase">Our Clients & <span className="text-[#15803D]">Partners</span></h2>
          </div>

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
                    alt="Partner Logo" 
                    fill 
                    className="object-contain transition-transform duration-500 group-hover:scale-110" 
                    unoptimized 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST PROJECTS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-[#1E40AF] uppercase tracking-tighter">Latest <span className="text-[#15803D]">Projects</span></h2>
            <Link href="/projects" className="px-8 py-4 bg-white border-2 border-[#1E40AF] text-[#1E40AF] font-black uppercase text-xs hover:bg-[#1E40AF] hover:text-white transition-all flex items-center gap-2">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {latestProjects.map((project) => (
              <div key={project.id} className="group bg-white rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div className="relative aspect-video">
                  <ProjectImageSlider images={project.image_urls} title={project.title} />
                </div>
                <div className="p-10">
                  <h3 className="text-2xl md:text-3xl font-black text-[#1E40AF] uppercase tracking-tighter mb-4 group-hover:text-[#15803D] transition-colors">{project.title}</h3>
                  <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-2 text-[#1E40AF] font-black uppercase text-[10px] tracking-widest">
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}