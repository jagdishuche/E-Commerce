import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import EmptyState from '../components/common/EmptyState';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getUserOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Delivered</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 rounded-full text-xs font-bold">
            <Truck className="w-3.5 h-3.5 text-sky-500" />
            <span>Shipped</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Processing</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-44 bg-slate-200 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders yet. Discover our curated collections and grab something you love!"
          actionText="Explore Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and track your recent e-commerce purchases</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const dateStr = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'Recent';

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {/* Card Header */}
              <div className="bg-slate-50/80 p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Order Placed</span>
                    <span className="font-bold text-slate-900">{dateStr}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Total Amount</span>
                    <span className="font-extrabold text-slate-900">${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Ship To</span>
                    <span className="font-bold text-slate-900 truncate max-w-xs block" title={order.shippingAddress}>
                      {order.userName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(order.status)}
                  <span className="font-mono text-xs font-bold text-slate-400">
                    #{order.id}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 divide-y divide-slate-100">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0">
                        <img
                          src={item.productImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                          alt={item.productName}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.productBrand}
                        </div>
                        <Link
                          to={`/products/${item.productId}`}
                          className="text-sm font-bold text-slate-900 hover:text-brand-600 truncate block transition-colors"
                        >
                          {item.productName}
                        </Link>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900">
                        ${Number(item.subtotal).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-2">Item details unavailable</p>
                )}
              </div>

              {/* Card Footer */}
              <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap justify-between items-center gap-2">
                <span>Shipping Address: <strong className="text-slate-700">{order.shippingAddress}</strong></span>
                <span className="font-semibold text-emerald-600">Payment: {order.paymentStatus}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
