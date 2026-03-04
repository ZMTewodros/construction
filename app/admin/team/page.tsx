/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Loader2, X, Camera, Edit2, Check, AlertCircle } from 'lucide-react';
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

export default function AdminTeam() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    role: '', 
    image_url: '' 
  });

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('id, name, role, image_url')
      .order('created_at', { ascending: false });
    
    if (!error) setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      
      const imageFile = e.target.files[0];
      const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedFile = await imageCompression(imageFile, options);
      
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `team/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('team-photos')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('team-photos')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      setToast({ message: "Photo optimized & uploaded!", type: 'success' });
    } catch (error: any) {
      setToast({ message: error.message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (member: any) => {
    setFormData({ name: member.name, role: member.role, image_url: member.image_url });
    setEditingId(member.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', role: '', image_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      setToast({ message: "Please upload a photo first", type: 'error' });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('team_members').update(formData).eq('id', editingId);
        if (error) throw error;
        setToast({ message: "Profile updated successfully", type: 'success' });
      } else {
        const { error } = await supabase.from('team_members').insert([formData]);
        if (error) throw error;
        setToast({ message: "New team member added", type: 'success' });
      }
      closeModal();
      fetchMembers();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (confirm('Permanently remove this team member?')) {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (!error) {
        setToast({ message: "Member removed from records", type: 'success' });
        fetchMembers();
      } else {
        setToast({ message: error.message, type: 'error' });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#0A192F] pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-[#0A192F]">Team Management</h1>
          <p className="text-sm text-[#F59E0B] font-bold uppercase tracking-[0.2em] mt-1">Personnel Control Panel</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-[#0A192F] text-white px-8 py-4 rounded-sm text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F59E0B] hover:text-[#0A192F] transition-all shadow-lg"
        >
          <Plus size={18} /> Add New Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && members.length === 0 ? (
          <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin text-[#F59E0B]" size={40} /></div>
        ) : (
          members.map(member => (
            <div key={member.id} className="bg-white border-2 border-gray-100 flex flex-col shadow-sm group">
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 border-b-2 border-gray-100">
                {member.image_url && (
                  /* REMOVED 'grayscale' and 'hover:grayscale-0' for clear shine */
                  <Image 
                    src={member.image_url} 
                    alt={member.name} 
                    fill 
                    className="object-cover transition-all duration-500" 
                  />
                )}
              </div>
              <div className="p-4 text-center flex-grow">
                <p className="font-black uppercase text-[#0A192F] text-sm tracking-tight truncate">{member.name}</p>
                <p className="text-[#C2912E] text-[10px] font-bold uppercase tracking-widest mt-1">{member.role}</p>
              </div>
              <div className="grid grid-cols-2 border-t-2 border-gray-100">
                <button onClick={() => openEditModal(member)} className="flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-tighter text-[#0A192F] hover:bg-gray-50 border-r-2 border-gray-100 transition-colors">
                  <Edit2 size={14} /> 
                </button>
                <button onClick={() => deleteMember(member.id)} className="flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-tighter text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} /> 
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0A192F]/95 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-8 rounded-sm shadow-2xl relative border-t-8 border-[#F59E0B]">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black uppercase text-[#0A192F] mb-8 text-center tracking-tighter">
              {editingId ? 'Edit Profile' : 'Add New Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 bg-gray-50 relative overflow-hidden">
                {formData.image_url ? (
                  <div className="relative w-32 h-32 mb-4 border-2 border-[#0A192F] shadow-xl">
                    <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <Camera size={40} className="text-gray-300 mb-4" />
                )}
                <label className="cursor-pointer">
                  <span className="bg-[#0A192F] text-white px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-[#F59E0B] transition-colors">
                    {uploading ? "Compressing..." : "Upload Photo"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
              <div className="space-y-4">
                <input required placeholder="FULL NAME" value={formData.name} className="w-full p-4 border-2 border-gray-300 text-xs font-bold uppercase outline-none focus:border-[#F59E0B]" onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required placeholder="JOB ROLE" value={formData.role} className="w-full p-4 border-2 border-gray-300 text-xs font-bold uppercase outline-none focus:border-[#F59E0B]" onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
              <button type="submit" disabled={loading || uploading} className="w-full bg-[#F59E0B] text-[#0A192F] py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#0A192F] hover:text-white transition-all flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> : editingId ? 'Update Record' : 'Save Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}