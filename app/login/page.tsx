"use client";
import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, ShieldAlert, UserPlus, Home } from 'lucide-react'; // Added Home icon
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string, showSignUp?: boolean } | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('message') === 'registered';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      if (authError.message.toLowerCase().includes("invalid login credentials")) {
        setError({ 
          message: "No account found. Please sign up first!", 
          showSignUp: true 
        });
      } else {
        setError({ message: authError.message });
      }
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      setError({ message: "ACCESS DENIED: You must get admin access from the Super Admin." });
      await supabase.auth.signOut();
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* --- UPDATED HEADER WITH LINK --- */}
        <Link 
          href="/" 
          className="block bg-[#F59E0B] p-10 text-[#0A192F] text-center hover:bg-[#e08e0a] transition-colors group"
        >
          <Lock size={40} className="mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h1 className="text-2xl font-black uppercase tracking-tighter">Ethio Admin</h1>
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase mt-2 opacity-60">
            <Home size={12} /> Back to Website
          </div>
        </Link>
        {/* --------------------------------- */}

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {registered && !error && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100 text-center">
              Account Created. Please Login.
            </div>
          )}

          {error && (
            <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex flex-col gap-3 border leading-tight ${
              error.showSignUp ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="shrink-0" />
                {error.message}
              </div>
              
              {error.showSignUp && (
                <button 
                  type="button"
                  onClick={() => router.push('/login/signup')}
                  className="flex items-center justify-center gap-2 bg-[#F59E0B] text-[#0A192F] py-2 rounded-lg hover:bg-opacity-90 transition-all"
                >
                  <UserPlus size={14} /> Go to Sign Up
                </button>
              )}
            </div>
          )}

          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#F59E0B] rounded-xl outline-none font-bold text-[#0A192F]"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#F59E0B] rounded-xl outline-none font-bold text-[#0A192F]"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-[#0A192F] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#F59E0B] hover:text-[#0A192F] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          </button>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Need access? <Link href="/login/signup" className="text-[#F59E0B] hover:underline">Request Registration</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A192F] flex items-center justify-center text-white font-black uppercase tracking-widest animate-pulse">Loading Auth...</div>}>
      <LoginForm />
    </Suspense>
  );
}