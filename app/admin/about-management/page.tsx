"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, AlertCircle } from 'lucide-react';

export default function AboutManagement() {
  const [content, setContent] = useState<any>({ hse: null, csr: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('about_content').select('*');
      if (data) {
        const mapped = data.reduce((acc: any, item: any) => {
          acc[item.id] = item;
          return acc;
        }, {});
        setContent(mapped);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleUpdate = async (id: string) => {
    setSaving(id);
    const { error } = await supabase
      .from('about_content')
      .update({ 
        title: content[id].title, 
        description: content[id].description,
        updated_at: new Date() 
      })
      .eq('id', id);

    if (error) alert("Error: " + error.message);
    else alert(`${id.toUpperCase()} Page Updated!`);
    setSaving(null);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#1E40AF]" size={40} /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#1E40AF] uppercase tracking-tight">Manage About Content</h1>
        <p className="text-slate-500 text-sm">Edit the text that appears on your public HSE and CSR pages.</p>
      </div>
      
      {['hse', 'csr'].map((section) => (
        <div key={section} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-black uppercase text-[#15803D] tracking-widest">{section} Page Content</h2>
            {saving === section && <Loader2 className="animate-spin text-[#1E40AF]" size={16} />}
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Title</label>
              <input 
                type="text"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E40AF] outline-none transition-all"
                value={content[section]?.title || ''}
                onChange={(e) => setContent({...content, [section]: {...content[section], title: e.target.value}})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description / Intro Text</label>
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg h-32 focus:ring-2 focus:ring-[#1E40AF] outline-none transition-all"
                value={content[section]?.description || ''}
                onChange={(e) => setContent({...content, [section]: {...content[section], description: e.target.value}})}
              />
            </div>
            <button 
              onClick={() => handleUpdate(section)}
              disabled={saving !== null}
              className="flex items-center gap-2 px-6 py-3 bg-[#1E40AF] text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-[#15803D] transition-all disabled:opacity-50"
            >
              <Save size={16} /> Save {section.toUpperCase()} Changes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}