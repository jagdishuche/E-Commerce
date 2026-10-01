import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  RotateCcw
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven query states
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const brandParam = searchParams.get('brand');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const minRatingParam = searchParams.get('minRating');
  const sortByParam = searchParams.get('sortBy') || 'createdAt';
  const sortDirParam = searchParams.get('sortDir') || 'desc';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);

  // Component states
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 0, totalPages: 1, totalElements: 0 });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Local filter form state
  const [searchInput, setSearchInput] = useState(searchParam || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const [selectedBrand, setSelectedBrand] = useState(brandParam || '');
  const [maxPrice, setMaxPrice] = useState(maxPriceParam || 2000);
  const [minRating, setMinRating] = useState(minRatingParam || '');

  // Synchronize state when URL query params change
  useEffect(() => {
    setSearchInput(searchParam || '');
    setSelectedCategory(categoryParam || '');
    setSelectedBrand(brandParam || '');
    setMaxPrice(maxPriceParam || 2000);
    setMinRating(minRatingParam || '');
  }, [categoryParam, searchParam, brandParam, minPriceParam, maxPriceParam, minRatingParam]);

  // Load Categories & Brands
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryApi.getCategories(),
          productApi.getBrands(),
        ]);
        if (catRes.success && catRes.data) setCategories(catRes.data);
        if (brandRes.success && brandRes.data) setBrands(brandRes.data);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products based on URL query params
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pageParam,
        size: 12,
        sortBy: sortByParam,
        sortDir: sortDirParam,
      };

      if (searchParam) params.search = searchParam;
      if (categoryParam) params.categoryId = categoryParam;
      if (brandParam) params.brand = brandParam;
      if (maxPriceParam) params.maxPrice = maxPriceParam;
      if (minRatingParam) params.minRating = minRatingParam;

      const res = await productApi.getProducts(params);
      if (res.success && res.data) {
        setProducts(res.data.content);
        setPageInfo({
          pageNo: res.data.pageNo,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
        });
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }, [pageParam, sortByParam, sortDirParam, searchParam, categoryParam, brandParam, maxPriceParam, minRatingParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply filters to URL
  const applyFilters = (updates = {}) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Default resets page to 0 on new filter
    newParams.set('page', '0');

    if (updates.search !== undefined) {
      if (updates.search) newParams.set('search', updates.search);
      else newParams.delete('search');
    }
    if (updates.category !== undefined) {
      if (updates.category) newParams.set('category', updates.category);
      else newParams.delete('category');
    }
    if (updates.brand !== undefined) {
      if (updates.brand) newParams.set('brand', updates.brand);
      else newParams.delete('brand');
    }
    if (updates.maxPrice !== undefined) {
      if (updates.maxPrice && updates.maxPrice < 2000) newParams.set('maxPrice', updates.maxPrice);
      else newParams.delete('maxPrice');
    }
    if (updates.minRating !== undefined) {
      if (updates.minRating) newParams.set('minRating', updates.minRating);
      else newParams.delete('minRating');
    }
    if (updates.sortBy !== undefined) {
      newParams.set('sortBy', updates.sortBy);
    }
    if (updates.sortDir !== undefined) {
      newParams.set('sortDir', updates.sortDir);
    }

    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMaxPrice(2000);
    setMinRating('');
    setSearchParams(new URLSearchParams());
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === 'price-asc') applyFilters({ sortBy: 'price', sortDir: 'asc' });
    else if (val === 'price-desc') applyFilters({ sortBy: 'price', sortDir: 'desc' });
    else if (val === 'rating-desc') applyFilters({ sortBy: 'rating', sortDir: 'desc' });
    else applyFilters({ sortBy: 'createdAt', sortDir: 'desc' });
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Sidebar Content (used in desktop sidebar & mobile drawer)
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header with clear button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={handleResetFilters}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">Categories</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2.5 text-sm text-slate-700 hover:text-brand-600 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => {
                setSelectedCategory('');
                applyFilters({ category: '' });
              }}
              className="accent-brand-600"
            />
            <span className={selectedCategory === '' ? 'font-bold text-brand-600' : ''}>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center space-x-2.5 text-sm text-slate-700 hover:text-brand-600 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.id.toString()}
                onChange={() => {
                  setSelectedCategory(cat.id.toString());
                  applyFilters({ category: cat.id.toString() });
                }}
                className="accent-brand-600"
              />
              <span className={selectedCategory === cat.id.toString() ? 'font-bold text-brand-600' : ''}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          <label className="flex items-center space-x-2.5 text-sm text-slate-700 hover:text-brand-600 cursor-pointer">
            <input
              type="radio"
              name="brand"
              checked={selectedBrand === ''}
              onChange={() => {
                setSelectedBrand('');
                applyFilters({ brand: '' });
              }}
              className="accent-brand-600"
            />
            <span className={selectedBrand === '' ? 'font-bold text-brand-600' : ''}>All Brands</span>
          </label>
          {brands.map((b) => (
            <label
              key={b}
              className="flex items-center space-x-2.5 text-sm text-slate-700 hover:text-brand-600 cursor-pointer"
            >
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === b}
                onChange={() => {
                  setSelectedBrand(b);
                  applyFilters({ brand: b });
                }}
                className="accent-brand-600"
              />
              <span className={selectedBrand === b ? 'font-bold text-brand-600' : ''}>
                {b}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Max Price</h4>
          <span className="text-sm font-bold text-slate-900">${maxPrice}</span>
        </div>
        <input
          type="range"
          min="50"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onMouseUp={() => applyFilters({ maxPrice })}
          onTouchEnd={() => applyFilters({ maxPrice })}
          className="w-full accent-brand-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>$50</span>
          <span>$2,000</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                const newR = minRating === r.toString() ? '' : r.toString();
                setMinRating(newR);
                applyFilters({ minRating: newR });
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition-all ${
                minRating === r.toString()
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-amber-400">
                {[...Array(r)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
                <span className="text-slate-800 ml-1 font-bold">{r} Stars & Up</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {searchParam ? `Results for "${searchParam}"` : 'All Products'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing {pageInfo.totalElements} premium items ready to ship
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filters</span>
          </button>

          {/* Sort Select */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={`${sortByParam}-${sortDirParam}`}
              onChange={handleSortChange}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-500 shadow-sm cursor-pointer"
            >
              <option value="createdAt-desc">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit sticky top-28">
          <FilterContent />
        </aside>

        {/* Products Grid Content */}
        <main className="lg:col-span-3">
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products matched your criteria"
              description="Try adjusting your filters, price range, or search keywords to find what you are looking for."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-8 border-t border-slate-100">
                  <button
                    onClick={() => handlePageChange(pageInfo.pageNo - 1)}
                    disabled={pageInfo.pageNo === 0}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(pageInfo.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        pageInfo.pageNo === i
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pageInfo.pageNo + 1)}
                    disabled={pageInfo.pageNo === pageInfo.totalPages - 1}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 overflow-y-auto shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
