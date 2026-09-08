export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number; // in BDT (৳)
  originalPrice: number;
  discount: number; // percentage
  rating: number; // 0 - 5
  reviewCount: number;
  soldCount: number;
  stock: number;
  images: string[];
  sellerId: string;
  sellerName: string;
  tags: string[];
  isFlashSale?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isMall?: boolean;
  freeDelivery?: boolean;
  specifications?: Record<string, string>;
  specs?: Record<string, string>;
  colors?: string[];
  sizes?: string[];
  warranty?: string;
  deliveryDays?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  productCount: number;
  featured?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  rating: number;
  reviewCount: number;
  followers: number;
  joinedDate: string;
  verified: boolean;
  location: string;
  responseRate: string;
  shipOnTime: string;
  about: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'customer' | 'seller' | 'admin';
  sellerId?: string;
  addresses: Address[];
  joinedDate: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  fullAddress: string;
  postalCode: string;
  isDefault: boolean;
  label: 'Home' | 'Office';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId?: string;
  title?: string;
  image?: string;
  price: number;
  quantity: number;
  sellerName?: string;
  product?: Product;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  shippingAddress: Address | {
    id?: string;
    fullName?: string;
    phone?: string;
    division?: string;
    district?: string;
    city?: string;
    area?: string;
    address?: string;
    fullAddress?: string;
    postalCode?: string;
    isDefault?: boolean;
    label?: 'Home' | 'Office';
  };
  shippingMethod?: 'Standard Delivery' | 'Express Delivery' | string;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'unpaid' | 'paid' | string;
  bkashTrxId?: string;
  trxId?: string;
  mfsProvider?: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod' | string;
  mfsSenderNumber?: string;
  paymentMode?: 'manual_trxid' | 'online_gateway' | 'cod';
  sellerId?: string;
  status: OrderStatus | string;
  timeline?: {
    status: OrderStatus | string;
    timestamp: string;
    description: string;
    completed: boolean;
  }[];
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g., 10% or 200 BDT
  minOrderAmount: number;
  maxDiscount?: number;
  description: string;
  expiresAt: string;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  discount?: string;
  image: string;
  buttonText: string;
  link: string;
  bgGradient: string;
  status: 'active' | 'inactive';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
  link?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
