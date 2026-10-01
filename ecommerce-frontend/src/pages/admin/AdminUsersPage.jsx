import React, { useEffect, useState } from 'react';
import { Users, Shield, UserCheck, ShieldAlert } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminApi.updateUserRole(userId, newRole);
      if (res.success) {
        addToast(`User role updated to ${newRole}`, 'success');
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      addToast(err.message || 'Failed to update user role', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">View registered customer accounts and modify administrative roles</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Email Address</th>
              <th className="py-4 px-6">Role Assignment</th>
              <th className="py-4 px-6">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {users.map((u) => {
              const isAdmin = u.role === 'ADMIN';

              return (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        isAdmin
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                      <div className="text-[11px] text-slate-400">ID #{u.id}</div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-slate-700 font-medium">
                    {u.email}
                  </td>

                  <td className="py-4 px-6">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className={`font-bold text-xs rounded-xl px-3 py-1.5 border outline-none cursor-pointer ${
                        isAdmin
                          ? 'bg-purple-50 text-purple-700 border-purple-200 focus:border-purple-500'
                          : 'bg-slate-50 text-slate-700 border-slate-200 focus:border-purple-500'
                      }`}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td className="py-4 px-6 text-slate-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
