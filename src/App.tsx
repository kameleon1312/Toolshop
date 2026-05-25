import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { Navbar }        from '@/components/layout/Navbar';
import { BottomNav }     from '@/components/layout/BottomNav';
import { Footer }        from '@/components/layout/Footer';
import { CartDrawer }    from '@/components/layout/CartDrawer';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { ToastContainer } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ScrollToTop }   from '@/components/ui/ScrollToTop';

import { Home }           from '@/pages/Home';
import { Catalog }        from '@/pages/Catalog';
import { ProductDetails } from '@/pages/ProductDetails';
import { Cart }           from '@/pages/Cart';
import { Wishlist }       from '@/pages/Wishlist';
import { Checkout }       from '@/pages/Checkout';
import { NotFound }       from '@/pages/NotFound';

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />

      <div className="app-shell">
        <Navbar />

        <main className="app-main">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/"                       element={<Home />} />
                <Route path="/catalog"                element={<Catalog />} />
                <Route path="/category/:categoryName" element={<Catalog />} />
                <Route path="/product/:id"            element={<ProductDetails />} />
                <Route path="/cart"                   element={<Cart />} />
                <Route path="/wishlist"               element={<Wishlist />} />
                <Route path="/checkout"               element={<Checkout />} />
                <Route path="*"                       element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </ErrorBoundary>
        </main>

        <Footer />
        <BottomNav />
      </div>

      <CartDrawer />
      <SearchOverlay />
      <ToastContainer />
    </>
  );
}
