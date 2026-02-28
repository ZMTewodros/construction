"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, Mail, Lock, Loader2, RefreshCcw, Trash2 } from 'lucide-react';

export default function ManageUsers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [staff, setStaff] = useState<any[]>([]);
  const [targetEmail, setTargetEmail] = useState('');
  const [targetPassword, setTargetPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchData = async () => {
    setFetching(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['admin', 'super_admin'])
      .order('role', { ascending: false });
    
    setStaff(data || []);
    setFetching(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create the user in Supabase Auth
    // Note: This sends a confirmation email to the user.
    const { data, error: authError } = await supabase.auth.signUp({
      email: targetEmail,
      password: targetPassword,
      options: {
        data: { role: 'admin' } // This metadata is picked up by our SQL trigger
      }
    });

    if (authError) {
      alert(authError.message);
    } else if (data.user) {
      alert(`Success! Admin account created for ${targetEmail}. .`);
      setTargetEmail('');
      setTargetPassword('');
      fetchData();
    }
    
    setLoading(false);
  };

  const removeAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to demote this admin?")) return;
    const { error } = await supabase.from('profiles').update({ role: 'user' }).eq('id', id);
    if (!error) fetchData();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans bg-[#F8F9FD] min-h-screen">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#0A192F] uppercase tracking-tighter">Staff Control</h1>
          <p className="text-gray-400 text-sm">Directly register new administrative accounts</p>
        </div>
        <button onClick={fetchData} className="p-2 text-gray-400 hover:text-blue-600">
          <RefreshCcw size={20} className={fetching ? "animate-spin" : ""}/>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CREATE ADMIN FORM */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 h-fit">
          <div className="flex items-center gap-2 mb-6 text-blue-600 font-bold uppercase text-xs tracking-widest">
            <UserPlus size={18} /> Register New Admin
          </div>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-11 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none text-sm"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                type="password" 
                placeholder="Assign Password" 
                className="w-full pl-11 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none text-sm"
                value={targetPassword}
                onChange={(e) => setTargetPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button disabled={loading} className="w-full bg-[#0A192F] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20">
              {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Create Admin Account"}
            </button>
          </form>
        </div>

        {/* STAFF LIST */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/20">
                  <td className="px-6 py-5 text-sm font-bold text-[#0A192F]">{s.email}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      s.role === 'super_admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {s.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {s.role === 'admin' && (
                      <button onClick={() => removeAdmin(s.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
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