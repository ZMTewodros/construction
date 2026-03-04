"use client";
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, X, Loader2, Edit3, Image as ImageIcon, Search, CheckSquare, Check, AlertCircle, MapPin } from 'lucide-react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

// --- TYPES ---
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

const CATEGORIES = ["GC", "Wholesale", "Landscape", "Finishing", "Residential", "Commercial", "Industrial", "Infrastructure"];

// --- COMPONENTS ---
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className="fixed top-6 right-6 z-[300] flex items-center gap-3 bg-[#0A192F] text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-white/10 animate-in slide-in-from-right-10">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
    </div>
    <p className="text-xs font-black uppercase tracking-widest">{message}</p>
    <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white transition-colors">
      <X size={16} />
    </button>
  </div>
);

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Filter, Search & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState(''); // NEW: Location search state
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Commercial');
  const [location, setLocation] = useState('');
  const [timeline, setTimeline] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // UPDATED: Filter logic to include Location
  const filteredProjects = useMemo(() => {
    let result = [...projects];
    
    // Category Filter
    if (activeFilter !== 'All') result = result.filter(p => p.category === activeFilter);
    
    // Title Search
    if (searchQuery.trim() !== '') {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Location Search (NEW)
    if (locationQuery.trim() !== '') {
      result = result.filter(p => p.location.toLowerCase().includes(locationQuery.toLowerCase()));
    }
    
    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [projects, activeFilter, searchQuery, locationQuery, sortBy]);

  async function fetchProjects() {
    setFetching(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error) setProjects(data || []);
    setFetching(false);
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map(p => p.id));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  async function handleBulkDelete() {
    if (!confirm(`Permanently delete ${selectedIds.length} projects?`)) return;
    setLoading(true);
    const { error } = await supabase.from('projects').delete().in('id', selectedIds);
    if (!error) {
      setToast({ message: "Projects deleted successfully", type: 'success' });
      setSelectedIds([]);
      setIsSelectMode(false);
      fetchProjects();
    } else {
      setToast({ message: error.message, type: 'error' });
    }
    setLoading(false);
  }

  const openAddModal = () => {
    setEditingId(null); setTitle(''); setDesc(''); setCategory('Commercial'); setLocation(''); setTimeline(''); setExistingUrls([]); setFiles([]);
    setIsFormOpen(true);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id); setTitle(project.title); setDesc(project.description); setCategory(project.category || 'Commercial');
    setLocation(project.location || ''); setTimeline(project.timeline || ''); setExistingUrls(project.image_urls || []); setFiles([]);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUploadedUrls = [];
      const compressionOptions = { maxSizeMB: 0.8, maxWidthOrHeight: 1920, useWebWorker: true };

      for (const file of files) {
        const compressedFile = await imageCompression(file, compressionOptions);
        const fileExt = file.name.split('.').pop();
        const path = `projects/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('assets').upload(path, compressedFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('assets').getPublicUrl(path);
        newUploadedUrls.push(urlData.publicUrl);
      }

      const finalImageUrls = [...existingUrls, ...newUploadedUrls];
      const projectData = { title, description: desc, image_urls: finalImageUrls, category, location, timeline };
      
      let error;
      if (editingId) {
        const { error: updateError } = await supabase.from('projects').update(projectData).eq('id', editingId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('projects').insert([projectData]);
        error = insertError;
      }

      if (error) throw error;
      setToast({ message: `Project ${editingId ? 'updated' : 'published'} successfully!`, type: 'success' });
      setIsFormOpen(false);
      fetchProjects();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-4 lg:p-8 lg:ml-64 font-sans relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-[#0A192F] uppercase tracking-tight">Project Library</h1>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Portfolio Control Center</p>
      </div>

      {/* STICKY ACTION BAR - UPDATED WITH LOCATION SEARCH */}
      <div className="sticky top-4 z-[100] max-w-7xl mx-auto mb-10 space-y-4">
        <div className="bg-white p-2 rounded-2xl shadow-xl border-2 border-gray-200 flex flex-col xl:flex-row gap-2">
          
          {/* Title Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Title..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 bg-transparent outline-none font-bold text-xs uppercase tracking-tight text-[#0A192F]" 
            />
          </div>

          <div className="hidden xl:block w-[2px] bg-gray-100 my-2"></div>

          {/* Location Search (NEW) */}
          <div className="relative flex-grow">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
            <input 
              type="text" 
              placeholder="Filter by Location..." 
              value={locationQuery} 
              onChange={(e) => setLocationQuery(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 bg-transparent outline-none font-bold text-xs uppercase tracking-tight text-[#0A192F]" 
            />
          </div>

          <div className="hidden xl:block w-[2px] bg-gray-100 my-2"></div>

          <div className="flex divide-x-2 divide-gray-100">
            <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} className="bg-transparent px-4 py-3 font-black text-[10px] uppercase tracking-widest text-[#1E40AF] outline-none cursor-pointer">
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')} className="bg-transparent px-4 py-3 font-black text-[10px] uppercase tracking-widest text-slate-500 outline-none cursor-pointer">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isSelectMode && (
            <button onClick={openAddModal} className="flex items-center gap-2 bg-[#1E40AF] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all active:scale-95 border-b-4 border-blue-900">
              <Plus size={18} /> Add Project
            </button>
          )}
          <button onClick={() => { setIsSelectMode(!isSelectMode); setSelectedIds([]); }} className={`px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${isSelectMode ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}>
            {isSelectMode ? <X size={16}/> : <CheckSquare size={16}/>}
            {isSelectMode ? 'Cancel' : 'Bulk Select'}
          </button>
        </div>
      </div>

      {/* SELECT ALL AREA */}
      {isSelectMode && filteredProjects.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6 flex items-center gap-3 px-4 py-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <button onClick={handleSelectAll} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-700">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.length === filteredProjects.length ? 'bg-[#1E40AF] border-[#1E40AF]' : 'bg-white border-blue-300'}`}>
              {selectedIds.length === filteredProjects.length && <Check size={14} className="text-white" />}
            </div>
            Select All Visible ({filteredProjects.length})
          </button>
        </div>
      )}

      {/* PROJECT GRID */}
      <div className="max-w-7xl mx-auto pb-32">
        {fetching ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-32 text-center border-4 border-dashed border-gray-200 rounded-[40px] bg-white/50">
            <ImageIcon className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">No matches found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <div 
                key={proj.id} 
                onClick={() => isSelectMode && toggleSelection(proj.id)}
                className={`bg-white rounded-[32px] overflow-hidden border-2 flex flex-col group transition-all duration-500 relative 
                  ${isSelectMode ? 'cursor-pointer' : ''} 
                  ${selectedIds.includes(proj.id) ? 'border-blue-600 ring-8 ring-blue-50 shadow-2xl scale-[0.98]' : 'border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl'}`}
              >
                <div className="relative h-72 w-full overflow-hidden bg-gray-50">
                  {proj.image_urls?.[0] ? (
                    <Image src={proj.image_urls[0]} alt={proj.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={48} /></div>
                  )}
                  
                  <div className="absolute top-6 left-6 bg-white text-[#0A192F] px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-lg z-10 border border-gray-100">
                    {proj.category}
                  </div>

                  {isSelectMode && (
                    <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] flex items-start justify-end p-6 z-20">
                        <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shadow-2xl transition-all ${selectedIds.includes(proj.id) ? 'bg-blue-600 border-white rotate-0' : 'bg-white border-gray-200 rotate-45'}`}>
                          {selectedIds.includes(proj.id) && <Check size={20} className="text-white" />}
                        </div>
                    </div>
                  )}

                  {!isSelectMode && (
                    <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20">
                      <button onClick={(e) => { e.stopPropagation(); startEdit(proj); }} className="p-4 bg-white text-blue-600 rounded-2xl shadow-2xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={20} /></button>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h3 className="font-black text-[#0A192F] text-xl uppercase tracking-tighter mb-4 truncate">{proj.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
                      <MapPin size={12} /> {proj.location}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                      ⏱️ {proj.timeline}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BULK DELETE PANEL */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#0A192F] text-white px-10 py-6 rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center gap-8 border-2 border-white/10 animate-in fade-in slide-in-from-bottom-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Batch Control</span>
              <span className="text-sm font-bold">{selectedIds.length} Projects Selected</span>
            </div>
            <div className="h-10 w-[1px] bg-white/10"></div>
            <button 
                onClick={handleBulkDelete}
                disabled={loading}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 font-black uppercase text-xs tracking-widest transition-colors disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18}/>}
                Delete Permanently
            </button>
        </div>
      )}

      {/* MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A192F]/90 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-gray-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black text-[#0A192F] uppercase tracking-tighter">{editingId ? "Update Project" : "New Portfolio Piece"}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-3 hover:bg-gray-200 rounded-full transition-colors text-gray-400"><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2 block">Project Title</label>
                      <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2 block">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white font-bold appearance-none">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2 block">Location</label>
                      <input required value={location} onChange={e => setLocation(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2 block">Timeline</label>
                      <input required value={timeline} onChange={e => setTimeline(e.target.value)} placeholder="e.g. 2024 - 2026" className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none font-bold" />
                    </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2 block">Description</label>
                  <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={4} className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white resize-none outline-none font-medium" />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-4 block">Visual Media</label>
                  <div className="flex flex-wrap gap-4">
                      {existingUrls.map((url, i) => (
                          <div key={i} className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-gray-100 group">
                              <Image src={url} alt="existing" fill className="object-cover" />
                              <button type="button" onClick={() => setExistingUrls(existingUrls.filter(u => u !== url))} className="absolute inset-0 flex items-center justify-center bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={28}/></button>
                          </div>
                      ))}
                      
                      <label className="w-28 h-28 border-4 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-300 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-all gap-1">
                          <ImageIcon size={32} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Add Photo</span>
                          <input type="file" multiple className="hidden" onChange={e => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} accept="image/*" />
                      </label>
                  </div>
                  {files.length > 0 && <p className="mt-4 text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2"><Check size={14}/> {files.length} New files staged for optimization</p>}
                </div>

                <button disabled={loading} className="w-full bg-[#0A192F] text-white py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 shadow-2xl transition-all disabled:opacity-50 active:scale-95">
                    {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : (editingId ? "Save Changes" : "Publish Project")}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}