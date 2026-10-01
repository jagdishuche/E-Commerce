import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/common/EmptyState';

const CartPage = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NOVA20') {
      setDiscountPercent(0.20);
      setPromoApplied(true);
      addToast('Promo code applied: 20% Discount!', 'success');
    } else {
      addToast('Invalid promo code. Try "NOVA20"', 'error');
    }
  };

  const discountAmount = Math.round(totalPrice * discountPercent * 100) / 100;
  const shippingFee = totalPrice >= 75 || totalPrice === 0 ? 0.00 : 9.99;
  const finalTotal = Math.max(0, Math.round((totalPrice - discountAmount + shippingFee) * 100) / 100);

  if (items.length === 0 && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping cart is empty"
          description="Explore our handpicked collections and find premium gear tailored to you."
          actionText="Start Shopping Now"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-slate-500 mt-1">Review your items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5 transition-all hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                <img
                  src={item.productImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                  alt={item.productName}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.productBrand}
                </div>
                <Link
                  to={`/products/${item.productId}`}
                  className="text-base font-bold text-slate-900 hover:text-brand-600 truncate block transition-colors"
                >
                  {item.productName}
                </Link>
                <div className="text-sm font-semibold text-slate-500 mt-1">
                  ${Number(item.unitPrice).toFixed(2)} each
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-slate-900 min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div className="text-right flex items-center sm:flex-col sm:items-end justify-between w-full sm:w-auto gap-2">
                <div className="text-base font-extrabold text-slate-900">
                  ${Number(item.subtotal).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="pt-4">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
          <h2 className="text-lg font-black text-slate-900 tracking-tight pb-4 border-b border-slate-100">
            Order Summary
          </h2>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">Promo Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Try NOVA20"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-semibold text-slate-800 outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>20% Discount code active!</span>
              </p>
            )}
          </form>

          {/* Cost breakdown */}
          <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${totalPrice.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount (20%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? (
                  <span className="text-brand-600 font-bold">FREE</span>
                ) : (
                  `$${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>

            {shippingFee > 0 && (
              <p className="text-[11px] text-slate-400">
                Add ${(75 - totalPrice).toFixed(2)} more to qualify for Free Shipping!
              </p>
            )}

            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
              <span>Total</span>
              <span className="text-xl text-brand-600">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout', { state: { discountPercent, finalTotal } })}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted SSL checkout transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
