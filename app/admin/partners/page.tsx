'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Trash2, Upload, Plus } from 'lucide-react';
import Image from 'next/image';

export default function AdminPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  async function fetchPartners() {
    setLoading(true);
    const { data } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPartners(data);
    setLoading(false);
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a logo to upload");

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('partner-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(filePath);

      // Insert ONLY the logo_url (Name removed)
      const { error: dbError } = await supabase
        .from('partners')
        .insert([{ logo_url: publicUrl }]);

      if (dbError) throw dbError;

      setFile(null);
      fetchPartners();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const deletePartner = async (id: string, logoUrl: string) => {
    if (!confirm("Are you sure you want to delete this logo?")) return;

    try {
      // Extract the filename from the URL to delete from storage
      const urlParts = logoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `logos/${fileName}`;

      await supabase.storage.from('partner-logos').remove([filePath]);
      await supabase.from('partners').delete().eq('id', id);
      fetchPartners();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#1E40AF] tracking-tight uppercase">Manage Partners</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Logo Gallery Management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* UPLOAD FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 h-fit sticky top-24">
          <h2 className="text-sm font-black text-[#1E40AF] uppercase mb-6 flex items-center gap-2">
            <Plus size={16} className="text-[#15803D]" /> New Logo
          </h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className={`relative border-2 border-dashed ${previewUrl ? 'border-[#15803D] bg-green-50' : 'border-slate-200'} rounded-2xl p-8 text-center transition-all hover:bg-slate-50`}>
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {previewUrl ? (
                <div className="relative py-2 flex flex-col items-center">
                  <Image src={previewUrl} alt="Preview" className="h-32 w-auto object-contain mb-4" />
                  <p className="text-[10px] text-[#15803D] font-black uppercase">Click to change</p>
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-[10px] text-slate-400 font-black uppercase">Click to upload logo</p>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={uploading || !file}
              className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg ${
                !file ? 'bg-slate-100 text-slate-400' : 'bg-[#1E40AF] text-white hover:bg-blue-800'
              }`}
            >
              {uploading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Publish Partner"}
            </button>
          </form>
        </div>

        {/* LOGO LIST */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-black text-[#1E40AF] uppercase mb-6 tracking-widest">Live Logos ({partners.length})</h2>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-200" size={32} /></div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {partners.map((p) => (
                <div key={p.id} className="group relative bg-white border border-slate-100 p-8 rounded-2xl flex items-center justify-center min-h-[160px] hover:shadow-xl transition-all">
                  <div className="relative w-full h-24">
                    <Image 
                      src={p.logo_url} 
                      alt="Partner" 
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <button 
                      onClick={() => deletePartner(p.id, p.logo_url)}
                      className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}