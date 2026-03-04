"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Trash2, User, Loader2, UploadCloud, Star, Edit3, XCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  message: string;
  image_url: string;
  rating: number;
  created_at: string;
}

export default function ManageTestimonials() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ name: '', position: '', message: '', rating: 5 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Fetch error:", error);
    else setList(data || []);
    setFetching(false);
  };

  const startEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      position: t.position,
      message: t.message,
      rating: t.rating || 5
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', position: '', message: '', rating: 5 });
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let uploadedImageUrl = '';
      
      if (imageFile) {
        // --- IMAGE COMPRESSION LOGIC ---
        const options = {
          maxSizeMB: 0.2,          // Squashes to ~200KB
          maxWidthOrHeight: 800,   // Good size for testimonial avatars
          useWebWorker: true
        };
        
        const compressedBlob = await imageCompression(imageFile, options);
        // Convert Blob back to File for Supabase upload
        const compressedFile = new File([compressedBlob], imageFile.name, { type: imageFile.type });

        const path = `testimonials/${Date.now()}-${compressedFile.name}`;
        const { error: uploadError } = await supabase.storage.from('assets').upload(path, compressedFile);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from('assets').getPublicUrl(path);
        uploadedImageUrl = urlData.publicUrl;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = { 
        name: form.name, 
        position: form.position, 
        message: form.message, 
        rating: form.rating,
        updated_at: new Date().toISOString()
      };

      if (uploadedImageUrl) payload.image_url = uploadedImageUrl;

      if (editingId) {
        const { error: updateError } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('testimonials')
          .insert([{ ...payload, image_url: uploadedImageUrl, created_by: user?.email }]);
        if (insertError) throw insertError;
      }

      cancelEdit();
      fetchTestimonials();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Remove this testimonial permanently?")) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) fetchTestimonials();
  };

  useEffect(() => { fetchTestimonials(); }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-4 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-black text-[#0A192F] uppercase tracking-tight">Manage Feedback</h1>
        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mt-2">Client Testimonials & Ratings</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM SECTION */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
               <h2 className="text-lg font-black text-[#0A192F] uppercase tracking-widest">
                {editingId ? "Edit Feedback" : "New Testimonial"}
              </h2>
              {editingId && (
                <button onClick={cancelEdit} className="text-gray-400 hover:text-red-500">
                  <XCircle size={20} />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Client Name</label>
                <input type="text" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-medium text-sm" placeholder="e.g. John Doe" required
                       value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Position</label>
                <input type="text" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-medium text-sm" placeholder="e.g. CEO at Company"
                       value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Rating</label>
                <select 
                  className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-medium text-sm cursor-pointer"
                  value={form.rating} 
                  onChange={e => setForm({...form, rating: parseInt(e.target.value)})}
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Statement</label>
                <textarea className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none resize-none font-medium text-sm" rows={4} placeholder="What did they say about your work?" required
                       value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Photo {editingId && "(Optional)"}</label>
                <label className="flex flex-col items-center gap-3 p-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition-all text-center">
                  <UploadCloud className="text-blue-500" size={24} />
                  <span className="text-xs font-bold text-blue-600 uppercase">
                    {imageFile ? imageFile.name : editingId ? "Replace Photo" : "Upload image"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <button disabled={loading} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-white shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#0A192F] hover:bg-blue-600'}`}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : editingId ? "Update Changes" : "Publish Feedback"}
              </button>
            </form>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 gap-4">
            {fetching ? (
              <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
            ) : list.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No testimonials found yet.</p>
              </div>
            ) : (
              list.map(t => (
                <div key={t.id} className={`bg-white p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center border transition-all group ${editingId === t.id ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100 hover:shadow-md'}`}>
                  <div className="relative w-20 h-20 shrink-0">
                    {t.image_url ? (
                      <Image src={t.image_url} fill className="rounded-2xl object-cover" alt={t.name} />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                        <User size={32} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-black text-[#0A192F] uppercase text-sm">{t.name}</h3>
                        <p className="text-blue-600 font-bold text-[10px] uppercase tracking-wide">{t.position}</p>
                        <div className="flex mt-1">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(t)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => deleteTestimonial(t.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed italic">&quot;{t.message}&quot;</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}