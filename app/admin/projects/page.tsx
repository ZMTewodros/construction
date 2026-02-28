"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, X, Loader2, Edit3, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  category: string;
  location: string;
  timeline: string;
  created_at?: string;
}

const CATEGORIES = ["Residential", "Commercial", "Industrial", "Infrastructure"];

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form States
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Commercial');
  const [location, setLocation] = useState('');
  const [timeline, setTimeline] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setFetching(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching projects:", error);
    else setProjects(data || []);
    setFetching(false);
  }

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDesc('');
    setCategory('Commercial');
    setLocation('');
    setTimeline('');
    setExistingUrls([]);
    setFiles([]);
    setIsFormOpen(true);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDesc(project.description);
    setCategory(project.category || 'Commercial');
    setLocation(project.location || '');
    setTimeline(project.timeline || '');
    setExistingUrls(project.image_urls || []);
    setFiles([]);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 && existingUrls.length === 0) return alert("Please select an image.");
    setLoading(true);

    try {
      const newUploadedUrls = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const path = `projects/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('assets').upload(path, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('assets').getPublicUrl(path);
        newUploadedUrls.push(urlData.publicUrl);
      }

      const finalImageUrls = [...existingUrls, ...newUploadedUrls];
      const projectData = { 
        title, 
        description: desc, 
        image_urls: finalImageUrls,
        category,
        location,
        timeline
      };

      if (editingId) {
        await supabase.from('projects').update(projectData).eq('id', editingId);
      } else {
        await supabase.from('projects').insert([projectData]);
      }

      setIsFormOpen(false);
      fetchProjects();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  async function deleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) fetchProjects();
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-4 lg:p-8 lg:ml-64 font-sans">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0A192F] uppercase tracking-tight">Project Library</h1>
          <p className="text-gray-400 text-sm font-medium">Manage and showcase your architectural excellence</p>
        </div>
        <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:bg-[#1D4ED8] active:scale-95">
          <Plus size={20} /> Add New Project
        </button>
      </div>

      {/* GRID - Optimized spacing and card size */}
      <div className="max-w-7xl mx-auto">
        {fetching ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                
                {/* Image Section - Height increased for better visibility */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  {proj.image_urls?.[0] ? (
                    <Image 
                      src={proj.image_urls[0]} 
                      alt={proj.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={48} /></div>
                  )}
                  
                  {/* Category Overlay */}
                  <div className="absolute top-4 left-4 bg-[#0A192F]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] shadow-xl">
                    {proj.category}
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => startEdit(proj)} className="p-2.5 bg-white/90 backdrop-blur-md text-blue-600 hover:bg-blue-600 hover:text-white rounded-full shadow-lg transition-all"><Edit3 size={18} /></button>
                    <button onClick={() => deleteProject(proj.id)} className="p-2.5 bg-white/90 backdrop-blur-md text-red-600 hover:bg-red-600 hover:text-white rounded-full shadow-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>

                {/* Content Section - Increased text size */}
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <h3 className="font-black text-[#0A192F] text-xl uppercase tracking-tight mb-3 truncate group-hover:text-blue-600 transition-colors">
                    {proj.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm italic leading-relaxed line-clamp-3">
                    &quot;{proj.description}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL - Architectural Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A192F]/70 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-[#0A192F] uppercase tracking-widest">{editingId ? "Update Project" : "New Project Section"}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
              <div>
                <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest block mb-2">Project Name</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium" placeholder="e.g. LUXURY APARTMENT COMPLEX" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest block mb-2">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none appearance-none font-medium">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest block mb-2">Site Location</label>
                  <input required value={location} onChange={e => setLocation(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-medium" placeholder="e.g. Addis Ababa" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest block mb-2">Execution Period</label>
                <input required value={timeline} onChange={e => setTimeline(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-medium" placeholder="e.g. 24 Months" />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest block mb-2">Project Details</label>
                <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none resize-none font-medium" placeholder="Describe the design language and technical scope..." />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest block mb-3">Project Images</label>
                <div className="flex flex-wrap gap-4">
                  {existingUrls.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <Image src={url} alt="Gallery" fill className="object-cover opacity-60" />
                      <button type="button" onClick={() => setExistingUrls(existingUrls.filter(u => u !== url))} className="absolute inset-0 flex items-center justify-center bg-red-600/40 text-white opacity-0 hover:opacity-100 transition-opacity"><Trash2 size={20} /></button>
                    </div>
                  ))}
                  {files.map((file, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-500 shadow-md">
                      <Image src={URL.createObjectURL(file)} alt="New" fill className="object-cover" />
                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-bl-lg"><X size={14}/></button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                    <Plus size={24} />
                    <input type="file" multiple className="hidden" onChange={e => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} accept="image/*" />
                  </label>
                </div>
              </div>

              <button disabled={loading} className="w-full bg-[#0A192F] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 transition-all disabled:opacity-50 shadow-2xl shadow-blue-900/20">
                {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : (editingId ? "Save Changes" : "Publish Project")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}