"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Save, Image as ImageIcon, Loader2, Plus, Trash2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
export default function AdminSettings() {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [heroImages, setHeroImages] = useState<string[]>([]);

  // 1. Fetch current images on load
  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('hero_images')
        .eq('id', 1)
        .single();

      if (error) throw error;
      setHeroImages(data?.hero_images || []);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // 2. Handle Image Upload
  const handleUpload = async () => {
    if (!file) return alert("Please select an image");
    
    try {
      setUploading(true);
      const fileName = `hero-${Date.now()}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-assets') 
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      // Add new URL to the local state and Supabase
      const updatedImages = [...heroImages, publicUrl];
      
      const { error: dbError } = await supabase
        .from('site_settings')
        .upsert({ id: 1, hero_images: updatedImages });

      if (dbError) throw dbError;

      setHeroImages(updatedImages);
      setFile(null);
      alert("Image added to carousel!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. Handle Delete
  const handleDelete = async (urlToDelete: string) => {
    if (!confirm("Are you sure you want to remove this image from the carousel?")) return;

    try {
      const updatedImages = heroImages.filter(url => url !== urlToDelete);
      
      const { error } = await supabase
        .from('site_settings')
        .update({ hero_images: updatedImages })
        .eq('id', 1);

      if (error) throw error;

      setHeroImages(updatedImages);
      alert("Image removed.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Hero Carousel Manager</h1>
        <button onClick={fetchImages} className="p-2 text-slate-400 hover:text-[#1E40AF]">
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1E40AF]">
              <Plus size={20} /> Add New Image
            </h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                <input 
                  type="file" 
                  id="hero-upload"
                  hidden
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="hero-upload" className="cursor-pointer block">
                  <ImageIcon className="mx-auto mb-2 text-slate-300" size={32} />
                  <span className="text-sm text-slate-500 font-medium">
                    {file ? file.name : "Click to select image"}
                  </span>
                </label>
              </div>
              
              <button 
                onClick={handleUpload}
                disabled={uploading || !file}
                className="w-full bg-[#1E40AF] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#15803D] transition-all disabled:opacity-50"
              >
                {uploading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                Add to Carousel
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Current Gallery */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-6 text-slate-700">Current Slides ({heroImages.length})</h2>
            
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-300" size={40} /></div>
            ) : heroImages.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No images in carousel.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heroImages.map((url, index) => (
                  <div key={index} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    <Image src={url} alt="Slide" className="w-full h-full object-cover" width={400} height={225} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleDelete(url)}
                        className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-700">
                      Slide {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}