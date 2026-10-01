import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        addToast(`Order #${orderId} marked as ${newStatus}`, 'success');
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      }
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return (o.status || '').toUpperCase() === filterStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders Management</h1>
          <p className="text-sm text-slate-500 mt-1">Review, fulfill, and update shipment progression</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status Action</th>
                <th className="py-4 px-6">Order Date</th>
                <th className="py-4 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.map((ord) => {
                const isExpanded = expandedOrderId === ord.id;

                return (
                  <React.Fragment key={ord.id}>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        #{ord.id}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{ord.userName}</div>
                        <div className="text-[11px] text-slate-400">{ord.userEmail}</div>
                      </td>

                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        ${Number(ord.totalAmount).toFixed(2)}
                      </td>

                      <td className="py-4 px-6">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-purple-500 cursor-pointer"
                        >
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 rounded-lg transition-colors inline-flex items-center space-x-1"
                        >
                          <span>{isExpanded ? 'Hide' : 'View'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Order Details Row */}
                    {isExpanded && (
                      <tr className="bg-purple-50/30">
                        <td colSpan="6" className="p-6">
                          <div className="bg-white rounded-2xl border border-purple-100 p-5 space-y-4 shadow-xs">
                            <div className="text-xs text-slate-700">
                              <strong>Delivery Address:</strong> {ord.shippingAddress}
                            </div>
                            <div className="text-xs text-slate-700">
                              <strong>Payment Status:</strong> {ord.paymentStatus}
                            </div>

                            <div className="border-t border-slate-100 pt-3">
                              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Purchased Items:</h4>
                              <div className="space-y-2">
                                {ord.orderItems?.map((it) => (
                                  <div key={it.id} className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-slate-800">
                                      {it.productName} × {it.quantity}
                                    </span>
                                    <span className="font-mono font-bold text-slate-900">
                                      ${Number(it.subtotal).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
