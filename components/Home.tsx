"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export default function Home() {
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, image_urls, category, description')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          if (error.message.includes("JWT")) {
            await supabase.auth.signOut();
            window.location.reload(); 
          }
          throw error;
        }
        setLatestProjects(data || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  return (
    <div className="overflow-hidden bg-white">
      {/* --- HERO SECTION --- */}
      {/* Changed bg to dark slate to prevent light leakage behind the image */}
      <section className="relative min-h-screen flex flex-col justify-center bg-[#0A192F]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero-bg.jpg"
            alt="Tihut Engineering Hero"
            fill
            priority
            className="object-cover opacity-50" // Reduced opacity to blend with dark background
          />
          {/* CLEAN GRADIENT: 
              Removed the white/40 overlay that was making the background look 'milky'.
              Now using a brand blue gradient that ensures white text is readable.
          */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E40AF] via-[#1E40AF]/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-40 pb-12 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-7xl :text-9xl text-white font-black leading-[1.1] mb-6 tracking-tighter">
              Building the 
              Foundations
              of Ethiopia
            </h1>
            
            <p className="text-lg md:text-xl text-blue-50 mb-10 leading-relaxed max-w-2xl font-medium opacity-90">
              Tihut Engineering delivers world-class infrastructure and commercial spaces with humility, reliability, and precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#15803D] text-white font-bold uppercase tracking-wider hover:bg-[#1E40AF] transition-all shadow-xl">
                Contact Us <ArrowRight size={20} />
              </Link>
              <Link href="/services" className="border-2 border-white/30 text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-[#1E40AF] transition-all text-center backdrop-blur-md">
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>

        {/* --- STATS STRIP --- */}
        <div className="relative lg:absolute bottom-0 right-0 z-20 w-full lg:w-auto bg-white grid grid-cols-3 lg:flex p-6 lg:p-12 gap-4 lg:gap-12 shadow-2xl border-t lg:border-t-0 lg:border-l border-slate-100">
          <div className="text-center lg:text-left">
            <div className="text-2xl md:text-3xl lg:text-5xl font-black text-[#1E40AF]">4+</div>
            <div className="text-slate-500 text-[8px] lg:text-[10px] font-bold tracking-widest uppercase leading-tight">Years Experience</div>
          </div>
          <div className="text-center lg:text-left border-x border-slate-100 lg:border-none px-4">
            <div className="text-2xl md:text-3xl lg:text-5xl font-black text-[#1E40AF]">100+</div>
            <div className="text-slate-500 text-[8px] lg:text-[10px] font-bold tracking-widest uppercase leading-tight">Projects Done</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-2xl md:text-4xl lg:text-5xl font-black text-[#1E40AF]">90+</div>
            <div className="text-slate-500 text-[8px] lg:text-[10px] font-bold tracking-widest uppercase leading-tight">Happy Clients</div>
          </div>
        </div>
      </section>

      {/* --- RELIABILITY SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden shadow-2xl z-10 rounded-sm">
                <Image
                  src="/assets/hero-bg.jpg" 
                  alt="Construction Quality" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#1E40AF] z-0 opacity-10"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-4 border-[#15803D] z-0"></div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-black text-[#1E40AF] tracking-tight">
                The <span className="text-[#15803D]">Tihut</span> Standard
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">
                With a proven track record across Ethiopia, Tihut Engineering combines technical expertise with humility to deliver projects that stand the test of time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "Safety First", desc: "Zero-accident policy." },
                  { icon: Clock, title: "On-Time", desc: "Respecting timelines." },
                  { icon: Award, title: "Quality", desc: "International standards." },
                  { icon: CheckCircle2, title: "Expert Team", desc: "Top-tier engineers." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 p-5 bg-slate-50 border-b-4 border-[#15803D] transition-transform hover:-translate-y-1">
                    <item.icon className="text-[#1E40AF]" size={24} />
                    <div>
                      <h4 className="font-bold text-[#1E40AF] uppercase text-xs tracking-wider">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-bold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST PROJECTS SECTION --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-5xl font-black mb-4 text-[#1E40AF] tracking-tight">
                Latest <span className="text-[#15803D]">Projects</span>
              </h2>
              <p className="text-slate-500 text-sm lg:text-lg font-medium">Discover our recently completed architectural landmarks.</p>
            </div>
            <Link href="/projects" className="w-full lg:w-auto text-center px-8 py-3 border-2 border-[#1E40AF] text-[#1E40AF] font-bold uppercase tracking-widest hover:bg-[#1E40AF] hover:text-white transition-all text-sm">
              View All Projects
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#1E40AF]" size={48} />
            </div>
          ) : latestProjects.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest">No projects found in database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestProjects.map((project) => (
                <div key={project.id} className="group relative h-[500px] overflow-hidden shadow-lg bg-white rounded-sm">
                  <Image
                    src={project.image_urls?.[0] || '/assets/hero-bg.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Updated overlay for project cards to be more dramatic */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent opacity-90"></div>
                  
                  <div className="absolute top-6 left-6 bg-[#15803D] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-20">
                    {project.category}
                  </div>

                  <div className="absolute bottom-0 left-0 p-8 w-full translate-y-6 group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <h3 className="text-2xl font-black uppercase mb-2 text-white leading-tight">{project.title}</h3>
                    <p className="text-xs text-blue-50/80 mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {project.description}
                    </p>
                    <Link href={`/projects/${project.id}`} className="text-[#15803D] font-bold uppercase text-[11px] tracking-widest flex items-center gap-2 group/link">
                      View Project <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}