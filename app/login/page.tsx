"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw new Error("Invalid login credentials.");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) throw new Error("Profile not found.");

      if (profile.role === 'admin' || profile.role === 'super_admin') {
        router.push('/admin');
        router.refresh();
      } else {
        await supabase.auth.signOut();
        throw new Error("Access Denied: You do not have admin privileges.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] p-6">
      <div className="bg-white w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-[#F59E0B] p-8 text-[#0A192F] flex flex-col items-center">
          <Lock size={40} className="mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Secure Access</h2>
          <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Internal Portal Only</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-gray-50 border focus:border-[#F59E0B] outline-none transition-all" 
              placeholder="admin@ethioconstruction.com"
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-gray-50 border focus:border-[#F59E0B] outline-none transition-all" 
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-[#0A192F] text-white py-4 font-black uppercase tracking-widest hover:bg-[#F59E0B] hover:text-[#0A192F] transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Enter Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}