"use client";

import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Calendar, Loader2, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  category: string;
  location: string;
  timeline: string;
  created_at: string;
}

const categories = ["All", "GC", "Wholesale", "Landscape", "Finishing", "Residential", "Commercial", "Industrial", "Infrastructure"];

const categoryMap: Record<string, string> = {
  gc: "GC", wholesale: "Wholesale", landscape: "Landscape", finishing: "Finishing",
  residential: "Residential", commercial: "Commercial", industrial: "Industrial", civil: "Infrastructure",
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.1
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9
  })
};

/**
 * UPDATED: Auto-playing Carousel Slider
 */
function ProjectImageSlider({ images, title }: { images: string[], title: string }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % images.length);

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // Auto-play effect (Cycles every 5 seconds like Testimonials)
  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [images, paginate]);

  if (!images || images.length === 0) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image Available</div>;
  }

  return (
    <div className="relative w-full h-full group/slider overflow-hidden bg-slate-900">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 }
          }}
          className="absolute inset-0"
        >
          <Image 
            src={images[imageIndex]} 
            alt={`${title} - image ${imageIndex + 1}`} 
            fill 
            className="object-cover transition-transform duration-700 group-hover/slider:scale-105" 
            unoptimized
          />
          {/* Subtle overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); paginate(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md hover:bg-[#15803d] text-white p-2 rounded-full transition-all opacity-0 group-hover/slider:opacity-100 border border-white/30"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); paginate(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md hover:bg-[#15803d] text-white p-2 rounded-full transition-all opacity-0 group-hover/slider:opacity-100 border border-white/30"
          >
            <ChevronRight size={20} />
          </button>
          
          {/* Progress Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const dir = idx > imageIndex ? 1 : -1;
                  setPage([idx, dir]);
                }}
                className={`h-1 rounded-full transition-all duration-500 ${idx === imageIndex ? 'w-8 bg-[#15803d]' : 'w-2 bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam && categoryMap[categoryParam] ? categoryMap[categoryParam] : "All");
  const [sortOrder, setSortOrder] = useState<'Latest' | 'Oldest'>('Latest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function getProjects() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('projects').select('*');
        if (!error) setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    getProjects();
  }, []);

  const processedProjects = useMemo(() => {
    let result = [...projects];
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.location.toLowerCase().includes(query)
      );
    }
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'Latest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [projects, activeCategory, searchQuery, sortOrder]);

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#1E40AF] py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#15803d]/5 -skew-x-12 translate-x-32"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl text-white font-black uppercase mb-6 tracking-tighter">
              OUR <span className="text-[#15803d]">PORTFOLIO</span>
            </h1>
            <div className="h-2 w-24 bg-[#15803d] mb-8"></div>
            <p className="text-xl text-blue-100 max-w-2xl font-medium leading-relaxed">
              Excellence in Engineering and Construction. Explore our landmark projects shaping the landscape of Ethiopia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-[72px] md:top-[80px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            {/* Category Desktop */}
            <div className="hidden lg:flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 font-black uppercase text-[10px] tracking-widest transition-all rounded-full border-2 ${
                    activeCategory === cat 
                    ? "bg-[#1E40AF] text-white border-[#1E40AF]" 
                    : "bg-transparent text-slate-500 border-slate-100 hover:border-[#1E40AF] hover:text-[#1E40AF]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="SEARCH BY PROJECT NAME OR LOCATION..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 py-3.5 pl-12 pr-4 rounded-xl text-[11px] font-black tracking-widest outline-none focus:border-[#1E40AF] transition-all"
                />
              </div>

              <button 
                onClick={() => setSortOrder(sortOrder === 'Latest' ? 'Oldest' : 'Latest')}
                className="flex items-center justify-between px-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl font-black uppercase text-[11px] tracking-widest text-[#1E40AF] min-w-[180px]"
              >
                <span>SORT: {sortOrder}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${sortOrder === 'Oldest' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 text-[#1E40AF]">
               <Loader2 className="animate-spin mb-6" size={48} />
               <p className="font-black uppercase tracking-[0.3em] text-xs">Synchronizing Portfolio</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <AnimatePresence mode="popLayout">
                {processedProjects.map((project) => (
                  <motion.div 
                    key={project.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-2xl bg-white">
                      <ProjectImageSlider images={project.image_urls} title={project.title} />
                      
                      <div className="absolute top-6 left-6 bg-[#15803d] text-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] z-40 rounded-full shadow-lg">
                        {project.category}
                      </div>
                      
                      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-20"></Link>
                    </div>

                    <div className="mt-8 px-2">
                      <div className="flex items-center text-[#15803d] mb-3">
                        <MapPin size={14} className="mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{project.location}</span>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-black uppercase text-[#1E40AF] mb-6 tracking-tighter group-hover:text-[#15803d] transition-colors leading-none">
                        {project.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-6 py-5 border-y border-slate-200 text-slate-500 mb-6">
                        <div className="flex items-center">
                          <Clock size={16} className="text-[#1E40AF] mr-2" />
                          <span className="text-[11px] font-bold uppercase">{project.timeline}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={16} className="text-[#1E40AF] mr-2" />
                          <span className="text-[11px] font-bold uppercase">{new Date(project.created_at).getFullYear()} EST.</span>
                        </div>
                      </div>

                      <Link 
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center gap-3 text-[#1E40AF] font-black uppercase text-[11px] tracking-[0.25em] group-hover:gap-5 transition-all"
                      >
                        View Details <ArrowRight size={18} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {!loading && processedProjects.length === 0 && (
            <div className="text-center py-40 bg-white rounded-3xl border-2 border-dashed border-slate-200">
               <Search size={48} className="mx-auto mb-4 text-slate-300" />
               <p className="text-slate-500 font-bold uppercase tracking-widest">No matching projects found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1E40AF]" size={48} /></div>}>
      <ProjectContent />
    </Suspense>
  );
}