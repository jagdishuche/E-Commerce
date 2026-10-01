import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Check,
  Share2,
  ChevronRight,
  Send,
  MessageSquare
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { reviewApi } from '../api/reviewApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RatingStars from '../components/common/RatingStars';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'reviews', 'shipping'

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const [prodRes, revRes] = await Promise.all([
          productApi.getProductById(id),
          reviewApi.getProductReviews(id),
        ]);

        if (prodRes.success && prodRes.data) setProduct(prodRes.data);
        if (revRes.success && revRes.data) setReviews(revRes.data);
      } catch (err) {
        console.error('Failed to load product details', err);
        addToast('Product not found', 'error');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id, navigate, addToast]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const success = await addToCart(product, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to post a review', 'warning');
      return;
    }
    if (!reviewComment.trim()) {
      addToast('Please write a review comment', 'warning');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewApi.addReview(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      if (res.success && res.data) {
        setReviews([res.data, ...reviews]);
        setReviewComment('');
        addToast('Thank you for your feedback! Review posted.', 'success');
        // Refresh product to get updated average rating
        const updatedProd = await productApi.getProductById(id);
        if (updatedProd.success && updatedProd.data) {
          setProduct(updatedProd.data);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="h-[480px] bg-slate-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
            <div className="h-12 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
        <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-slate-600 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/products?category=${product.categoryId}`}
          className="hover:text-slate-600 transition-colors"
        >
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Image */}
        <div className="relative bg-white rounded-3xl border border-slate-100 p-4 shadow-sm overflow-hidden group">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Quick Floating Badges */}
          <div className="absolute top-8 left-8 flex flex-col gap-2">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {product.brand}
            </span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Low Stock: Only {product.stock} units!
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
              {product.categoryName}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mt-3">
              <RatingStars rating={product.rating} count={product.reviewCount} size="w-5 h-5" />
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">
                {reviews.length} Customer Reviews
              </span>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="flex items-baseline space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-lg">
              In Stock & Ready to Ship
            </span>
          </div>

          {/* Short description */}
          <p className="text-slate-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold uppercase text-slate-500">Quantity</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-slate-900 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 font-bold transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-400">
                ({product.stock} available)
              </span>
            </div>

            {/* Main Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-slate-900 hover:bg-brand-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-brand-600/30 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                  isFavorite
                    ? 'border-rose-300 bg-rose-50 text-rose-500'
                    : 'border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-500 bg-white'
                }`}
                title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
              <Truck className="w-5 h-5 text-brand-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Fast Shipping</span>
              <span className="text-[10px] text-slate-400">2-3 Business Days</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-brand-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Authentic</span>
              <span className="text-[10px] text-slate-400">100% Genuine</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
              <RefreshCw className="w-5 h-5 text-brand-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">30-Day Return</span>
              <span className="text-[10px] text-slate-400">Hassle-Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Reviews */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <div className="flex border-b border-slate-100 space-x-8 mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'description'
                ? 'text-brand-600'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Detailed Description
            {activeTab === 'description' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center space-x-2 ${
              activeTab === 'reviews'
                ? 'text-brand-600'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
              {reviews.length}
            </span>
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'description' && (
          <div className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
            <p>{product.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Brand</span>
                <span className="text-slate-900 font-bold">{product.brand}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Category</span>
                <span className="text-slate-900 font-bold">{product.categoryName}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Stock Available</span>
                <span className="text-slate-900 font-bold">{product.stock} units</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Product ID</span>
                <span className="text-slate-900 font-mono font-bold">#{product.id}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Add Review Box */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-brand-600" />
                <span>Write a Product Review</span>
              </h3>
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      Your Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        {reviewRating} out of 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      Your Review
                    </label>
                    <textarea
                      rows="3"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you like or dislike about this product? Share your honest thoughts..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                  </button>
                </form>
              ) : (
                <div className="text-sm text-slate-600 flex items-center justify-between">
                  <span>Please sign in to your account to submit a review for this product.</span>
                  <Link
                    to="/login"
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">
                  No reviews yet for this product. Be the first to share your thoughts!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {rev.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{rev.userName}</div>
                          <div className="text-[11px] text-slate-400">Verified Buyer</div>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} showScore={false} size="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm text-slate-600 pt-1 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
