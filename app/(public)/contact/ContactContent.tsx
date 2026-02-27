"use client";

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, Globe } from 'lucide-react';

export const ContactContent = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    location: '',
    budget: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Quote request sent! Our team will contact you shortly.");
    setFormState({
      name: '',
      email: '',
      phone: '',
      projectType: 'Residential',
      location: '',
      budget: '',
      message: ''
    });
  };

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Header */}
      <section className="bg-[#0A192F] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 blueprint-bg"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl text-white font-black uppercase mb-6">
            Get a <span className="text-[#F59E0B]">Quote</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl font-medium">
            Ready to build? Tell us about your project and let&apos;s create something extraordinary together.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase text-[#0A192F]">Office Details</h2>
                <p className="text-gray-600">Visit our headquarters in Addis Ababa or reach out via phone/email.</p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: MapPin, title: "Our Location", detail: "Megenagna, Metebaber Building, 4th Floor\nAddis Ababa, Ethiopia" },
                  { icon: Phone, title: "Call Us", detail: "+251 11 123 4567\n+251 91 123 4567" },
                  { icon: Mail, title: "Email Us", detail: "info@ethioconstruction.com" },
                  { icon: Clock, title: "Working Hours", detail: "Mon - Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 1:00 PM" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="bg-[#0A192F] p-3 rounded-sm">
                      <item.icon className="text-[#F59E0B]" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-[#0A192F] text-sm mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Embed Placeholder */}
              <div className="aspect-square bg-slate-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center rounded-sm">
                <Globe className="text-gray-300 mb-4" size={48} />
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Google Map Embed</p>
                <p className="text-gray-400 text-xs mt-2">Interactive map integration for production.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-12 border-t-8 border-[#0A192F] shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="abebe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="abebe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({...formState, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="+251 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Project Type</label>
                    <select 
                      value={formState.projectType}
                      onChange={(e) => setFormState({...formState, projectType: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Industrial</option>
            
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Project Location</label>
                    <input 
                      type="text" 
                      required
                      value={formState.location}
                      onChange={(e) => setFormState({...formState, location: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="e.g. Addis Ababa, Bole"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Estimated Budget (ETB)</label>
                    <input 
                      type="text" 
                      value={formState.budget}
                      onChange={(e) => setFormState({...formState, budget: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="e.g. 5,000,000"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Project Details</label>
                    <textarea 
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="Describe your project requirements..."
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-[#F59E0B] text-[#0A192F] py-5 font-black uppercase tracking-widest hover:bg-[#0A192F] hover:text-white transition-all flex items-center justify-center gap-3">
                      Send Request <Send size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};