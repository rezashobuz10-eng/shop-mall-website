import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';

// Layout Components
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { MobileMenu } from './components/layout/MobileMenu';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { PromotionalPopup } from './components/common/PromotionalPopup';
import { LiveSupportWidget } from './components/common/LiveSupportWidget';
import { LuckySpinWheelModal } from './components/common/LuckySpinWheelModal';
import { ProductComparisonModal } from './components/common/ProductComparisonModal';
import { TrustScorecardModal } from './components/common/TrustScorecardModal';
import { PriceDropAlertModal } from './components/common/PriceDropAlertModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { OrdersPage } from './pages/OrdersPage';
import { SellerStorePage } from './pages/SellerStorePage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPage } from './pages/AuthPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { MallPage } from './pages/MallPage';
import { FlashSalePage } from './pages/FlashSalePage';
import { HelpCenterPage } from './pages/HelpCenterPage';

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white pb-16 md:pb-0">
      <ScrollToTop />
      {/* Notification Toasts */}
      <ToastContainer />

      {/* Quick View Modal */}
      <QuickViewModal />

      {/* Professional Welcome & First Order Discount Popup */}
      <PromotionalPopup />

      {/* Lucky Spin Wheel Modal */}
      <LuckySpinWheelModal />

      {/* Product Comparison Dock & Modal */}
      <ProductComparisonModal />

      {/* 10/10 Buyer Protection & Trust Scorecard Modal */}
      <TrustScorecardModal />

      {/* Price Drop Alert Modal */}
      <PriceDropAlertModal />

      {/* Top Bars */}
      <AnnouncementBar />
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <Navbar />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:slug" element={<ProductsPage />} />
          <Route path="/search" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Order Thank You, success & Tracking routes */}
          <Route path="/thank-you/:id" element={<ThankYouPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/order-success/:id" element={<ThankYouPage />} />
          <Route path="/order-success" element={<ThankYouPage />} />
          <Route path="/order/:id" element={<ThankYouPage />} />
          <Route path="/order" element={<OrdersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrdersPage />} />
          <Route path="/track-order" element={<OrdersPage />} />
          <Route path="/track-order/:id" element={<OrdersPage />} />
          <Route path="/track/:id" element={<OrdersPage />} />
          <Route path="/seller/:id" element={<SellerStorePage />} />
          <Route path="/store/:id" element={<SellerStorePage />} />
          <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/mall" element={<MallPage />} />
          <Route path="/flash-sale" element={<FlashSalePage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating 24/7 Live Support & AI Shopping Assistant */}
      <LiveSupportWidget />

      {/* Sticky Bottom Nav for Mobile Devices */}
      <MobileBottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <AppContent />
      </Router>
    </StoreProvider>
  );
};

export default App;
