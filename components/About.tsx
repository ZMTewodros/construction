"use client";

import React from 'react';
import { Award, Users, Target, History, Shield } from 'lucide-react';
import Image from 'next/image';
export const About = () => {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-navy py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 blueprint-bg"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl text-white font-black uppercase mb-6">
            Our <span className="text-accent">Story</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Building Ethiopia&apos;s landmarks since 2008 with a vision for sustainable growth and engineering excellence.
          </p>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase text-navy">Who We <span className="text-accent">Are</span></h2>
                <p className="text-gray-600 leading-relaxed">
                  Ethio Construction is a premier Grade-1 construction firm based in Addis Ababa. We have grown from a small family-owned business into one of the most respected names in the Ethiopian construction industry.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our success is built on a foundation of integrity, safety, and a relentless pursuit of quality. We don&apos;t just build structures; we build relationships and communities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 border-t-4 border-accent">
                  <Target className="text-navy mb-4" size={32} />
                  <h4 className="font-black uppercase text-navy mb-2">Our Mission</h4>
                  <p className="text-sm text-gray-500">To deliver superior construction services through innovation, safety, and sustainable practices.</p>
                </div>
                <div className="p-6 bg-gray-50 border-t-4 border-navy">
                  <Award className="text-accent mb-4" size={32} />
                  <h4 className="font-black uppercase text-navy mb-2">Our Vision</h4>
                  <p className="text-sm text-gray-500">To be the leading construction partner in East Africa, recognized for excellence and reliability.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000" 
                alt="Construction Team" 
                className="rounded-sm shadow-2xl"
                width={600}
                height={400}
              />
              
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase text-navy mb-4">Our Core Values</h2>
            <div className="h-1 w-24 bg-accent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Integrity", desc: "Honesty and transparency in every contract." },
              { icon: Users, title: "Collaboration", desc: "Working as one with clients and partners." },
              { icon: Target, title: "Precision", desc: "Attention to detail in every measurement." },
              { icon: History, title: "Sustainability", desc: "Building for the future generations." }
            ].map((value, i) => (
              <div key={i} className="text-center p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-navy" size={28} />
                </div>
                <h4 className="font-black uppercase text-navy mb-3">{value.title}</h4>
                <p className="text-sm text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
