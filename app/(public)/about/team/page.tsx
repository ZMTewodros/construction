"use client";

import React, { useEffect, useState } from "react";
import {  Mail, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from '@/lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  bio: string;
  email: string;
  linkedin_url: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (!error) setTeam(data || []);
      setLoading(false);
    };
    fetchTeam();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-[#C2912E]" size={48} />
    </div>
  );

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <h1 className="text-5xl md:text-7xl text-[#0A192F] font-black mb-6">
          Our <span className="text-[#C2912E]">Team</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl font-medium">
          Meet the experts behind building the foundations of Ethiopia.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {team.map((member) => (
            <div key={member.id} className="group">
              <div className="relative overflow-hidden bg-gray-200 aspect-[4/5] mb-6 shadow-xl">
                <Image
                  src={member.image_url || "/assets/placeholder-team.jpg"} 
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#0A192F]/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-[#0A192F] to-transparent z-20">
                  <div className="flex gap-4">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-white hover:text-[#C2912E] transition-colors">
                        <Mail size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Added 'capitalize' and 'lowercas' to ensure 
                   the first letter is Big and the rest are small 
                */}
                <h3 className="text-2xl font-black text-[#0A192F] mb-1 capitalize">
                  {member.name}
                </h3>
                <p className="text-[#C2912E] font-bold text-sm tracking-widest mb-4 capitalize">
                  {member.role}
                </p>
                
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}