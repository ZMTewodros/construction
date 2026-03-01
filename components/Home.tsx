// "use client";

// import React from 'react';
// import { motion } from 'framer-motion';
// import { ArrowRight, Shield, Clock, Award, CheckCircle2 } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';

// export default function Home() {
//   return (
//     <div className="overflow-hidden bg-white">
//       {/* --- HERO SECTION --- */}
//       <section className="relative min-h-screen flex flex-col justify-center">
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="https://images.unsplash.com/photo-1503387762-592dee58c160?q=80&w=2000&auto=format&fit=crop"
//             alt="Modern construction site"
//             fill
//             priority
//             className="object-cover"
//             onError={(e) => {
//               const target = e.target as HTMLImageElement;
//               target.style.display = 'none';
//             }}
//           />
//           <div className="absolute inset-0 bg-[#0A192F]/80 lg:bg-[#0A192F]/70 mix-blend-multiply"></div>
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-40 pb-12 lg:pt-0">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="max-w-4xl"
//           >
//             <div className="flex items-center space-x-3 mb-6">
//               <span className="text-grey uppercase tracking-[0.2em] lg:tracking-[0.3em] font-bold text-xs lg:text-sm pt-10">
//                 Excellence in Engineering
//               </span>
//             </div>
            
//             <h1 className="text-4xl md:text-6xl lg:text-5xl text-white font-black uppercase leading-[1.1] lg:leading-[0.9] mb-6">
//               Building the <br className="hidden sm:block" />
//               Foundations <br />
//               of Ethiopia
//             </h1>
            
//             <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
//               Ethio Construction delivers world-class infrastructure, residential landmarks, and commercial spaces with unmatched reliability and precision.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#F59E0B] text-[#0A192F] font-bold uppercase tracking-wider hover:bg-white transition-all text-sm lg:text-base">
//                 Request a Quote <ArrowRight size={20} />
//               </Link>
//               <Link href="/services" className="border-2 border-white text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-[#0A192F] transition-all text-sm lg:text-base text-center">
//                 Our Services
//               </Link>
//             </div>
//           </motion.div>
//         </div>

//         {/* --- STATS STRIP (Updated to White Background) --- */}
//         <div className="relative lg:absolute bottom-0 right-0 z-20 w-full lg:w-auto bg-white grid grid-cols-3 lg:flex p-6 lg:p-12 gap-4 lg:gap-12 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] border-t lg:border-t-0 lg:border-l border-gray-100">
//           <div className="text-center lg:text-left">
//             <div className="text-2xl md:text-3xl lg:text-5xl font-black text-[#F59E0B]">5+</div>
//             <div className="text-[#0A192F] uppercase text-[8px] lg:text-[10px] font-bold tracking-tighter lg:tracking-widest leading-tight">Years Experience</div>
//           </div>
//           <div className="hidden lg:block w-[1px] bg-gray-200 h-12 self-center"></div>
//           <div className="text-center lg:text-left border-x border-gray-100 lg:border-none">
//             <div className="text-2xl md:text-3xl lg:text-5xl font-black text-[#F59E0B]">100+</div>
//             <div className="text-[#0A192F] uppercase text-[8px] lg:text-[10px] font-bold tracking-tighter lg:tracking-widest leading-tight">Projects Done</div>
//           </div>
//           <div className="hidden lg:block w-[1px] bg-gray-200 h-12 self-center"></div>
//           <div className="text-center lg:text-left">
//             <div className="text-2xl md:text-3xl lg:text-5xl font-black text-[#F59E0B]">90+</div>
//             <div className="text-[#0A192F] uppercase text-[8px] lg:text-[10px] font-bold tracking-tighter lg:tracking-widest leading-tight">Happy Clients</div>
//           </div>
//         </div>
//       </section>

//       {/* --- WHY CHOOSE US SECTION --- */}
//       <section className="py-16 lg:py-24 relative bg-white">
//         <div className="max-w-7xl mx-auto px-6 relative z-10">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//             <div className="relative order-2 lg:order-1">
//               <div className="relative aspect-[4/3] w-full overflow-hidden shadow-2xl">
//                 <Image
//                   src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000" 
//                   alt="Our Work" 
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="absolute -top-4 -left-4 w-16 h-16 lg:w-32 lg:h-32 bg-[#F59E0B] -z-10"></div>
//               <div className="absolute -bottom-4 -right-4 w-16 h-16 lg:w-32 lg:h-32 border-4 border-[#0A192F] -z-10"></div>
//             </div>

//             <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
//               <div className="space-y-4">
//                 <h2 className="text-3xl lg:text-5xl font-black uppercase text-[#0A192F] leading-tight">
//                   Reliability is our <span className="text-[#F59E0B]">Blueprint</span>
//                 </h2>
//                 <p className="text-gray-600 text-sm lg:text-lg leading-relaxed">
//                   For over a decade, we have been at the forefront of the Ethiopian construction industry.
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
//                 {[
//                   { icon: Shield, title: "Safety First", desc: "Zero-accident policy." },
//                   { icon: Clock, title: "On-Time", desc: "Respecting timelines." },
//                   { icon: Award, title: "Quality", desc: "International standards." },
//                   { icon: CheckCircle2, title: "Expert Team", desc: "Top-tier engineers." },
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50 border-l-4 border-[#0A192F] shadow-sm">
//                     <item.icon className="text-[#F59E0B] shrink-0" size={24} />
//                     <div>
//                       <h4 className="font-bold text-[#0A192F] uppercase text-xs tracking-tight">{item.title}</h4>
//                       <p className="text-[10px] text-gray-500">{item.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- CORE EXPERTISE SECTION --- */}
//       <section className="py-16 lg:py-24 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
//             <div className="max-w-2xl">
//               <h2 className="text-3xl lg:text-5xl font-black uppercase mb-4 text-[#0A192F]">Our Core <span className="text-[#F59E0B]">Expertise</span></h2>
//               <p className="text-gray-500 text-sm lg:text-lg">Tailored solutions for the Ethiopian landscape.</p>
//             </div>
//             <Link href="/projects" className="w-full lg:w-auto text-center px-8 py-3 border-2 border-[#0A192F] text-[#0A192F] font-bold uppercase tracking-widest hover:bg-[#0A192F] hover:text-white transition-all text-sm">
//               View All Projects
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
//             {[
//               { title: "Residential", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", desc: "Luxury villas and modern complexes." },
//               { title: "Commercial", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", desc: "State-of-the-art office buildings." },
//               { title: "Industrial", img: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800", desc: "Robust industrial facilities." }
//             ].map((service, i) => (
//               <div key={i} className="group relative h-[350px] lg:h-[500px] overflow-hidden shadow-lg rounded-sm">
//                 <Image
//                   src={service.img}
//                   alt={service.title}
//                   fill
//                   className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-6 lg:p-8 w-full">
//                   <h3 className="text-2xl lg:text-3xl font-black uppercase mb-2 text-white">{service.title}</h3>
//                   <p className="text-xs lg:text-sm text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
//                     {service.desc}
//                   </p>
//                   <Link href={`/projects?category=${service.title}`} className="text-[#F59E0B] font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
//                     View Projects <ArrowRight size={12} />
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


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
        // Fetch only the needed columns for the home page cards
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, image_urls, category, description')
          .order('created_at', { ascending: false })
          .limit(3);

          if (error) {
        // If JWT is expired, sign out the user locally to clear the bad token
        if (error.message.includes("JWT")) {
          await supabase.auth.signOut();
          // Optionally reload to retry with Anon key
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
      <section className="relative min-h-screen flex flex-col justify-center">
        <div className="absolute inset-0 z-0 bg-[#0A192F]">
          <Image
            // Verified local path
            src="/assets/hero-bg.jpg"
            alt="Ethio Construction Hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0A192F]/80 lg:bg-[#0A192F]/70 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-40 pb-12 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-gray-400 uppercase tracking-[0.2em] lg:tracking-[0.3em] font-bold text-xs lg:text-sm">
                Excellence in Engineering
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-black uppercase leading-[1.1] lg:leading-[0.9] mb-6">
              Building the <br className="hidden sm:block" />
              Foundations <br />
              of Ethiopia
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              Ethio Construction delivers world-class infrastructure, residential landmarks, and commercial spaces with unmatched reliability and precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#F59E0B] text-[#0A192F] font-bold uppercase tracking-wider hover:bg-white transition-all text-sm lg:text-base">
                Request a Quote <ArrowRight size={20} />
              </Link>
              <Link href="/services" className="border-2 border-white text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-[#0A192F] transition-all text-sm lg:text-base text-center">
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>

        {/* --- STATS STRIP --- */}
        <div className="relative lg:absolute bottom-0 right-0 z-20 w-full lg:w-auto bg-white grid grid-cols-3 lg:flex p-6 lg:p-12 gap-4 lg:gap-12 shadow-2xl border-t lg:border-t-0 lg:border-l border-gray-100">
          <div className="text-center lg:text-left">
            <div className="text-2xl md:text-3xl lg:text-5xl font-black text-[#F59E0B]">5+</div>
            <div className="text-[#0A192F] uppercase text-[8px] lg:text-[10px] font-bold tracking-widest leading-tight">Years Experience</div>
          </div>
          <div className="text-center lg:text-left border-x border-gray-100 lg:border-none">
            <div className="text-2xl md:text-3xl lg:text-5xl font-black text-[#F59E0B]">100+</div>
            <div className="text-[#0A192F] uppercase text-[8px] lg:text-[10px] font-bold tracking-widest leading-tight">Projects Done</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-2xl md:text-3xl lg:text-5xl font-black text-[#F59E0B]">90+</div>
            <div className="text-[#0A192F] uppercase text-[8px] lg:text-[10px] font-bold tracking-widest leading-tight">Happy Clients</div>
          </div>
        </div>
      </section>

      {/* --- RELIABILITY SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden shadow-2xl z-10">
                <Image
                  src="/assets/hero-bg.jpg" 
                  alt="Construction Quality" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#F59E0B] z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-4 border-[#0A192F] z-0"></div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl lg:text-5xl font-black uppercase text-[#0A192F] leading-tight">
                Reliability is our <span className="text-[#F59E0B]">Blueprint</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                With a proven track record across Ethiopia, we combine technical expertise with local insight to deliver projects that stand the test of time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "Safety First", desc: "Zero-accident policy." },
                  { icon: Clock, title: "On-Time", desc: "Respecting timelines." },
                  { icon: Award, title: "Quality", desc: "International standards." },
                  { icon: CheckCircle2, title: "Expert Team", desc: "Top-tier engineers." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 p-5 bg-gray-50 shadow-sm border-l-4 border-[#0A192F]">
                    <item.icon className="text-[#F59E0B] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-[#0A192F] uppercase text-xs">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST PROJECTS SECTION --- */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-5xl font-black uppercase mb-4 text-[#0A192F]">
                Latest <span className="text-[#F59E0B]">Projects</span>
              </h2>
              <p className="text-gray-500 text-sm lg:text-lg">Discover our recently completed architectural landmarks.</p>
            </div>
            <Link href="/projects" className="w-full lg:w-auto text-center px-8 py-3 border-2 border-[#0A192F] text-[#0A192F] font-bold uppercase tracking-widest hover:bg-[#0A192F] hover:text-white transition-all text-sm">
              View All Projects
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#F59E0B]" size={48} />
            </div>
          ) : latestProjects.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-200">
               <p className="text-gray-400 font-bold uppercase tracking-widest">No projects found in database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestProjects.map((project) => (
                <div key={project.id} className="group relative h-[450px] overflow-hidden shadow-lg bg-white">
                  <Image
                    // Uses the first image from the array, or a placeholder if empty
                    src={project.image_urls?.[0] || '/assets/hero-bg.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent"></div>
                  
                  <div className="absolute top-6 left-6 bg-[#F59E0B] text-[#0A192F] px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-20">
                    {project.category}
                  </div>

                  <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <h3 className="text-2xl font-black uppercase mb-2 text-white">{project.title}</h3>
                    <p className="text-xs text-gray-300 mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.description}
                    </p>
                    <Link href={`/projects/${project.id}`} className="text-white font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 group/link">
                      View Details <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
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