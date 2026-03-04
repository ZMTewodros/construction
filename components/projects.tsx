"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Calendar, Loader2, ChevronDown, Search, X, Filter } from 'lucide-react';
import Image from 'next/image';
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

function ProjectContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // Mobile dropdown state
  const [activeCategory, setActiveCategory] = useState(categoryParam && categoryMap[categoryParam] ? categoryMap[categoryParam] : "All");
  
  const [sortOrder, setSortOrder] = useState<'Latest' | 'Oldest'>('Latest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function getProjects() {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*');
      if (!error) setProjects(data || []);
      setLoading(false);
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
    <div className="pt-20">
      {/* Header - Styled like image_451c88.jpg */}
      <section className="bg-[#1E40AF] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#15803d]/10 skew-x-12 transform translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-6xl text-white font-black uppercase mb-6 leading-tight">
              Our <span className="text-[#15803d]">Portfolio</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl font-medium">
              A real-time showcase of our architectural excellence and engineering precision across Ethiopia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation & Controls */}
      <section className="bg-white border-b border-gray-100 sticky top-[72px] md:top-[80px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6">
          <div className="space-y-4 md:space-y-6">
            
            {/* 1. Category View Switcher */}
            {/* DESKTOP: Buttons (Hidden on Mobile) */}
            <div className="hidden md:flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 font-bold uppercase text-[9px] tracking-[0.15em] transition-all duration-300 rounded-sm border ${
                    activeCategory === cat 
                    ? "bg-[#1E40AF] text-white border-[#1E40AF] shadow-md" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#1E40AF] hover:text-[#1E40AF]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* MOBILE: Dropdown (Hidden on Desktop) */}
            <div className="md:hidden relative">
              <button 
                onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsSortOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm font-black uppercase text-[10px] tracking-widest text-[#1E40AF]"
              >
                <span className="flex items-center gap-2"><Filter size={14} /> Sector: {activeCategory}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl z-50 max-h-64 overflow-y-auto rounded-sm"
                  >
                    {categories.map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => { setActiveCategory(cat); setIsCategoryOpen(false); }}
                        className={`w-full text-left px-5 py-3 text-[10px] font-bold uppercase border-b border-gray-50 last:border-0 ${activeCategory === cat ? 'bg-blue-50 text-[#1E40AF]' : 'text-gray-600'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Search & Sort Row */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="SEARCH PROJECTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 py-3 pl-10 pr-10 rounded-sm text-[10px] font-black tracking-widest outline-none focus:border-[#1E40AF]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="relative md:min-w-[180px]">
                <button 
                  onClick={() => { setIsSortOpen(!isSortOpen); setIsCategoryOpen(false); }}
                  className="w-full flex items-center justify-between px-5 py-3 bg-white border border-gray-200 rounded-sm font-black uppercase text-[10px] tracking-[0.15em] text-[#1E40AF]"
                >
                  <span>Sort: {sortOrder}</span>
                  <ChevronDown size={14} className={isSortOpen ? 'rotate-180' : ''} />
                </button>
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-0 left-0 mt-2 bg-white border border-gray-100 shadow-2xl z-50 overflow-hidden rounded-sm">
                      {['Latest First', 'Oldest First'].map((order) => (
                        <button key={order} onClick={() => { setSortOrder(order as 'Latest' | 'Oldest'); setIsSortOpen(false); }} className="w-full text-left px-5 py-3 text-[12px] font-bold  hover:bg-blue-50 text-gray-600 hover:text-[#1E40AF]">
                          {order}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-[#1E40AF]">
               <Loader2 className="animate-spin mb-4" size={40} />
               <p className="font-black uppercase tracking-widest text-[10px]">Updating Portfolio...</p>
             </div>
          ) : processedProjects.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No matching projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-20">
              <AnimatePresence mode="popLayout">
                {processedProjects.map((project) => (
                  <motion.div key={project.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="group">
                    {/* Image Container */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100 border border-gray-100 rounded-sm shadow-sm">
                      <Image src={project.image_urls?.[0] || 'https://via.placeholder.com/800x450'} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-0 left-0 bg-[#15803d] text-white px-3 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] z-20">
                        {project.category}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center text-[#15803d]">
                          <MapPin size={12} className="mr-1" />
                          <span className="text-[9px] font-black uppercase tracking-widest">{project.location}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black uppercase text-[#1E40AF] leading-tight tracking-tighter">{project.title}</h3>
                      </div>
                      
                      <div className="flex space-x-4 md:space-x-6 py-3 md:py-4 border-y border-gray-100 text-gray-500">
                        <div className="flex items-center"><Clock size={14} className="text-[#1E40AF] mr-1.5" /><span className="text-[9px] font-bold uppercase tracking-tighter">{project.timeline}</span></div>
                        <div className="flex items-center"><Calendar size={14} className="text-[#1E40AF] mr-1.5" /><span className="text-[9px] font-bold uppercase tracking-tighter">{new Date(project.created_at).getFullYear()}</span></div>
                      </div>

                      <p className="text-slate-600 leading-relaxed font-medium line-clamp-2 text-xs md:text-sm">{project.description}</p>

                      <button className="inline-flex items-center gap-2 text-[#1E40AF] font-black uppercase text-[10px] tracking-[0.2em] group-hover:text-[#15803d] transition-colors pt-1">
                        View Case Study <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1E40AF]" size={40} /></div>}>
      <ProjectContent />
    </Suspense>
  );
}