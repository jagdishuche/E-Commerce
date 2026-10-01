import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Package, Heart, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ name });
    setSaving(false);
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent Member';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Role</div>
            <div className="text-lg font-black text-slate-900">{user?.role}</div>
          </div>
        </div>

        <Link
          to="/orders"
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Orders</div>
            <div className="text-lg font-black text-slate-900">View History →</div>
          </div>
        </Link>

        <Link
          to="/wishlist"
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Wishlist</div>
            <div className="text-lg font-black text-slate-900">{wishlistCount} Saved</div>
          </div>
        </Link>
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">
          Personal Information
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address (Read-only)</label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Member since: {joinedDate}</span>
          </div>

          <div className="pt-2 flex items-center space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Details'}</span>
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center space-x-2 text-rose-600 hover:text-rose-700 text-xs font-bold px-4 py-3 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
