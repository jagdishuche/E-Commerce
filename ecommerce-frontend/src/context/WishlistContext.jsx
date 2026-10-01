import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../api/wishlistApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistApi.getWishlist();
      if (res.success && res.data) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      addToast('Please login to save items to your wishlist', 'warning');
      return false;
    }

    const inList = isInWishlist(product.id);

    try {
      if (inList) {
        await wishlistApi.removeFromWishlist(product.id);
        setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
        addToast(`Removed "${product.name}" from wishlist`, 'info');
      } else {
        const res = await wishlistApi.addToWishlist(product.id);
        if (res.success && res.data) {
          setWishlist((prev) => [...prev, res.data]);
          addToast(`Added "${product.name}" to wishlist!`, 'success');
        }
      }
      return true;
    } catch (err) {
      addToast(err.message || 'Error updating wishlist', 'error');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistApi.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      addToast('Item removed from wishlist', 'info');
    } catch (err) {
      addToast(err.message || 'Error removing item', 'error');
    }
  };

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    loading,
    fetchWishlist,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
