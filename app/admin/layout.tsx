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
  Hammer // Icon for Services
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { 
        router.push('/login'); 
        return; 
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

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

  // Improved loading state
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#F59E0B]" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Authenticating...</p>
      </div>
    </div>
  );

  // Updated Navigation Items
  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Services', href: '/admin/manage-services', icon: Hammer }, // NEW ITEM
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0A192F] text-white flex flex-col fixed h-full z-50">
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

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-xs font-bold uppercase tracking-widest ${
                  isActive 
                    ? 'bg-[#F59E0B] text-[#0A192F]' 
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <item.icon size={18} /> {item.name}
              </Link>
            );
          })}

          {/* Super Admin Section */}
          {role === 'super_admin' && (
            <div className="pt-6 mt-6 border-t border-slate-800">
              <Link 
                href="/admin/users" 
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-xs font-bold uppercase tracking-widest ${
                  pathname === '/admin/users' 
                    ? 'bg-red-600 text-white' 
                    : 'text-red-400 hover:bg-red-900/10'
                }`}
              >
                <Users size={18} /> Manage Users
              </Link>
            </div>
          )}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 min-h-screen relative">
        {/* You can add a top-bar here if needed */}
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}