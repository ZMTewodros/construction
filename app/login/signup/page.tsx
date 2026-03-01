"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Loader2, CheckCircle2 } from 'lucide-react';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // 1. Create Auth User
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;

      if (data.user) {
        // 2. Create Profile with 'user' role
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id, 
            email: email,
            full_name: fullName,
            role: 'user' 
          });

        if (profileError) throw profileError;

        setStatus({ type: 'success', text: "Registration successful! Redirecting to login..." });
        
        // 3. Redirect to login after 2 seconds
        setTimeout(() => router.push('/login?message=registered'), 2000);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', text: err.message || "Failed to create account." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#F59E0B] p-8 text-[#0A192F] text-center">
          <UserPlus size={48} className="mx-auto mb-2" />
          <h1 className="text-3xl font-black uppercase tracking-tighter">Join Ethio</h1>
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Create Account</p>
        </div>

        <form onSubmit={handleSignUp} className="p-8 space-y-4">
          {status && (
            <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
              status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>
              {status.type === 'success' && <CheckCircle2 size={16} />}
              {status.text}
            </div>
          )}

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Full Name</label>
            <input type="text" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#F59E0B] rounded-xl outline-none font-bold text-[#0A192F]"
              placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Email</label>
            <input type="email" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#F59E0B] rounded-xl outline-none font-bold text-[#0A192F]"
              placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#F59E0B] rounded-xl outline-none font-bold text-[#0A192F]"
              onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button disabled={loading} className="w-full bg-[#0A192F] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#F59E0B] hover:text-[#0A192F] transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
          </button>

          <div className="text-center pt-4 border-t border-gray-50">
            <Link href="/login" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#0A192F] tracking-widest">
              Already have an account? <span className="text-[#F59E0B]">Log In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}