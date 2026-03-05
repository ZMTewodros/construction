"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) router.push('/projects');
      else setProject(data);
      setLoading(false);
    }
    fetchProject();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1E40AF]" /></div>;

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-[#1E40AF] mb-8 font-bold uppercase text-[10px] tracking-widest transition-colors">
          <ArrowLeft size={16} /> Back to Portfolio
        </button>

        <h1 className="text-4xl md:text-6xl font-black text-[#1E40AF] uppercase mb-6">{project.title}</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100 mb-10">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
            <p className="text-sm font-bold text-slate-700">{project.location}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
            <p className="text-sm font-bold text-slate-700">{project.timeline}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
            <p className="text-sm font-bold text-[#15803D]">{project.category}</p>
          </div>
        </div>

        <div className="space-y-8">
          {project.image_urls.map((url: string, index: number) => (
            <div key={index} className="relative aspect-video w-full rounded-sm overflow-hidden shadow-xl">
              <Image src={url} alt={project.title} fill className="object-cover" />
            </div>
          ))}
          <div className="bg-slate-50 p-8 md:p-12 rounded-sm border-l-4 border-[#15803D]">
            <h3 className="text-lg font-black text-[#1E40AF] uppercase mb-4 tracking-tight">Project Overview</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{project.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}