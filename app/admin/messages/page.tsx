"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Calendar, User, MapPin, HardHat } from 'lucide-react';

export default function AdminMessages() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  if (loading) return <div className="p-10 text-gray-500 uppercase font-bold animate-pulse">Loading Inquiries...</div>;

  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center border-b-4 border-[#0A192F] pb-4">
        <h1 className="text-3xl font-black uppercase text-[#0A192F]">Inbox</h1>
        <span className="bg-[#F59E0B] text-[#0A192F] px-4 py-1 font-bold text-sm">
          {messages.length} Requests
        </span>
      </div>

      <div className="grid gap-6">
        {messages.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200">
            <p className="text-gray-400 italic">No project inquiries yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-white shadow-xl border-t-4 border-[#F59E0B]">
              <div className="p-6">
                {/* User Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0A192F] p-2 text-[#F59E0B]">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-[#0A192F] leading-none">{msg.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs font-medium">
                        <Mail size={12} /> {msg.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold bg-slate-100 px-3 py-1">
                    <Calendar size={12} /> {new Date(msg.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Project Specs Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 border-l-2 border-[#0A192F] flex items-center gap-3">
                    <HardHat size={20} className="text-[#F59E0B]" />
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase">Project Type</h4>
                      <p className="text-sm font-bold text-[#0A192F]">{msg.project_type || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 border-l-2 border-[#0A192F] flex items-center gap-3">
                    <MapPin size={20} className="text-[#F59E0B]" />
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase">Location</h4>
                      <p className="text-sm font-bold text-[#0A192F]">{msg.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Message Details */}
                <div className="bg-slate-50 p-4 border-l-2 border-[#0A192F] mb-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2">Project Details</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                </div>

                {/* Callback Action */}
                <div className="flex flex-col justify-center bg-yellow-50 p-4 border-l-2 border-[#F59E0B]">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase mb-1">Direct Callback</h4>
                  <p className="text-xl font-black text-[#0A192F]">{msg.phone}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}