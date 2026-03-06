"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HardHat, Recycle, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HSEPolicyPage() {
  const policies = [
    {
      icon: ShieldCheck,
      title: "Health & Safety",
      desc: "We maintain a zero-accident goal through rigorous site inspections and mandatory safety protocols for all personnel."
    },
    {
      icon: HardHat,
      title: "Personnel Protection",
      desc: "Every team member is provided with high-grade PPE and continuous training on latest safety standards."
    },
    {
      icon: Recycle,
      title: "Environmental Care",
      desc: "We implement waste management and sustainable sourcing to minimize the carbon footprint of our construction projects."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-6 text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-[#1E40AF] tracking-tighter uppercase mb-6"
        >
          HSE <span className="text-[#15803D]">Policy</span>
        </motion.h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg font-medium">
          At Tihut Engineering, we believe that no project is successful unless it is completed safely. 
          Our Health, Safety, and Environment (HSE) policy is the foundation of our operations.
        </p>
        <div className="w-24 h-1.5 bg-[#15803D] mx-auto mt-10"></div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {policies.map((item, index) => (
          <div key={index} className="p-10 bg-slate-50 border-t-4 border-[#15803D] rounded-xl hover:shadow-2xl transition-all group">
            <item.icon className="text-[#1E40AF] mb-6 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-black text-[#1E40AF] mb-4 uppercase">{item.title}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

// "use client";
// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { ShieldCheck, HardHat, Recycle, Loader2 } from 'lucide-react';
// import { supabase } from '@/lib/supabase';

// export default function HSEPolicyPage() {
//   const [dbData, setDbData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       const { data } = await supabase
//         .from('about_content')
//         .select('*')
//         .eq('id', 'hse')
//         .single();
      
//       if (data) setDbData(data);
//       setLoading(false);
//     }
//     fetchData();
//   }, []);

//   const policies = [
//     {
//       icon: ShieldCheck,
//       title: "Health & Safety",
//       desc: "We maintain a zero-accident goal through rigorous site inspections and mandatory safety protocols for all personnel."
//     },
//     {
//       icon: HardHat,
//       title: "Personnel Protection",
//       desc: "Every team member is provided with high-grade PPE and continuous training on latest safety standards."
//     },
//     {
//       icon: Recycle,
//       title: "Environmental Care",
//       desc: "We implement waste management and sustainable sourcing to minimize the carbon footprint of our construction projects."
//     }
//   ];

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <Loader2 className="animate-spin text-[#1E40AF]" size={40} />
//     </div>
//   );

//   return (
//     <div className="bg-white min-h-screen pt-40 pb-24">
//       <section className="max-w-7xl mx-auto px-6 text-center mb-20">
//         <motion.h1 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-4xl md:text-6xl font-black text-[#1E40AF] tracking-tighter uppercase mb-6"
//         >
//           {/* Dynamically splits the title to keep the two-color effect */}
//           {dbData?.title.split(' ')[0]} <span className="text-[#15803D]">{dbData?.title.split(' ').slice(1).join(' ')}</span>
//         </motion.h1>

//         <p className="text-slate-600 max-w-3xl mx-auto text-lg font-medium leading-relaxed">
//           {dbData?.description || "Safety is the foundation of our operations."}
//         </p>
        
//         <div className="w-24 h-1.5 bg-[#15803D] mx-auto mt-10"></div>
//       </section>

//       <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
//         {policies.map((item, index) => (
//           <div key={index} className="p-10 bg-slate-50 border-t-4 border-[#15803D] rounded-xl hover:shadow-2xl transition-all group">
//             <item.icon className="text-[#1E40AF] mb-6 group-hover:scale-110 transition-transform" size={48} />
//             <h3 className="text-xl font-black text-[#1E40AF] mb-4 uppercase">{item.title}</h3>
//             <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }