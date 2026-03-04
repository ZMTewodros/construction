"use client";
import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, UserPlus, Loader2, ShieldCheck, User, Search, Filter } from 'lucide-react';

export default function ManageAdmins() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Client-side filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = 
        (u.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (u.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

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
      `WARNING: This will permanently delete ${email}. Proceed?`
    );
    if (!confirmDelete) return;

    setIsDeleting(userId);
    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) {
      alert("Error: " + error.message);
      setIsDeleting(null);
    } else {
      setUsers(prev => prev.filter(u => u.id !== userId));
      setIsDeleting(null);
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0A192F] uppercase tracking-tight">User Permissions</h1>
          <p className="text-gray-500 font-medium">Full control over internal access.</p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all shadow-sm"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer shadow-sm"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admins</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-[#0A192F] text-[#F59E0B] flex items-center justify-center font-black shrink-0">
                          {u.full_name ? u.full_name.substring(0,2).toUpperCase() : <User size={18}/>}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-[#0A192F] truncate">{u.full_name || "New User"}</div>
                          <div className="text-xs text-gray-400 font-medium truncate">{u.email}</div>
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
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-20 text-center text-gray-400 font-medium">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}