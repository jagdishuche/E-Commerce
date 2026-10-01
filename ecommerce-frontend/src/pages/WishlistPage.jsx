import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';
import RatingStars from '../components/common/RatingStars';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0 && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love so you can easily find them later or purchase whenever you're ready."
          actionText="Discover Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
        <p className="text-sm text-slate-500 mt-1">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const isOutOfStock = item.stock <= 0;

          return (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <Link to={`/products/${item.productId}`} className="block w-full h-full">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                    alt={item.productName}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 shadow-sm transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {item.brand}
                  </div>
                  <Link
                    to={`/products/${item.productId}`}
                    className="text-base font-bold text-slate-900 hover:text-brand-600 truncate block transition-colors mb-2"
                  >
                    {item.productName}
                  </Link>
                  <RatingStars rating={item.rating} size="w-3.5 h-3.5" />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-lg font-black text-slate-900">
                    ${Number(item.price).toFixed(2)}
                  </span>

                  <button
                    onClick={() => {
                      addToCart({
                        id: item.productId,
                        name: item.productName,
                        price: item.price,
                      }, 1);
                    }}
                    disabled={isOutOfStock}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                      isOutOfStock
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-brand-600 text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
