"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, GraduationCap } from 'lucide-react';

export default function CSRPage() {
  const initiatives = [
    {
      icon: Users,
      title: "Community Building",
      desc: "We prioritize local hiring and training, ensuring that our projects create immediate economic benefits for the surrounding community."
    },
    {
      icon: GraduationCap,
      title: "Skills Transfer",
      desc: "We partner with local technical colleges to provide internships for the next generation of Ethiopian engineers."
    },
    {
      icon: Heart,
      title: "Social Support",
      desc: "Tihut Engineering regularly contributes to local infrastructure improvements and community welfare programs."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-6 text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-[#1E40AF] tracking-tighter  mb-6"
        >
          CSR <span className="text-[#15803D]">Initiatives</span>
        </motion.h1>
        <h2 className="text-xs font-black tracking-[0.4em] text-[#15803D]  mb-4">Engineering for a Better Ethiopia</h2>
        <div className="w-24 h-1.5 bg-[#1E40AF] mx-auto mt-6"></div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {initiatives.map((item, index) => (
          <div key={index} className="relative group">
            <div className="absolute inset-0 bg-[#1E40AF] rounded-3xl translate-x-2 translate-y-2 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative bg-white p-10 rounded-3xl border border-slate-100 shadow-sm h-full">
              <div className="bg-[#15803D]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <item.icon className="text-[#15803D]" size={32} />
              </div>
              <h3 className="text-xl font-black text-[#1E40AF] mb-4">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
// "use client";
// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Heart, Users, GraduationCap, Loader2 } from 'lucide-react';
// import { supabase } from '@/lib/supabase';

// export default function CSRPage() {
//   const [dbData, setDbData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       const { data } = await supabase
//         .from('about_content')
//         .select('*')
//         .eq('id', 'csr')
//         .single();
      
//       if (data) setDbData(data);
//       setLoading(false);
//     }
//     fetchData();
//   }, []);

//   const initiatives = [
//     {
//       icon: Users,
//       title: "Community Building",
//       desc: "We prioritize local hiring and training, ensuring that our projects create immediate economic benefits for the surrounding community."
//     },
//     {
//       icon: GraduationCap,
//       title: "Skills Transfer",
//       desc: "We partner with local technical colleges to provide internships for the next generation of Ethiopian engineers."
//     },
//     {
//       icon: Heart,
//       title: "Social Support",
//       desc: "Tihut Engineering regularly contributes to local infrastructure improvements and community welfare programs."
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
//           {dbData?.description || "Engineering for a Better Ethiopia"}
//         </p>
        
//         <div className="w-24 h-1.5 bg-[#1E40AF] mx-auto mt-10"></div>
//       </section>

//       <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
//         {initiatives.map((item, index) => (
//           <div key={index} className="relative group">
//             <div className="absolute inset-0 bg-[#1E40AF] rounded-3xl translate-x-2 translate-y-2 opacity-10 group-hover:opacity-20 transition-opacity"></div>
//             <div className="relative bg-white p-10 rounded-3xl border border-slate-100 shadow-sm h-full">
//               <div className="bg-[#15803D]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
//                 <item.icon className="text-[#15803D]" size={32} />
//               </div>
//               <h3 className="text-xl font-black text-[#1E40AF] mb-4 uppercase">{item.title}</h3>
//               <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
//             </div>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }