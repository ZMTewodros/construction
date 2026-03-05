"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Briefcase, 
  Star, 
  MessageSquare, 
  Users, 
  LogOut, 
  LayoutDashboard, 
  Loader2,
  Hammer,
  Handshake,
  Settings // NEW ICON
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();

      if (!data || (data.role !== 'admin' && data.role !== 'super_admin')) {
        await supabase.auth.signOut();
        router.push('/login');
      } else {
        setRole(data.role);
      }
      setLoading(false);
    };
    checkRole();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#F59E0B]" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Authenticating...</p>
      </div>
    </div>
  );

  // ADDED 'Settings' TO THIS LIST
  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Services', href: '/admin/manage-services', icon: Hammer },
    { name: 'Partners', href: '/admin/partners', icon: Handshake },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings }, // NEW SETTINGS LINK
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0A192F] text-white flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <Link href="/">
            <h1 className="text-xl font-black text-[#F59E0B] tracking-tighter hover:opacity-80 transition-opacity">
              Tihut Admin
            </h1>
          </Link>
          <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-widest">
            {role?.replace('_', ' ')}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all text-[11px] font-bold uppercase tracking-widest group ${
                  isActive 
                    ? 'bg-[#F59E0B] text-[#0A192F] shadow-lg shadow-orange-500/20' 
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                <item.icon size={18} className={`${isActive ? 'text-[#0A192F]' : 'text-slate-500 group-hover:text-[#F59E0B]'}`} /> 
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* SIGN OUT SECTION */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 min-h-screen bg-slate-50">
        {/* Header Strip for Admin */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#0A192F] font-bold text-xs">
                    {role?.[0].toUpperCase()}
                </div>
            </div>
        </header>

        <div className="p-8 lg:p-10 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}