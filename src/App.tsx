import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthStore } from './lib/store/authStore';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import ToastContainer from './components/ui/Toast';
import { PageLoader } from './components/ui/Skeleton';

const Home = lazy(() => import('./pages/Home'));
const Listings = lazy(() => import('./pages/Listings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UserAgreement = lazy(() => import('./pages/UserAgreement'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const ProfileLayout = lazy(() => import('./pages/profile/ProfileLayout'));
const ProfileInfo = lazy(() => import('./pages/profile/ProfileInfo'));
const ProfileSettings = lazy(() => import('./pages/profile/ProfileSettings'));
const ProfileFavorites = lazy(() => import('./pages/profile/ProfileFavorites'));
const ProfileTransactions = lazy(() => import('./pages/profile/ProfileTransactions'));
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<UserAgreement />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<ProfileInfo />} />
                <Route path="favorites" element={<ProfileFavorites />} />
                <Route path="transactions" element={<ProfileTransactions />} />
                <Route path="settings" element={<ProfileSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
export default App;