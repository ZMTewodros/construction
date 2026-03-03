"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home as House, 
  Building2, 
  HardHat, 
  Truck, 
  // ArrowRight, 
  Trees, 
  Paintbrush, 
  ShoppingBag, 
  Briefcase 
} from 'lucide-react';
import Link from 'next/link';

export const ServicesContent = () => {
  const services = [
    {
      icon: Briefcase,
      title: "General Contractor (GC)",
      desc: "Licensed general contracting services overseeing complex construction projects from ground-breaking to handover, ensuring compliance, safety, and excellence.",
      features: ["Full Project Execution", "Regulatory Compliance", "Subcontractor Management", "Site Safety"]
    },
    {
      icon: ShoppingBag,
      title: "Wholesale Distribution",
      desc: "Providing high-quality construction materials and equipment at wholesale scale. We supply the essential components for large-scale infrastructure projects.",
      features: ["Bulk Material Supply", "Equipment Logistics", "Quality Sourcing", "Supply Chain Solutions"]
    },
    {
      icon: Trees,
      title: "Landscape Design",
      desc: "Creating sustainable and aesthetic outdoor environments. Our landscaping services blend architectural needs with environmental beauty.",
      features: ["Urban Greenery", "Garden Architecture", "Irrigation Systems", "Site Grading"]
    },
    {
      icon: Paintbrush,
      title: "Finishing Works",
      desc: "The final touch that defines quality. We specialize in high-end interior and exterior finishing, including tiling, painting, and architectural detailing.",
      features: ["Epoxy Flooring Systems", "Aluminum Doors & Windows", "Quartz Countertops Installation", "Plastering & Painting"]
    },
    {
      icon: House,
      title: "Residential Construction",
      desc: "We specialize in building high-end residential homes, villas, and apartment complexes with a focus on modern craftsmanship.",
      features: ["Custom Home Building", "Apartment Complexes", "Villa Developments", "Smart Home Ready"]
    },
    {
      icon: Building2,
      title: "Commercial Infrastructure",
      desc: "Delivering functional and sustainable commercial spaces including corporate headquarters, malls, and hospitality resorts.",
      features: ["Office Buildings", "Retail Spaces", "Hotels & Resorts", "Mixed-use Hubs"]
    },
    {
      icon: HardHat,
      title: "Industrial Facilities",
      desc: "Building the backbone of industry. We construct warehouses and factories designed for heavy-duty operations and efficiency.",
      features: ["Manufacturing Plants", "Logistics Centers", "Cold Storage", "Industrial Parks"]
    },
    {
      icon: Truck,
      title: "Civil Engineering",
      desc: "Essential infrastructure for a growing nation. Our team handles roads, bridges, and drainage systems with technical excellence.",
      features: ["Road Construction", "Bridge Engineering", "Drainage Systems", "Earthworks"]
    },
    
  ];

  return (
    <div className="pt-20 bg-white">
      {/* --- HEADER SECTION --- */}
      <section className="bg-white py-24 relative overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl text-[#1E40AF] font-black  mb-6">
              Our <span className="text-[#15803d]">Services</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              Comprehensive engineering and construction solutions tailored to build Ethiopia&apos;s future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-8 border border-gray-100 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden rounded-sm"
              >
                {/* Subtle accent hover background */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#1E40AF]/5 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-[2.5] duration-700"></div>
                
                <service.icon className="text-[#15803d] mb-6 group-hover:scale-110 transition-transform duration-300" size={48} />
                
                <h3 className="text-2xl font-black text-[#1E40AF] mb-4">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                  {service.desc}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-lg font-bold text-[#1E40AF]  tracking-wider">
                      <div className="w-2 h-2 bg-[#15803d] mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-[#1E40AF] font-black uppercase text-xs tracking-[0.2em] group-hover:text-[#15803d] transition-colors"
                >
                  View Detail <ArrowRight size={16} />
                </Link> */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black uppercase text-[#1E40AF] mb-8">
            Ready to start your <span className="text-[#15803d]">project?</span>
          </h2>
          <Link 
            href="/contact" 
            className="inline-block bg-[#1E40AF] text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-[#15803d] transition-all duration-300 shadow-lg"
          >
            Get a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};