"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Home as House, Building2, Ruler, HardHat, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const ServicesContent = () => {
  const services = [
    {
      icon: House,
      title: "Residential Construction",
      desc: "We specialize in building high-end residential homes, villas, and apartment complexes. Our focus is on quality craftsmanship and modern architectural designs that stand the test of time.",
      features: ["Custom Home Building", "Apartment Complexes", "Villa Developments", "Interior Finishing"]
    },
    {
      icon: Building2,
      title: "Commercial Infrastructure",
      desc: "From corporate headquarters to shopping malls, we deliver commercial spaces that are functional, sustainable, and aesthetically pleasing to enhance business productivity.",
      features: ["Office Buildings", "Retail Spaces", "Hotels & Resorts", "Mixed-use Developments"]
    },
        {
      icon: Ruler,
      title: "Project Management",
      desc: "Comprehensive oversight from conception to completion. We manage budgets, timelines, and subcontractors to ensure your project is delivered exactly as envisioned.",
      features: ["Cost Estimation", "Site Supervision", "Risk Management", "Quality Control"]
    },
    {
      icon: HardHat,
      title: "Industrial Facilities",
      desc: "Building the backbone of industry. We construct warehouses, factories, and logistics centers designed for heavy-duty operations and maximum efficiency.",
      features: ["Warehouses", "Manufacturing Plants", "Cold Storage", "Distribution Centers"]
    },
    {
      icon: Truck,
      title: "Civil Engineering",
      desc: "Essential infrastructure for a growing nation. Our civil engineering team handles roads, bridges, and drainage systems with technical excellence.",
      features: ["Road Construction", "Bridge Engineering", "Drainage Systems", "Earthworks"]
    }
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-navy py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 blueprint-bg"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl text-white font-black uppercase mb-6">
              Our <span className="text-accent">Services</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From the first brick to the final touch, we provide end-to-end construction solutions across Ethiopia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150"></div>
                
                <service.icon className="text-accent mb-6" size={48} />
                <h3 className="text-2xl font-black uppercase text-navy mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {service.desc}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm font-bold text-navy uppercase tracking-wider">
                      <div className="w-2 h-2 bg-accent mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-navy font-black uppercase text-xs tracking-[0.2em] group-hover:text-accent transition-colors"
                >
                  View Detail <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black uppercase text-navy mb-8">Ready to start your project?</h2>
          <Link href="/contact" className="btn-primary bg-navy text-white hover:bg-white hover:text-navy">
            Get a Free Consultation
          </Link>
        </div>
      </section> */}
    </div>
  );
};
