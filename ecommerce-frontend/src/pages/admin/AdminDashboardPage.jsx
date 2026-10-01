import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${Number(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
      badge: '+18.2% from last month',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      badge: `${stats?.pendingOrdersCount || 0} need processing`,
    },
    {
      title: 'Active Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
      badge: `${stats?.lowStockProductsCount || 0} low stock items`,
    },
    {
      title: 'Registered Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-amber-50 text-amber-600',
      badge: 'Active platform members',
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time statistics, metrics, and store operations</p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">{card.value}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-2 flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
                  <span>{card.badge}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Low Stock Alert & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Low Stock Inventory</h2>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-purple-600 hover:text-purple-700">
              Manage All →
            </Link>
          </div>

          {stats?.lowStockProducts?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">All inventory levels are healthy!</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats?.lowStockProducts?.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.brand} • {item.categoryName}</div>
                  </div>
                  <span className="bg-rose-50 text-rose-600 font-black text-xs px-3 py-1 rounded-full border border-rose-200">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Products by Category</h2>
            <Link to="/admin/categories" className="text-xs font-bold text-purple-600 hover:text-purple-700">
              Manage →
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.categoryProductDistribution &&
              Object.entries(stats.categoryProductDistribution).map(([category, count]) => {
                const total = stats.totalProducts || 1;
                const percentage = Math.round((count / total) * 100);

                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{category}</span>
                      <span className="text-slate-400">{count} items ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-400 mt-0.5">Most recent orders needing fulfillment</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          >
            <span>All Orders</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Order ID</th>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {stats?.recentOrders?.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">#{ord.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{ord.userName}</div>
                    <div className="text-[11px] text-slate-400">{ord.userEmail}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">${Number(ord.totalAmount).toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
