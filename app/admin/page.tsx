"use client";
import React, { useEffect, useState } from 'react';
import { MessageSquare, Briefcase, Star, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    messages: 0,
    projects: 0,
    testimonials: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts from all three tables simultaneously
        const [msgRes, projRes, testRes] = await Promise.all([
          supabase.from('messages').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          messages: msgRes.count || 0,
          projects: projRes.count || 0,
          testimonials: testRes.count || 0
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: 'Messages', count: stats.messages, icon: MessageSquare, href: '/admin/messages', color: 'border-blue-500' },
    { label: 'Projects', count: stats.projects, icon: Briefcase, href: '/admin/projects', color: 'border-green-500' },
    { label: 'Testimonials', count: stats.testimonials, icon: Star, href: '/admin/testimonials', color: 'border-yellow-500' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#0A192F] uppercase tracking-tighter">System Overview</h1>
          <p className="text-gray-500 font-medium">Manage your construction pipeline and public profile.</p>
        </div>
        {loading && <Loader2 className="animate-spin text-[#F59E0B]" size={24} />}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link 
            href={card.href} 
            key={card.label} 
            className={`group bg-white p-8 border-b-4 ${card.color} hover:border-[#0A192F] transition-all shadow-sm relative overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <card.icon className="text-[#0A192F] group-hover:text-[#F59E0B] transition-colors" size={32} />
              <ArrowUpRight className="text-gray-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest relative z-10">{card.label}</p>
            <p className="text-4xl font-black text-[#0A192F] mt-1 relative z-10">
              {loading ? "..." : card.count}
            </p>
            
            {/* Subtle background icon decoration */}
            <card.icon className="absolute -right-4 -bottom-4 text-gray-50 group-hover:text-gray-100 transition-colors" size={120} />
          </Link>
        ))}
      </div>

      <div className="bg-[#0A192F] p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h3 className="text-2xl font-black uppercase mb-2">Portfolio Growth</h3>
          <p className="text-slate-400 max-w-md mb-6 font-medium">
            You currently have <span className="text-white font-bold">{stats.projects} projects</span> listed. 
            Adding more residential and industrial work increases your search visibility in Ethiopia.
          </p>
          <div className="flex gap-4">
            <Link href="/admin/projects" className="bg-[#F59E0B] text-[#0A192F] px-8 py-3 font-black uppercase text-xs tracking-widest inline-block hover:bg-white transition-colors">
              Add New Project
            </Link>
            <Link href="/" className="border border-slate-700 text-slate-300 px-8 py-3 font-black uppercase text-xs tracking-widest inline-block hover:bg-slate-800 transition-colors">
              View Website
            </Link>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#F59E0B] opacity-5 -skew-x-12 translate-x-10"></div>
      </div>
    </div>
  );
}