import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      addToast('Please login to add items to your cart', 'warning');
      return false;
    }
    try {
      const res = await cartApi.addItem(product.id, quantity);
      if (res.success && res.data) {
        setCart(res.data);
        addToast(`Added "${product.name}" to cart!`, 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Could not add product to cart', 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartApi.updateQuantity(itemId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await cartApi.removeItem(itemId);
      if (res.success && res.data) {
        setCart(res.data);
        addToast('Item removed from cart', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  const value = {
    cart,
    items: cart.items || [],
    totalItems: cart.totalItems || 0,
    totalPrice: cart.totalPrice || 0,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
