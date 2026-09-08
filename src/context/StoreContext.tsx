import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Seller,
  User,
  Order,
  Review,
  Coupon,
  Banner,
  CartItem,
  Address,
  NotificationItem,
  ToastMessage,
  OrderStatus
} from '../types';
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_SELLERS,
  MOCK_BANNERS,
  MOCK_COUPONS,
  MOCK_REVIEWS,
  MOCK_USERS,
  MOCK_ORDERS
} from '../data/mockData';
import { sanitizeImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  editProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  editCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  savedForLater: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleSelectCartItem: (productId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  removeSelectedFromCart: () => void;
  clearCart: () => void;
  saveForLater: (productId: string) => void;
  moveToCartFromSaved: (productId: string) => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;
  cartSelectedCount: number;
  cartTotalCount: number;

  // Wishlist
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  markReviewHelpful: (reviewId: string) => void;
  getProductReviews: (productId: string) => Review[];

  // User & Auth
  currentUser: User | null;
  users: User[];
  login: (emailOrPhone: string, password?: string, role?: 'customer' | 'seller' | 'admin') => boolean;
  register: (data: { name: string; email: string; phone: string; password?: string }) => boolean;
  logout: () => void;
  switchUserRole: (role: 'customer' | 'seller' | 'admin') => void;
  updateUserProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  toggleUserStatus: (userId: string) => void;

  // Recently Viewed
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  trackRecentlyViewed: (product: Product) => void;

  // Sellers
  sellers: Seller[];
  followedSellers: string[];
  toggleFollowSeller: (sellerId: string) => void;
  isSellerFollowed: (sellerId: string) => boolean;
  getSellerById: (sellerId: string) => Seller | undefined;

  // Banners
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, updated: Partial<Banner>) => void;
  deleteBanner: (bannerId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Language & Localization
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  toggleLanguage: () => void;

  // Theme (Dark / Light)
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Comparison
  comparisonProducts: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isComparisonOpen: boolean;
  setIsComparisonOpen: (open: boolean) => void;

  // Lucky Spin Wheel
  isLuckyWheelOpen: boolean;
  setIsLuckyWheelOpen: (open: boolean) => void;

  // 10/10 Trust & Rating Scorecard
  isTrustScorecardOpen: boolean;
  setIsTrustScorecardOpen: (open: boolean) => void;

  // Price Drop Alert Modal
  priceDropModalProduct: Product | null;
  setPriceDropModalProduct: (product: Product | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & Language
  const [language, setLanguageState] = useState<'en' | 'bn'>(() => {
    return (localStorage.getItem('sn_lang') as 'en' | 'bn') || 'en';
  });

  const setLanguage = (lang: 'en' | 'bn') => {
    setLanguageState(lang);
    localStorage.setItem('sn_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sn_dark_mode') === 'true';
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('sn_dark_mode', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // State initialization with localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const raw = loadFromStorage('sn_products', MOCK_PRODUCTS);
    return raw.map((p) => {
      const sanitizedImages = (Array.isArray(p.images) && p.images.length > 0 ? p.images : [FALLBACK_PRODUCT_IMAGE]).map((img) =>
        sanitizeImageUrl(img, p.category)
      );
      return {
        ...p,
        images: sanitizedImages
      };
    });
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const raw = loadFromStorage('sn_categories', MOCK_CATEGORIES);
    // Ensure Sports category has a fresh, valid working Unsplash image
    return raw.map((c) => {
      if (c.slug === 'sports' || c.id === 'cat-10') {
        return {
          ...c,
          image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80'
        };
      }
      return c;
    });
  });
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage('sn_cart', [])
  );
  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() =>
    loadFromStorage('sn_saved_cart', [])
  );
  const [wishlist, setWishlist] = useState<Product[]>(() =>
    loadFromStorage('sn_wishlist', [])
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    loadFromStorage('sn_coupons', MOCK_COUPONS)
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() =>
    loadFromStorage('sn_applied_coupon', null)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage('sn_orders', MOCK_ORDERS)
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    loadFromStorage('sn_reviews', MOCK_REVIEWS)
  );
  const [sellers] = useState<Seller[]>(() =>
    loadFromStorage('sn_sellers', MOCK_SELLERS)
  );
  const [banners, setBanners] = useState<Banner[]>(() =>
    loadFromStorage('sn_banners', MOCK_BANNERS)
  );
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage('sn_users', MOCK_USERS)
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage('sn_current_user', MOCK_USERS[0])
  );
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() =>
    loadFromStorage('sn_recently_viewed', [])
  );
  const [followedSellers, setFollowedSellers] = useState<string[]>(() =>
    loadFromStorage('sn_followed_sellers', ['seller-1', 'seller-3'])
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage('sn_notifications', [
      {
        id: 'notif-1',
        title: 'Flash Sale Live Now!',
        message: 'Massive price drops on smartphones, electronics and fashion. Up to 60% OFF.',
        date: '10m ago',
        read: false,
        type: 'promo',
        link: '/products?filter=flash'
      },
      {
        id: 'notif-2',
        title: 'Order Status Update',
        message: 'Order #SNX-849201 is Out for Delivery with our Dhaka Express rider.',
        date: '1h ago',
        read: false,
        type: 'order',
        link: '/orders/ord-101'
      },
      {
        id: 'notif-3',
        title: 'Special Coupon for You',
        message: 'Use code WELCOME10 at checkout to get an extra 10% instant discount.',
        date: '1 day ago',
        read: true,
        type: 'promo'
      }
    ])
  );

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sn_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sn_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sn_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sn_saved_cart', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    localStorage.setItem('sn_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('sn_applied_coupon', JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('sn_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('sn_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sn_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sn_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('sn_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sn_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sn_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('sn_followed_sellers', JSON.stringify(followedSellers));
  }, [followedSellers]);

  useEffect(() => {
    localStorage.setItem('sn_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helper
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Products CRUD
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now()
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast({
      type: 'success',
      title: 'Product Created',
      message: `${newProduct.title.slice(0, 30)}... added to store catalog.`
    });
    return newProduct;
  };

  const editProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updated } : prod))
    );
    addToast({
      type: 'success',
      title: 'Product Updated',
      message: 'Product information and inventory successfully updated.'
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
    addToast({
      type: 'info',
      title: 'Product Removed',
      message: 'Product has been deleted from catalog.'
    });
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Categories CRUD
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...categoryData,
      id: 'cat-' + Date.now()
    };
    setCategories((prev) => [...prev, newCat]);
    addToast({
      type: 'success',
      title: 'Category Added',
      message: `Category "${newCat.name}" is now live.`
    });
  };

  const editCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast({
      type: 'info',
      title: 'Category Deleted',
      message: 'Category removed successfully.'
    });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selected: true,
            selectedColor: color,
            selectedSize: size
          }
        ];
      }
    });

    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `৳${product.price.toLocaleString()} • ${product.title.slice(0, 32)}...`
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Product removed from your shopping cart.'
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleSelectCartItem = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAll = (selected: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const removeSelectedFromCart = () => {
    setCart((prev) => prev.filter((item) => !item.selected));
    addToast({
      type: 'info',
      title: 'Cart Updated',
      message: 'Selected items have been removed.'
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const saveForLater = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
      setSavedForLater((prev) => [...prev, item]);
      addToast({
        type: 'info',
        title: 'Saved for Later',
        message: 'Item moved to your saved items list.'
      });
    }
  };

  const moveToCartFromSaved = (productId: string) => {
    const item = savedForLater.find((i) => i.product.id === productId);
    if (item) {
      setSavedForLater((prev) => prev.filter((i) => i.product.id !== productId));
      setCart((prev) => [...prev, { ...item, selected: true }]);
      addToast({
        type: 'success',
        title: 'Moved to Cart',
        message: 'Item returned to your shopping cart.'
      });
    }
  };

  // Cart Calculations
  const selectedCartItems = cart.filter((i) => i.selected);
  const cartSubtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    if (cartSubtotal >= appliedCoupon.minOrderAmount) {
      if (appliedCoupon.discountType === 'percentage') {
        const calculated = Math.round((cartSubtotal * appliedCoupon.value) / 100);
        cartDiscount = appliedCoupon.maxDiscount
          ? Math.min(calculated, appliedCoupon.maxDiscount)
          : calculated;
      } else {
        cartDiscount = appliedCoupon.value;
      }
    }
  }

  const hasAllFreeDelivery = selectedCartItems.length > 0 && selectedCartItems.every((i) => i.product.freeDelivery);
  const cartShippingFee = selectedCartItems.length === 0 ? 0 : hasAllFreeDelivery ? 0 : 60;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);
  const cartSelectedCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const addToWishlist = (product: Product) => {
    if (!wishlist.some((item) => item.id === product.id)) {
      setWishlist((prev) => [product, ...prev]);
      addToast({
        type: 'success',
        title: 'Added to Wishlist',
        message: `${product.title.slice(0, 32)}... saved.`
      });
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    addToast({
      type: 'info',
      title: 'Removed from Wishlist',
      message: 'Product removed from your saved wishlist.'
    });
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  // Coupons
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon voucher code.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Coupon requires a minimum order of ৳${found.minOrderAmount.toLocaleString()}.`
      };
    }
    setAppliedCoupon(found);
    addToast({
      type: 'success',
      title: 'Coupon Applied!',
      message: `Coupon "${cleanCode}" applied successfully.`
    });
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast({
      type: 'info',
      title: 'Coupon Removed',
      message: 'Discount coupon has been removed.'
    });
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    addToast({
      type: 'success',
      title: 'Coupon Created',
      message: `New code ${coupon.code} is now valid.`
    });
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    if (appliedCoupon?.code === code) {
      setAppliedCoupon(null);
    }
    addToast({
      type: 'info',
      title: 'Coupon Deleted',
      message: `Code ${code} deleted.`
    });
  };

  // Orders
  const createOrder = (orderData: Partial<Order>): Order => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: `SNX-${randomNum}`,
      userId: currentUser ? currentUser.id : 'guest-user',
      customerName: orderData.customerName || currentUser?.name || 'Customer',
      customerPhone: orderData.customerPhone || currentUser?.phone || '',
      customerEmail: orderData.customerEmail || currentUser?.email || '',
      items: orderData.items || [],
      subtotal: orderData.subtotal || cartSubtotal,
      discount: orderData.discount || cartDiscount,
      shippingFee: orderData.shippingFee ?? cartShippingFee,
      total: orderData.total || cartTotal,
      shippingAddress: orderData.shippingAddress || (currentUser?.addresses[0] as Address),
      shippingMethod: orderData.shippingMethod || 'Standard Delivery',
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid'),
      bkashTrxId: orderData.bkashTrxId || orderData.trxId,
      trxId: orderData.trxId || orderData.bkashTrxId,
      mfsProvider: orderData.mfsProvider,
      mfsSenderNumber: orderData.mfsSenderNumber,
      paymentMode: orderData.paymentMode,
      sellerId: orderData.sellerId || 'seller-1',
      status: 'Confirmed',
      timeline: [
        {
          status: 'Pending',
          timestamp: 'Just now',
          description: 'Order placed by customer',
          completed: true
        },
        {
          status: 'Confirmed',
          timestamp: 'Just now',
          description: 'Order confirmed by ShopNexa logistics',
          completed: true
        },
        {
          status: 'Processing',
          timestamp: 'Upcoming',
          description: 'Seller packing items for dispatch',
          completed: false
        },
        {
          status: 'Shipped',
          timestamp: 'Upcoming',
          description: 'Package in transit to delivery station',
          completed: false
        },
        {
          status: 'Out for Delivery',
          timestamp: 'Upcoming',
          description: 'Delivery courier assigned',
          completed: false
        },
        {
          status: 'Delivered',
          timestamp: 'Upcoming',
          description: 'Package delivered to recipient',
          completed: false
        }
      ],
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id)];
      try {
        localStorage.setItem('sn_orders', JSON.stringify(updated));
        localStorage.setItem('sn_latest_order', JSON.stringify(newOrder));
      } catch {
        // ignore localStorage errors
      }
      return updated;
    });

    // Clear ordered items from cart
    setCart((prev) => prev.filter((item) => !item.selected));
    setAppliedCoupon(null);

    // Notify user
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: 'Order Confirmed!',
        message: `Your order #${newOrder.orderNumber} has been received and confirmed.`,
        date: 'Just now',
        read: false,
        type: 'order',
        link: `/orders/${newOrder.id}`
      },
      ...prev
    ]);

    addToast({
      type: 'success',
      title: 'Order Placed Successfully!',
      message: `Invoice #${newOrder.orderNumber} • ৳${newOrder.total.toLocaleString()}`
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = order.timeline.map((step) => {
          if (step.status === newStatus) {
            return {
              ...step,
              completed: true,
              timestamp: 'Just now',
              description: note || step.description
            };
          }
          return step;
        });

        return {
          ...order,
          status: newStatus,
          paymentStatus: newStatus === 'Delivered' ? 'Paid' : order.paymentStatus,
          timeline: updatedTimeline
        };
      })
    );

    addToast({
      type: 'success',
      title: 'Order Status Updated',
      message: `Order marked as "${newStatus}"`
    });
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'Cancelled',
              timeline: [
                ...ord.timeline,
                {
                  status: 'Cancelled',
                  timestamp: 'Just now',
                  description: 'Order cancelled by user/admin',
                  completed: true
                }
              ]
            }
          : ord
      )
    );
    addToast({
      type: 'warning',
      title: 'Order Cancelled',
      message: 'Order has been cancelled.'
    });
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'Just now',
      helpfulCount: 0
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== reviewData.productId) return p;
        const currentProdReviews = reviews.filter((r) => r.productId === p.id);
        const totalRating = currentProdReviews.reduce((sum, r) => sum + r.rating, 0) + reviewData.rating;
        const newCount = currentProdReviews.length + 1;
        const newAvg = Number((totalRating / newCount).toFixed(1));
        return {
          ...p,
          rating: newAvg,
          reviewCount: newCount
        };
      })
    );

    addToast({
      type: 'success',
      title: 'Review Submitted',
      message: 'Thank you for sharing your feedback with the community!'
    });
  };

  const markReviewHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    addToast({
      type: 'info',
      title: 'Helpful Vote Recorded',
      message: 'Thank you for your feedback.'
    });
  };

  const getProductReviews = (productId: string) => {
    if (!Array.isArray(reviews)) return [];
    return reviews.filter((r) => r && r.productId === productId);
  };

  // Auth
  const login = (emailOrPhone: string, _password?: string, role: 'customer' | 'seller' | 'admin' = 'customer'): boolean => {
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone) &&
        (role ? u.role === role : true)
    );

    if (found) {
      setCurrentUser(found);
      addToast({
        type: 'success',
        title: `Welcome back, ${found.name}!`,
        message: `Signed in successfully as ${found.role}.`
      });
      return true;
    }

    // Auto-create customer if demo login
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: emailOrPhone.split('@')[0] || 'User',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@shopnexa.com`,
      phone: emailOrPhone.includes('@') ? '01700000000' : emailOrPhone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role,
      joinedDate: 'Today',
      addresses: []
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast({
      type: 'success',
      title: `Welcome to ShopNexa!`,
      message: `Signed in as ${newUser.name}.`
    });
    return true;
  };

  const register = (data: { name: string; email: string; phone: string; password?: string }): boolean => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'customer',
      joinedDate: 'Today',
      addresses: []
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast({
      type: 'success',
      title: 'Registration Successful!',
      message: 'Your ShopNexa account is ready to use.'
    });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been securely signed out.'
    });
  };

  const switchUserRole = (role: 'customer' | 'seller' | 'admin') => {
    const matched = users.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      addToast({
        type: 'info',
        title: `Switched to ${role.toUpperCase()}`,
        message: `Now viewing as ${matched.name} (${matched.role})`
      });
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your account details have been saved.'
    });
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      ...addressData,
      id: 'addr-' + Date.now()
    };
    const updatedAddresses = addressData.isDefault
      ? [...currentUser.addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
      : [...currentUser.addresses, newAddr];

    updateUserProfile({ addresses: updatedAddresses });
  };

  const deleteAddress = (addressId: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.filter((a) => a.id !== addressId);
    updateUserProfile({ addresses: updated });
    addToast({
      type: 'info',
      title: 'Address Removed',
      message: 'Address entry deleted.'
    });
  };

  const setDefaultAddress = (addressId: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId
    }));
    updateUserProfile({ addresses: updated });
    addToast({
      type: 'success',
      title: 'Default Address Updated',
      message: 'This address is now selected as default for checkout.'
    });
  };

  const toggleUserStatus = (userId: string) => {
    addToast({
      type: 'info',
      title: 'User Status Toggled',
      message: `User ${userId} permissions updated.`
    });
  };

  // Recently Viewed
  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  // Sellers
  const toggleFollowSeller = (sellerId: string) => {
    setFollowedSellers((prev) => {
      if (prev.includes(sellerId)) {
        addToast({
          type: 'info',
          title: 'Unfollowed Store',
          message: 'You have unfollowed this merchant.'
        });
        return prev.filter((s) => s !== sellerId);
      } else {
        addToast({
          type: 'success',
          title: 'Following Store!',
          message: "You'll receive exclusive flash coupons and new arrival alerts."
        });
        return [...prev, sellerId];
      }
    });
  };

  const isSellerFollowed = (sellerId: string) => {
    return followedSellers.includes(sellerId);
  };

  const getSellerById = (sellerId: string) => {
    return sellers.find((s) => s.id === sellerId || s.slug === sellerId);
  };

  // Banners
  const addBanner = (bannerData: Omit<Banner, 'id'>) => {
    const newBanner: Banner = { ...bannerData, id: 'ban-' + Date.now() };
    setBanners((prev) => [newBanner, ...prev]);
    addToast({
      type: 'success',
      title: 'Banner Added',
      message: 'Promotional banner is now active.'
    });
  };

  const updateBanner = (id: string, updated: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    addToast({
      type: 'success',
      title: 'Banner Updated',
      message: 'Banner settings saved.'
    });
  };

  const deleteBanner = (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    addToast({
      type: 'info',
      title: 'Banner Removed',
      message: 'Banner removed from homepage.'
    });
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications',
      message: 'All notifications marked as read.'
    });
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Comparison
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>(() => {
    return loadFromStorage<Product[]>('sn_comparison', []);
  });
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sn_comparison', JSON.stringify(comparisonProducts));
  }, [comparisonProducts]);

  const addToComparison = (product: Product) => {
    if (comparisonProducts.some((p) => p.id === product.id)) {
      addToast({
        type: 'info',
        title: 'Already in Comparison',
        message: `${product.title.slice(0, 30)}... is already in your comparison list.`
      });
      return;
    }
    if (comparisonProducts.length >= 4) {
      addToast({
        type: 'warning',
        title: 'Comparison Limit Reached',
        message: 'You can compare up to 4 products at the same time.'
      });
      return;
    }
    setComparisonProducts((prev) => [...prev, product]);
    addToast({
      type: 'success',
      title: 'Added to Comparison',
      message: `${product.title.slice(0, 30)}... added to comparison.`
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparisonProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonProducts([]);
  };

  // Lucky Spin Wheel
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);

  // 10/10 Trust & Rating Scorecard
  const [isTrustScorecardOpen, setIsTrustScorecardOpen] = useState(false);

  // Price Drop Alert Modal
  const [priceDropModalProduct, setPriceDropModalProduct] = useState<Product | null>(null);

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        editProduct,
        deleteProduct,
        getProductById,
        categories,
        addCategory,
        editCategory,
        deleteCategory,
        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleSelectCartItem,
        toggleSelectAll,
        removeSelectedFromCart,
        clearCart,
        saveForLater,
        moveToCartFromSaved,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTotal,
        cartSelectedCount,
        cartTotalCount,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        cancelOrder,
        reviews,
        addReview,
        markReviewHelpful,
        getProductReviews,
        currentUser,
        users,
        login,
        register,
        logout,
        switchUserRole,
        updateUserProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        toggleUserStatus,
        recentlyViewed,
        addToRecentlyViewed,
        trackRecentlyViewed: addToRecentlyViewed,
        sellers,
        followedSellers,
        toggleFollowSeller,
        isSellerFollowed,
        getSellerById,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        toasts,
        addToast,
        removeToast,
        quickViewProduct,
        setQuickViewProduct,
        language,
        setLanguage,
        toggleLanguage,
        isDarkMode,
        toggleDarkMode,
        comparisonProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isComparisonOpen,
        setIsComparisonOpen,
        isLuckyWheelOpen,
        setIsLuckyWheelOpen,
        isTrustScorecardOpen,
        setIsTrustScorecardOpen,
        priceDropModalProduct,
        setPriceDropModalProduct
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
