import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthStore } from './lib/store/authStore';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import ToastContainer from './components/ui/Toast';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import CookieBanner from './components/ui/CookieBanner';
import { PageLoader } from './components/ui/Skeleton';

// Features
import FloatingChatButton from './components/features/FloatingChatButton';

const Home = lazy(() => import('./pages/Home'));
const Listings = lazy(() => import('./pages/Listings'));
const Search = lazy(() => import('./pages/Search'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UserAgreement = lazy(() => import('./pages/UserAgreement'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const ProfileLayout = lazy(() => import('./pages/profile/ProfileLayout'));
const ProfileInfo = lazy(() => import('./pages/profile/ProfileInfo'));
const ProfileSettings = lazy(() => import('./pages/profile/ProfileSettings'));
const ProfileFavorites = lazy(() => import('./pages/profile/ProfileFavorites'));
const ProfileTransactions = lazy(() => import('./pages/profile/ProfileTransactions'));
const ProfileMessages = lazy(() => import('./pages/profile/ProfileMessages'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentResult = lazy(() => import('./pages/PaymentResult'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user, isLoading, checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (isLoading) return <PageLoader />;

  if (user?.is_admin) {
    window.location.href = (import.meta as any).env.VITE_ADMIN_URL || 'http://localhost:3201';
    return null;
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <ScrollToTop />
        <ToastContainer />
        <Header />
        <main className="pt-20">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<UserAgreement />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/result" element={<PaymentResult />} />
              <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<ProfileInfo />} />
                <Route path="messages" element={<ProfileMessages />} />
                <Route path="favorites" element={<ProfileFavorites />} />
                <Route path="transactions" element={<ProfileTransactions />} />
                <Route path="settings" element={<ProfileSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ScrollToTopButton />
        <CookieBanner />
        
        {/* Floating Chat Button - Tüm sayfalarda görünür */}
        <FloatingChatButton />
      </div>
    </HelmetProvider>
  );
}

export default App;