"use client";

import React from "react";
import { Linkedin, Mail } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Mussie Melkamu",
    role: "CEO & Founder",
    image: "/assets/team2.jpg", 
    bio: "Leading Ethio Construction with over 15 years of engineering excellence.",
    social: { mail: "ceo@ethioconstruction.com", linkedin: "#" }
  },
  {
    name: "Tewodros Melkamu",
    role: "Project Manager",
    image: "/assets/team1.jpg",
    bio: "Expert in infrastructure and large-scale residential landmarks.",
    social: { mail: "mussie@ethioconstruction.com", linkedin: "#" }
  },
];

export default function TeamPage() {
  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <h1 className="text-5xl md:text-7xl text-[#0A192F] font-black uppercase mb-6">
          Our <span className="text-[#C2912E]">Team</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl font-medium">
          Meet the experts behind building the foundations of Ethiopia.
        </p>
      </section>

      {/* Team Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden bg-gray-200 aspect-[4/5] mb-6 shadow-xl">
                
                {/* 1. Optimized Image - Removed 'grayscale' to prevent initial blur */}
                <Image
                  src={member.image} 
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={100} // Max quality
                  priority={index < 3}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* 2. Light Overlay - Provides a professional look without blurring the image pixels */}
                <div className="absolute inset-0 bg-[#0A192F]/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                
                {/* 3. Social Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-[#0A192F] to-transparent z-20">
                  <div className="flex gap-4">
                    <a href={`mailto:${member.social.mail}`} className="text-white hover:text-[#C2912E] transition-colors">
                      <Mail size={20} />
                    </a>
                    <a href={member.social.linkedin} className="text-white hover:text-[#C2912E] transition-colors">
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Text Information */}
              <div className="relative">
                <h3 className="text-2xl font-black text-[#0A192F] uppercase mb-1">
                  {member.name}
                </h3>
                <p className="text-[#C2912E] font-bold text-sm uppercase tracking-widest mb-4">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}