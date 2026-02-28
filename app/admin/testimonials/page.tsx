"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Trash2, User, Loader2, Quote, UploadCloud } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  message: string;
  image_url: string;
  created_at: string;
  created_by?: string;
}

export default function ManageTestimonials() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ name: '', position: '', message: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let uploadedImageUrl = '';
      if (imageFile) {
        // NOTE: Ensure your bucket is named 'assets' in Supabase Storage
        const path = `testimonials/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('assets').upload(path, imageFile);
        
        if (uploadError) {
          if (uploadError.message.includes("not found")) {
            throw new Error("Storage bucket 'assets' not found. Please create it in Supabase.");
          }
          throw uploadError;
        }

        const { data: urlData } = supabase.storage.from('assets').getPublicUrl(path);
        uploadedImageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('testimonials').insert([
        { 
          name: form.name, 
          position: form.position, 
          message: form.message, 
          image_url: uploadedImageUrl, 
          created_by: user?.email 
        }
      ]);

      if (insertError) throw insertError;

      setForm({ name: '', position: '', message: '' });
      setImageFile(null);
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
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-[#0A192F] uppercase tracking-tight">Client Testimonials</h1>
        <p className="text-gray-400 text-sm font-medium">Manage public feedback and industry endorsements</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORM SECTION */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 sticky top-8">
            <h2 className="text-lg font-black text-[#0A192F] uppercase tracking-widest mb-6 border-b pb-4">New Entry</h2>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Client Name</label>
                <input type="text" placeholder="Tewodros" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none transition-all font-medium text-sm" required
                       value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Corporate Position</label>
                <input type="text" placeholder="Project Manager at ABC Corp" className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none transition-all font-medium text-sm"
                       value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Statement</label>
                <textarea placeholder="The construction was executed with precision..." className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none resize-none font-medium text-sm" rows={4} required
                       value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-2">Client Headshot</label>
                <label className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition-all">
                  <UploadCloud className="text-blue-500" size={20} />
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-tighter">
                    {imageFile ? imageFile.name : "Select Photo"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <button disabled={loading} className="w-full bg-[#0A192F] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Publish Statement"}
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
              <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest">No testimonials found.</p>
              </div>
            ) : (
              list.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="relative w-20 h-20 shrink-0">
                    {t.image_url ? (
                      <Image src={t.image_url} fill className="rounded-2xl object-cover shadow-md" alt={t.name} />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                        <User size={32} />
                      </div>
                    )}
                    <div className="absolute -top-2 -left-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-lg">
                      <Quote size={12} fill="currentColor" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-black text-[#0A192F] uppercase text-sm tracking-tight">{t.name}</h3>
                        <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">{t.position}</p>
                      </div>
                      <span className="text-[9px] font-bold text-gray-300 uppercase">
                        {new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed italic line-clamp-2">
                      &quot;{t.message}&quot;
                    </p>
                  </div>

                  <div className="w-full md:w-auto flex md:flex-col gap-2">
                    <button onClick={() => deleteTestimonial(t.id)} className="flex-1 md:flex-none p-3 text-red-100 group-hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
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