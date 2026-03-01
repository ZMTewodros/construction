"use client";
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const ContactContent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    location: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formState.name,
            email: formState.email,
            phone: formState.phone,
            project_type: formState.projectType,
            location: formState.location,
            message: formState.message
          }
        ]);

      if (error) throw error;

      alert("Request sent successfully! We will get back to you soon.");
      
      setFormState({
        name: '', email: '', phone: '',
        projectType: 'Residential', location: '', message: ''
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Supabase Error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Contact Info Sidebar */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase text-[#0A192F]">Office Details</h2>
                <p className="text-gray-600">Visit our headquarters in Addis Ababa or reach out via phone/email.</p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: MapPin, title: "Our Location", detail: "Megenagna, Metebaber Building, 4th Floor\nAddis Ababa, Ethiopia" },
                  { icon: Phone, title: "Call Us", detail: "+251 11 123 4567" },
                  { icon: Mail, title: "Email Us", detail: "info@ethioconstruction.com" },
                  { icon: Clock, title: "Working Hours", detail: "Mon - Fri: 8:00 AM - 6:00 PM" }
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
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-12 border-t-8 border-[#0A192F] shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Full Name</label>
                    <input 
                      type="text" required value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="Abebe Kebede"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Email Address</label>
                    <input 
                      type="email" required value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="abebe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Phone Number</label>
                    <input 
                      type="tel" required value={formState.phone}
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
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all font-bold"
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Industrial</option>
                      <option>Infrastructure</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Project Location</label>
                    <input 
                      type="text" required value={formState.location}
                      onChange={(e) => setFormState({...formState, location: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="e.g. Addis Ababa, Bole"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Project Details</label>
                    <textarea 
                      rows={5} value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 px-4 py-4 focus:border-[#F59E0B] focus:bg-white focus:outline-none transition-all"
                      placeholder="Describe your project requirements..."
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <button 
                      type="submit" disabled={isSubmitting}
                      className="w-full bg-[#F59E0B] text-[#0A192F] py-5 font-black uppercase tracking-widest hover:bg-[#0A192F] hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
                    >
                      {isSubmitting ? "Processing..." : "Send Request"} <Send size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GOOGLE MAP SECTION --- */}
      <section className="w-full h-[500px] bg-slate-100 grayscale hover:grayscale-0 transition-all duration-700">
        <iframe 
          title="Ethio Construction Office"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.548482458421!2d38.80004907575306!3d9.013627589178494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b856406a454d5%3A0x6b162586e92d6e36!2sMegenagna%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1715800000000!5m2!1sen!2set" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
};