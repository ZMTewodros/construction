'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Trash2, Upload, Plus, Check, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

// --- UI COMPONENTS: PROFESSIONAL TOAST ---
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className="fixed top-6 right-6 z-[300] flex items-center gap-4 bg-[#0A192F] text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-white/10 animate-in slide-in-from-right-10">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
      {type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
    </div>
    <div className="flex flex-col">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
        {type === 'success' ? 'System Success' : 'Security/System Error'}
      </p>
      <p className="text-sm font-bold leading-tight">{message}</p>
    </div>
    <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white transition-colors">
      <X size={18} />
    </button>
  </div>
);

export default function AdminPartners() {
  type Partner = {
    id: string;
    logo_url: string;
    created_at?: string;
    // Add other fields as needed based on your database schema
  };

  const [partners, setPartners] = useState<Partner[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

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

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
    if (!file) return;

    setUploading(true);
    try {
      // --- IMAGE COMPRESSION LOGIC ---
      const options = { 
        maxSizeMB: 0.2, // Logos can be even smaller than profile photos
        maxWidthOrHeight: 800, 
        useWebWorker: true,
        fileType: 'image/webp' // Convert to WebP for maximum efficiency
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `logos/${fileName}`;

      // Upload compressed file to bucket
      const { error: uploadError } = await supabase.storage
        .from('partner-logos')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // Get the URL
      const { data: { publicUrl } } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(filePath);

      // Insert into database
      const { error: dbError } = await supabase
        .from('partners')
        .insert([{ logo_url: publicUrl }]);

      if (dbError) throw dbError;

      setFile(null);
      setToast({ message: "Partner logo optimized & published!", type: 'success' });
      fetchPartners();
    } catch (error: unknown) {
      const message = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'An unexpected error occurred';
      setToast({ message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const deletePartner = async (id: string, logoUrl: string) => {
    if (!confirm("Permanently remove this partner logo?")) return;

    try {
      // Extract filename from URL
      const fileName = logoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('partner-logos').remove([`logos/${fileName}`]);
      }
      
      const { error } = await supabase.from('partners').delete().eq('id', id);
      if (error) throw error;

      setToast({ message: "Partner removed successfully", type: 'success' });
      fetchPartners();
    } catch (error: unknown) {
      const message = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'An unexpected error occurred';
      setToast({ message, type: 'error' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-10 border-b-2 border-slate-100 pb-6">
        <h1 className="text-3xl font-black text-[#0A192F] tracking-tight uppercase">Manage Partners</h1>
        <p className="text-[#C2912E] text-xs font-bold uppercase tracking-widest mt-1">Logo Gallery Management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* UPLOAD FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 h-fit sticky top-24">
          <h2 className="text-sm font-black text-[#0A192F] uppercase mb-6 flex items-center gap-2">
            <Plus size={16} className="text-[#C2912E]" /> New Logo
          </h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className={`relative border-2 border-dashed ${previewUrl ? 'border-[#C2912E] bg-orange-50/30' : 'border-slate-200'} rounded-2xl p-8 text-center transition-all hover:bg-slate-50`}>
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={uploading}
              />
              {previewUrl ? (
                <div className="relative py-2 flex flex-col items-center">
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    width={200} 
                    height={128} 
                    className="h-32 w-auto object-contain mb-4" 
                    unoptimized
                  />
                  <p className="text-[10px] text-[#C2912E] font-black uppercase">Click to change</p>
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-[10px] text-slate-400 font-black uppercase">Select Logo File</p>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={uploading || !file}
              className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg flex justify-center items-center ${
                !file ? 'bg-slate-100 text-slate-400' : 'bg-[#0A192F] text-white hover:bg-[#C2912E]'
              }`}
            >
              {uploading ? <Loader2 className="animate-spin" size={18} /> : "Publish Partner"}
            </button>
          </form>
        </div>

        {/* LOGO LIST */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-black text-[#0A192F] uppercase mb-6 tracking-widest">Live Logos ({partners.length})</h2>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-200" size={32} /></div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {partners.map((p) => (
                <div key={p.id} className="group relative bg-white border border-slate-100 p-8 rounded-2xl flex items-center justify-center min-h-[160px] hover:shadow-xl transition-all">
                  <div className="relative w-full h-24">
                    <Image 
                      src={p.logo_url} 
                      alt="Partner Logo" 
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