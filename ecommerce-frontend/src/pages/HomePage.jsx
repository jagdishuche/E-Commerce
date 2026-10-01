import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Tag,
  Star,
  Layers
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, trendRes, catRes] = await Promise.all([
          productApi.getFeatured(),
          productApi.getTrending(),
          categoryApi.getCategories(),
        ]);

        if (featRes.success && featRes.data) setFeaturedProducts(featRes.data);
        if (trendRes.success && trendRes.data) setTrendingProducts(trendRes.data);
        if (catRes.success && catRes.data) setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10" />
        
        {/* Decorative background image */}
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80"
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 transform scale-105 filter blur-[1px]"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-20 lg:py-32 flex flex-col justify-center min-h-[520px]">
          <div className="inline-flex items-center space-x-2 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6 w-max backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Living & Style</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-2xl leading-[1.1] mb-6">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">Modern Performance</span>.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-normal">
            Elevate your workspace and wardrobe with timeless precision craftsmanship, ultra-fast shipping, and world-class customer protection.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              to="/products"
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products?category=1"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition-all"
            >
              Shop Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Browse collections tailored to every lifestyle</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const icons = ['💻', '👕', '🎧', '🛋️', '⚡', '🎒'];
            const bgGradients = [
              'from-blue-500 to-indigo-600',
              'from-rose-500 to-pink-600',
              'from-purple-500 to-violet-600',
              'from-amber-500 to-orange-600',
              'from-emerald-500 to-teal-600',
              'from-cyan-500 to-blue-600',
            ];

            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-center hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-brand-50 flex items-center justify-center text-2xl mb-3 shadow-inner transition-colors">
                  {icons[idx % icons.length]}
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {cat.productCount ? `${cat.productCount} items` : 'Discover'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 fill-brand-600" />
              <span>Highest Rated</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>See More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-700 p-8 sm:p-12 text-white overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-4 backdrop-blur-md">
              Limited Time Promo
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Get 20% Off Your Entire First Order
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base mb-6">
              Use promo code <span className="bg-white text-brand-800 font-extrabold px-2 py-0.5 rounded-lg shadow-sm">NOVA20</span> during checkout to claim your instant savings.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl shadow-md transition-all"
            >
              <span>Shop the Sale</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-center">
            <Tag className="w-72 h-72 text-white transform rotate-12" />
          </div>
        </div>
      </section>

      {/* Trending / New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Fresh Releases</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trending Right Now</h2>
          </div>
          <Link
            to="/products?sortBy=createdAt&sortDir=desc"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
