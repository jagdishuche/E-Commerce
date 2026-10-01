import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const discountPercent = location.state?.discountPercent || 0;
  const discountAmount = Math.round(totalPrice * discountPercent * 100) / 100;
  const shippingFee = totalPrice >= 75 || totalPrice === 0 ? 0.00 : 9.99;
  const grandTotal = Math.max(0, Math.round((totalPrice - discountAmount + shippingFee) * 100) / 100);

  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    streetAddress: '100 Innovation Way',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    phone: '+1 (555) 019-2834',
    paymentMethod: 'CREDIT_CARD', // 'CREDIT_CARD', 'PAYPAL', 'COD'
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      addToast('Your cart is empty', 'warning');
      navigate('/cart');
      return;
    }

    const fullShippingAddress = `${formData.fullName}, ${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.postalCode}. Phone: ${formData.phone}`;

    try {
      setLoading(true);
      const res = await orderApi.createOrder({
        shippingAddress: fullShippingAddress,
        paymentMethod: formData.paymentMethod,
      });

      if (res.success && res.data) {
        addToast('Order placed successfully! Thank you for your purchase.', 'success');
        clearCart();
        navigate(`/orders`);
      }
    } catch (err) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Shipping Details & Payment Options */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-brand-600" />
              <span>1. Shipping Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Recipient Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Street Address</label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-brand-600" />
              <span>2. Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'CREDIT_CARD'
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-slate-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CREDIT_CARD"
                    checked={formData.paymentMethod === 'CREDIT_CARD'}
                    onChange={handleInputChange}
                    className="accent-brand-600"
                  />
                </div>
                <div className="text-sm font-bold">Credit / Debit Card</div>
                <div className="text-[11px] text-slate-400 mt-1">Instant confirmation</div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'PAYPAL'
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-blue-600 text-sm">PayPal</span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYPAL"
                    checked={formData.paymentMethod === 'PAYPAL'}
                    onChange={handleInputChange}
                    className="accent-brand-600"
                  />
                </div>
                <div className="text-sm font-bold">PayPal Wallet</div>
                <div className="text-[11px] text-slate-400 mt-1">Express fast checkout</div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'COD'
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Truck className="w-5 h-5 text-slate-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleInputChange}
                    className="accent-brand-600"
                  />
                </div>
                <div className="text-sm font-bold">Cash on Delivery</div>
                <div className="text-[11px] text-slate-400 mt-1">Pay when package arrives</div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Place Order */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
          <h2 className="text-lg font-black text-slate-900 tracking-tight pb-4 border-b border-slate-100">
            Items in Order ({items.length})
          </h2>

          {/* Item previews */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 text-xs">
                <img
                  src={item.productImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                  alt={item.productName}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">{item.productName}</div>
                  <div className="text-slate-400">Qty: {item.quantity}</div>
                </div>
                <div className="font-bold text-slate-900">
                  ${Number(item.subtotal).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2.5 text-sm border-t border-slate-100 pt-4">
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${totalPrice.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold text-xs">
                <span>Promo Discount (20%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500 text-xs">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
              <span>Grand Total</span>
              <span className="text-xl text-brand-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Processing Order...' : `Pay $${grandTotal.toFixed(2)}`}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
