import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import RatingStars from './RatingStars';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Product Image & Badges */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Stock / Discount Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.categoryName && (
            <span className="bg-white/90 backdrop-blur-md text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {product.categoryName}
            </span>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Only {product.stock} left!
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-rose-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {product.brand}
          </div>
          <Link
            to={`/products/${product.id}`}
            className="block text-base font-bold text-slate-900 hover:text-brand-600 line-clamp-1 mb-2 transition-colors"
            title={product.name}
          >
            {product.name}
          </Link>
          <div className="mb-3">
            <RatingStars rating={product.rating} count={product.reviewCount} />
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <div className="text-xs text-slate-400">Price</div>
            <div className="text-lg font-extrabold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-brand-600 text-white hover:shadow-md'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
