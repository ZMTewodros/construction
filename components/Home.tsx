"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Clock, Award, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  image_urls: string[];
  category: string;
  description: string;
}

interface Partner {
  id: string;
  logo_url: string;
}

function PartnersSection({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-16">
          <h2 className="text-xs font-black tracking-[0.4em] text-[#15803D] mb-3 uppercase">Professional Network</h2>
          <p className="text-3xl md:text-5xl font-black text-[#1E40AF] tracking-tighter">Our Clients & Partners</p>
          <div className="w-20 h-1.5 bg-[#15803D] mx-auto mt-6"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {partners.map((partner) => (
            <motion.div 
              key={partner.id} 
              whileHover={{ y: -8 }}
              className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-2xl border border-slate-200/60 flex items-center justify-center h-40 transition-all group"
            >
              <div className="relative w-full h-full">
                <Image src={partner.logo_url} alt="Partner" fill className="object-contain" unoptimized />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
          supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('site_settings').select('hero_images').eq('id', 1).single(),
          supabase.from('partners').select('id, logo_url').order('created_at', { ascending: true })
        ]);

        if (projectsRes.data) setLatestProjects(projectsRes.data);
        if (partnersRes.data) setPartners(partnersRes.data);
        if (settingsRes.data?.hero_images && settingsRes.data.hero_images.length > 0) {
          setHeroImages(settingsRes.data.hero_images);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
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
      <section className="relative min-h-screen flex flex-col justify-center bg-[#0A192F]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroImages[currentSlide]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image 
                src={heroImages[currentSlide]} 
                alt={`Hero Slide ${currentSlide + 1}`} 
                fill 
                priority 
                className="object-cover" 
              />
            </motion.div>
          </AnimatePresence>
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/40 to-transparent z-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-40 pb-12 lg:pt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            {/* COLOR UPDATED: text-slate-400 (Metallic Grey) for a premium architectural look */}
            <h2 className="text-xl md:text-5xl font-black leading-[1.2] mb-6 tracking-tighter text-slate-400">
              Constructing Excellence Across Ethiopia
            </h2>
            <p className="text-lg md:text-xl text-blue-50 mb-10 max-w-2xl opacity-90">
              Tihut Engineering delivers world-class infrastructure with humility and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#15803D] text-white font-bold uppercase hover:bg-[#1E40AF] transition-all">
                Contact Us <ArrowRight size={20} />
              </Link>
              <Link href="/services" className="border-2 border-white/30 text-white px-8 py-4 font-bold uppercase hover:bg-white hover:text-[#1E40AF] transition-all text-center">
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="relative lg:absolute bottom-0 right-0 z-20 w-full lg:w-auto bg-white grid grid-cols-3 lg:flex p-6 lg:p-12 gap-4 lg:gap-12 shadow-2xl">
          <div><div className="text-2xl lg:text-5xl font-black text-[#1E40AF]">4+</div><div className="text-slate-500 text-[10px] font-bold uppercase">Years Experience</div></div>
          <div><div className="text-2xl lg:text-5xl font-black text-[#1E40AF]">100+</div><div className="text-slate-500 text-[10px] font-bold uppercase">Projects Done</div></div>
          <div><div className="text-2xl lg:text-5xl font-black text-[#1E40AF]">90+</div><div className="text-slate-500 text-[10px] font-bold uppercase">Happy Clients</div></div>
        </div>
      </section>

      {/* RELIABILITY SECTION */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="space-y-10">
            <h2 className="text-4xl lg:text-6xl font-black text-[#1E40AF] tracking-tight">
              The <span className="text-[#15803D]">Tihut</span> Standard
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium text-xl max-w-3xl mx-auto">
              With a proven track record across Ethiopia, Tihut Engineering combines technical expertise with humility to deliver projects that stand the test of time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
              {[
                { icon: Shield, title: "Safety First", desc: "Zero-accident policy." },
                { icon: Clock, title: "On-Time", desc: "Respecting timelines." },
                { icon: Award, title: "Quality", desc: "International standards." },
                { icon: CheckCircle2, title: "Expert Team", desc: "Top-tier engineers." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center p-8 bg-slate-50 border-b-4 border-[#15803D] hover:shadow-lg transition-all">
                  <item.icon className="text-[#1E40AF] mb-4" size={32} />
                  <h4 className="font-bold text-[#1E40AF] uppercase text-sm tracking-wider">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 font-bold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PartnersSection partners={partners} />

      {/* LATEST PROJECTS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-[#1E40AF]">Latest <span className="text-[#15803D]">Projects</span></h2>
            <Link href="/projects" className="px-8 py-3 border-2 border-[#1E40AF] text-[#1E40AF] font-bold uppercase hover:bg-[#1E40AF] hover:text-white transition-all">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestProjects.map((project) => (
              <div key={project.id} className="group relative h-[500px] overflow-hidden shadow-lg bg-white">
                <Image src={project.image_urls?.[0] || heroImages[0]} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-20">
                  <h3 className="text-2xl font-black uppercase text-white mb-4">{project.title}</h3>
                  <Link href={`/projects/${project.id}`} className="text-[#15803D] font-bold uppercase text-xs flex items-center gap-2">View Project <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}