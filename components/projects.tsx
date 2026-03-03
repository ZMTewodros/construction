// "use client";

// import React, { useState, Suspense } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MapPin, Clock, ArrowRight, Calendar } from 'lucide-react';
// import Image from 'next/image';
// import { useSearchParams } from 'next/navigation';

// const projects = [
//   {
//     id: 1,
//     title: "Addis Sky Tower",
//     category: "Commercial",
//     location: "Addis Ababa",
//     timeline: "24 Months",
//     summary: "A 30-story mixed-use commercial building featuring state-of-the-art office spaces and retail floors.",
//     beforeImg: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800",
//     afterImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     id: 2,
    
//     title: "Unity Residential Estate",
//     category: "Residential",
//     location: "Bishoftu",
//     timeline: "18 Months",
//     summary: "A luxury gated community consisting of 50 high-end villas with sustainable landscaping.",
//     beforeImg: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
//     afterImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     id: 3,
//     title: "Industrial Hub Phase I",
//     category: "Industrial",
//     location: "Adama",
//     timeline: "12 Months",
//     summary: "Construction of three large-scale manufacturing warehouses with specialized loading docks.",
//     beforeImg: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800",
//     afterImg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     id: 4,
//     title: "National Bank Annex",
//     category: "Commercial",
//     location: "Addis Ababa",
//     timeline: "30 Months",
//     summary: "A modern extension to the national bank headquarters with high-security infrastructure.",
//     beforeImg: "https://images.unsplash.com/photo-1590674867551-11c3a2e92583?auto=format&fit=crop&q=80&w=800",
//     afterImg: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800",
//   },
 
// ];

// const categories = ["All", "Residential", "Commercial", "Industrial"];

// function ProjectContent() {
//   const searchParams = useSearchParams();
//   const categoryParam = searchParams.get('category');
  
//   // Initialize state directly from URL to avoid cascading renders
//   const [activeCategory, setActiveCategory] = useState(() => {
//     if (categoryParam && categories.includes(categoryParam)) {
//       return categoryParam;
//     }
//     return "All";
//   });
  
//   const [hoveredProject, setHoveredProject] = useState<number | null>(null);

//   const filteredProjects = activeCategory === "All" 
//     ? projects 
//     : projects.filter(p => p.category === activeCategory);

//   return (
//     <div className="pt-20">
//       {/* Header */}
//       <section className="bg-[#0A192F] py-24 relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-6 relative z-10">
//           <h1 className="text-5xl md:text-6xl text-white font-black uppercase mb-6">
//             Our <span className="text-[#F59E0B]">Portfolio</span>
//           </h1>
//           <p className="text-xl text-gray-400 max-w-2xl">
//             A showcase of our commitment to quality and architectural excellence across Ethiopia.
//           </p>
//         </div>
//       </section>

//       {/* Filters */}
//       <section className="py-12 bg-gray-50 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex flex-wrap gap-4">
//             {categories.map(cat => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveCategory(cat)}
//                 className={`px-6 py-2 cursor-pointer font-bold uppercase text-xs tracking-widest transition-all ${
//                   activeCategory === cat 
//                     ? "bg-[#0A192F] text-white shadow-lg" 
//                     : "bg-white text-[#0A192F] hover:bg-gray-100 border border-gray-200"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Gallery */}
//       <section className="py-24 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
//             <AnimatePresence mode="popLayout">
//               {filteredProjects.map((project) => (
//                 <motion.div
//                   key={project.id}
//                   layout
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   className="space-y-8"
//                 >
//                   <div 
//                     className="relative aspect-video overflow-hidden group cursor-pointer"
//                     onMouseEnter={() => setHoveredProject(project.id)}
//                     onMouseLeave={() => setHoveredProject(null)}
//                   >
//                     <Image 
//                       src={project.afterImg} 
//                       alt={project.title} 
//                       fill
//                       className="object-cover"
//                     />
//                     <motion.div 
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
//                       className="absolute inset-0 z-10"
//                     >
//                       <Image 
//                         src={project.beforeImg} 
//                         alt="Before" 
//                         fill
//                         className="object-cover"
//                       />
//                       <div className="absolute top-4 left-4 bg-[#0A192F] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
//                         Before Construction
//                       </div>
//                     </motion.div>
//                     <div className="absolute top-4 right-4 bg-[#F59E0B] text-[#0A192F] px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-20">
//                       {project.category}
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex justify-between items-start">
//                       <h3 className="text-3xl font-black uppercase text-[#0A192F]">{project.title}</h3>
//                       <div className="flex items-center text-[#F59E0B]">
//                         <MapPin size={18} className="mr-2" />
//                         <span className="text-xs font-bold uppercase tracking-widest">{project.location}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex space-x-8 py-4 border-y border-gray-100">
//                       <div className="flex items-center">
//                         <Clock size={18} className="text-[#0A192F] mr-2" />
//                         <span className="text-xs font-bold uppercase text-gray-500">{project.timeline}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Calendar size={18} className="text-[#0A192F] mr-2" />
//                         <span className="text-xs font-bold uppercase text-gray-500">Completed 2023</span>
//                       </div>
//                     </div>

//                     <p className="text-gray-600 leading-relaxed">{project.summary}</p>

//                     <button className="flex items-center gap-2 text-[#0A192F] font-black uppercase text-xs tracking-widest hover:text-[#F59E0B] transition-colors">
//                       View Case Study <ArrowRight size={16} />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default function ProjectsPage() {
//   return (
//     <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Projects...</div>}>
//       <ProjectContent />
//     </Suspense>
//   );
// }

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Calendar, Loader2 } from 'lucide-react';
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

// Updated categories to match your new services hierarchy
const categories = [
  "All", 
  "GC", 
  "Wholesale", 
  "Landscape", 
  "Finishing", 
  "Residential", 
  "Commercial", 
  "Industrial", 
  "Infrastructure"
];

// Map URL query params to the Display Names above
const categoryMap: Record<string, string> = {
  gc: "GC",
  wholesale: "Wholesale",
  landscape: "Landscape",
  finishing: "Finishing",
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  civil: "Infrastructure",
};

function ProjectContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Set initial category from URL or default to "All"
  const [activeCategory, setActiveCategory] = useState(
    categoryParam && categoryMap[categoryParam] ? categoryMap[categoryParam] : "All"
  );
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    async function getProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    }
    getProjects();
  }, []);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="pt-20">
      {/* Header - Using Logo Blue */}
      <section className="bg-[#1E40AF] py-24 relative overflow-hidden">
        {/* Decorative background element with Logo Green */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#15803d]/10 skew-x-12 transform translate-x-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-6xl text-white font-black uppercase mb-6">
              Our <span className="text-[#15803d]">Portfolio</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl font-medium">
              A real-time showcase of our architectural excellence and engineering precision across Ethiopia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-white border-b border-gray-100 sticky top-[80px] z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 cursor-pointer font-bold uppercase text-[10px] tracking-widest transition-all duration-300 rounded-sm ${
                  activeCategory === cat 
                    ? "bg-[#1E40AF] text-white shadow-lg translate-y-[-2px]" 
                    : "bg-gray-50 text-[#1E40AF] hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#1E40AF]">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-bold uppercase tracking-widest text-xs">Accessing Database...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest">No {activeCategory} projects to display yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group"
                  >
                    {/* Image Container */}
                    <div 
                      className="relative aspect-video overflow-hidden cursor-pointer bg-gray-100 border border-gray-100 rounded-sm"
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <Image 
                        src={project.image_urls?.[0] || 'https://via.placeholder.com/800x450?text=Tihut+Engineering'} 
                        alt={project.title} 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {project.image_urls?.length > 1 && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                          className="absolute inset-0 z-10"
                        >
                          <Image 
                            src={project.image_urls[1]} 
                            alt="Alternative view" 
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}

                      {/* Category Badge using Logo Green */}
                      <div className="absolute top-0 left-0 bg-[#15803d] text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] z-20">
                        {project.category}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="mt-8 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-3xl font-black uppercase text-[#1E40AF] leading-tight">
                          {project.title}
                        </h3>
                        <div className="flex items-center text-[#15803d] shrink-0">
                          <MapPin size={16} className="mr-1" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{project.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-6 py-4 border-y border-gray-100">
                        <div className="flex items-center">
                          <Clock size={16} className="text-[#1E40AF] mr-2" />
                          <span className="text-[10px] font-bold uppercase text-gray-500 tracking-tighter">{project.timeline}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={16} className="text-[#1E40AF] mr-2" />
                          <span className="text-[10px] font-bold uppercase text-gray-500 tracking-tighter">
                            Delivered {new Date(project.created_at).getFullYear()}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-600 leading-relaxed font-medium line-clamp-2">
                        {project.description}
                      </p>

                      <button className="inline-flex items-center gap-2 text-[#1E40AF] font-black uppercase text-[10px] tracking-[0.2em] group-hover:text-[#15803d] transition-colors">
                        View Full Case Study <ArrowRight size={14} />
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
    <Suspense fallback={
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#1E40AF] mb-4" size={48} />
        <div className="font-black uppercase tracking-[0.3em] text-[#1E40AF] text-xs">Initializing Portfolio</div>
      </div>
    }>
      <ProjectContent />
    </Suspense>
  );
}