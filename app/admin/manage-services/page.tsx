"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import * as LucideIcons from 'lucide-react';
import { Loader2, Save, Trash2, Edit3, X, Plus, Trash } from 'lucide-react';

const ICON_OPTIONS = {
  Briefcase: LucideIcons.Briefcase,
  ShoppingBag: LucideIcons.ShoppingBag,
  Trees: LucideIcons.Trees,
  Paintbrush: LucideIcons.Paintbrush,
  Home: LucideIcons.Home,
  Building2: LucideIcons.Building2,
  HardHat: LucideIcons.HardHat,
  Truck: LucideIcons.Truck,
  Zap: LucideIcons.Zap,
  Hammer: LucideIcons.Hammer,
  DraftingCompass: LucideIcons.DraftingCompass,
  UtilityPole: LucideIcons.UtilityPole
};

export default function ManageServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Briefcase',
    features: [''], // Starts with one empty feature
    order_index: 0
  });

  async function fetchServices() {
    const { data } = await supabase.from('services').select('*').order('order_index', { ascending: true });
    setServices(data || []);
  }

  useEffect(() => { fetchServices(); }, []);

  const openModal = (service?: any) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        ...service,
        features: service.features.length > 0 ? service.features : ['']
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', icon_name: 'Briefcase', features: [''], order_index: services.length });
    }
    setShowModal(true);
  };

  // --- DYNAMIC FEATURE HANDLERS ---
  const addFeatureRow = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureRow = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures.length > 0 ? updatedFeatures : [''] });
  };

  const updateFeatureValue = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const cleanFeatures = formData.features.filter(f => f.trim() !== '');
    const payload = { ...formData, features: cleanFeatures };

    const { error } = editingId 
      ? await supabase.from('services').update(payload).eq('id', editingId)
      : await supabase.from('services').insert([payload]);

    if (!error) {
      setShowModal(false);
      fetchServices();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-black text-[#0A192F] uppercase tracking-tighter">Service Management</h1>
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest">Personnel Control Panel</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#0A192F] text-white px-6 py-4 rounded-sm flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
        >
          <Plus size={18} /> Add New Service
        </button>
      </div>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => {
          const Icon = (LucideIcons as any)[s.icon_name] || LucideIcons.Briefcase;
          return (
            <div key={s.id} className="border border-slate-100 bg-white group hover:shadow-xl transition-all flex flex-col">
              <div className="p-8 flex flex-col items-center text-center flex-grow">
                <div className="w-20 h-20 bg-slate-50 text-[#15803d] rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <Icon size={40} />
                </div>
                <h3 className="font-black text-[#0A192F] uppercase text-xl mb-3 tracking-tight">{s.title}</h3>
                <p className="text-slate-400 text-sm font-medium line-clamp-3 mb-4 leading-relaxed">{s.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                   <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
                     {s.features.length} Features
                   </span>
                </div>
              </div>
              
              <div className="flex border-t border-slate-100 h-16">
                <button onClick={() => openModal(s)} className="flex-1 flex justify-center items-center gap-2 text-[#0A192F] hover:bg-slate-50 transition-colors border-r border-slate-100 font-black text-[10px] uppercase tracking-widest">
                  <Edit3 size={16} /> Edit
                </button>
                <button onClick={async () => { if(confirm("Delete this service?")) { await supabase.from('services').delete().eq('id', s.id); fetchServices(); } }} className="flex-1 flex justify-center items-center gap-2 text-red-500 hover:bg-red-50 transition-colors font-black text-[10px] uppercase tracking-widest">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0A192F]/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="font-black text-[#0A192F] uppercase tracking-tighter text-xl">
                {editingId ? "Update Service" : "Add New Service"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
              {/* ICON PICKER */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block tracking-[0.2em]">Visual Identification</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm">
                  {Object.entries(ICON_OPTIONS).map(([name, Icon]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({...formData, icon_name: name})}
                      className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-sm transition-all border ${
                        formData.icon_name === name 
                          ? 'bg-[#F59E0B] border-[#F59E0B] text-[#0A192F] shadow-lg scale-105' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-[#F59E0B]'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-[7px] font-black uppercase truncate w-full px-1">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Service Title</label>
                  <input 
                    required
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="E.G. GENERAL CONTRACTOR"
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-[#F59E0B] outline-none font-black uppercase text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Service Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the service in detail..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-[#F59E0B] outline-none h-32 resize-none font-medium text-sm leading-relaxed"
                  />
                </div>

                {/* DYNAMIC DYNAMIC FEATURES SECTION */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Core Features</label>
                    <button 
                      type="button" 
                      onClick={addFeatureRow}
                      className="text-[10px] font-black uppercase text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Feature
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 group">
                        <div className="flex-1 relative">
                          <input 
                            placeholder={`Detail #${index + 1}`}
                            value={feature}
                            onChange={e => updateFeatureValue(index, e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-[#F59E0B] outline-none text-xs font-bold uppercase"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeFeatureRow(index)}
                          className="px-4 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-sm"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                disabled={loading} 
                className="w-full bg-[#0A192F] text-white py-6 rounded-sm font-black uppercase tracking-[0.3em] text-xs hover:bg-[#F59E0B] hover:text-[#0A192F] transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                {editingId ? "Update Production Records" : "Publish to Public Site"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}