"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Briefcase, Star, MessageSquare, Users, LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkRole = async () => {
      // Get the current session user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch the role from the profiles table
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Lock out anyone who isn't an admin or super_admin
      if (!data || (data.role !== 'admin' && data.role !== 'super_admin')) {
        await supabase.auth.signOut();
        router.push('/login');
      } else {
        setRole(data.role);
      }
    };
    checkRole();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse font-black text-[#0A192F] uppercase tracking-widest">
          Verifying Credentials...
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A192F] text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-black text-[#F59E0B] tracking-tighter uppercase">Ethio Admin</h1>
          <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-widest">
            {role.replace('_', ' ')}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-xs font-bold uppercase tracking-widest ${
                pathname === item.href 
                ? 'bg-[#F59E0B] text-[#0A192F]' 
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}

          {role === 'super_admin' && (
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-xs font-bold uppercase tracking-widest mt-10 ${
                pathname === '/admin/users' ? 'bg-red-600 text-white' : 'text-red-400 hover:bg-red-900/20'
              }`}
            >
              <Users size={18} />
              Manage Admins
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Offset for sidebar */}
      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}