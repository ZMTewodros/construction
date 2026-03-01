"use client";
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, UserPlus, Loader2, ShieldCheck, User, AlertTriangle } from 'lucide-react';

export default function ManageAdmins() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 1. We keep fetchUsers stable with useCallback
  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: true });
      
      if (!error) {
        setUsers(data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fixed Effect: Calls the stable function
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      fetchUsers();
    }

    return () => { isMounted = false; };
  }, [fetchUsers]);

  const toggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    
    if (!error) {
      fetchUsers();
    }
  };

  const deleteUserPermanently = async (userId: string, email: string) => {
    const confirmDelete = confirm(
      `WARNING: This will permanently delete ${email} and their login access. They will NOT be able to log in anymore. Proceed?`
    );
    
    if (!confirmDelete) return;

    setIsDeleting(userId);
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      alert("Error deleting user: " + error.message);
      setIsDeleting(null);
    } else {
      // Optimistic update: remove from state immediately
      setUsers(prev => prev.filter(u => u.id !== userId));
      setIsDeleting(null);
      alert("User and Auth account deleted successfully.");
    }
  };

  if (loading) {
    return (
      <div className="flex py-40 justify-center">
        <Loader2 className="animate-spin text-[#F59E0B]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#0A192F] uppercase tracking-tight">User Permissions</h1>
          <p className="text-gray-500 font-medium">Full control over internal access.</p>
        </div>
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-red-100">
          <AlertTriangle size={14} /> Super Admin Power Active
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">User Details</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="p-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[#0A192F] text-[#F59E0B] flex items-center justify-center font-black">
                        {u.full_name ? u.full_name.substring(0,2).toUpperCase() : <User size={18}/>}
                      </div>
                      <div>
                        <div className="font-bold text-[#0A192F]">{u.full_name || "New User"}</div>
                        <div className="text-xs text-gray-400 font-medium">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      u.role === 'super_admin' ? 'bg-amber-100 text-amber-700' :
                      u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {u.role !== 'super_admin' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleAdmin(u.id, u.role)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Toggle Admin Access"
                        >
                          {u.role === 'admin' ? <ShieldCheck size={20} /> : <UserPlus size={20} />}
                        </button>
                        <button 
                          onClick={() => deleteUserPermanently(u.id, u.email)}
                          disabled={isDeleting === u.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                          title="Delete Permanently"
                        >
                          {isDeleting === u.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}