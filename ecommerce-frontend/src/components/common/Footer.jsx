import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Free Express Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">Orders over $75 arrive in 2-3 days</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">100% Secure Checkout</h4>
                <p className="text-xs text-slate-400 mt-0.5">256-bit encrypted card payments</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">30-Day Easy Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">No questions asked return policy</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">24/7 Expert Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Ready to assist around the clock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                NOVA<span className="text-brand-500">STORE</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              Discover curated luxury essentials, cutting-edge technology, and everyday premium apparel engineered for modern lifestyles.
            </p>
            <div className="pt-2">
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-800 text-slate-200 text-sm px-4 py-2.5 rounded-l-xl outline-none focus:ring-1 focus:ring-brand-500 flex-1 border border-slate-700"
                />
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold px-4 py-2.5 rounded-r-xl transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">Categories</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/products?category=1" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=2" className="hover:text-white transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=3" className="hover:text-white transition-colors">Audio & Gadgets</Link></li>
              <li><Link to="/products?category=4" className="hover:text-white transition-colors">Home & Living</Link></li>
              <li><Link to="/products?category=5" className="hover:text-white transition-colors">Sports & Fitness</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Account Settings</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">NovaStore</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">About Us</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Careers</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NovaStore Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
            <span>Google Pay</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
