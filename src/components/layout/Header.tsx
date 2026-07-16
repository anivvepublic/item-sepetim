import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown, Bell, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { useThemeStore, applyTheme } from '@/lib/store/themeStore';
import { GAME_CATEGORIES } from '@shared/constants';
import Avatar from '@/components/ui/Avatar';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[HEADER DEBUG] user:', user, 'isAuthenticated:', isAuthenticated);
  }, [user, isAuthenticated]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const displayName = user?.username || (user?.email ? user.email.split('@')[0] : 'Kullanıcı');

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-float-lg border-b border-neutral-200/50 dark:border-neutral-800'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-float"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Item Sepetim
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 -mt-1">Premium Oyun Pazarı</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/listings"
              className="relative text-neutral-700 dark:text-neutral-300 hover:text-primary-600 font-medium transition-colors group"
            >
              Tüm İlanlar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </Link>
            
            <div className="relative group">
              <button className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 font-medium transition-colors">
                Oyunlar
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-float-lg border border-neutral-200 dark:border-neutral-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2">
                  {GAME_CATEGORIES.slice(0, 6).map((game) => (
                    <button
                      key={game}
                      onClick={() => {
                        navigate(`/?game=${encodeURIComponent(game)}`);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-800 hover:text-primary-600 rounded-lg transition-colors"
                    >
                      {game}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/listings?category=Hesap')}
              className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 font-medium transition-colors"
            >
              Hesaplar
            </button>

            <button
              onClick={() => navigate('/listings?category=Item')}
              className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 font-medium transition-colors"
            >
              Itemler
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              title={theme === 'dark' ? 'Açık Mod' : 'Karanlık Mod'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotifMenuOpen(!isNotifMenuOpen);
                      setIsUserMenuOpen(false);
                    }}
                    className="relative p-2.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-xl shadow-float-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                          <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Bildirimler</span>
                          {unreadCount > 0 && (
                            <button 
                              onClick={() => useNotificationStore.getState().markAllAsRead()}
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Tümünü Okundu İşaretle
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-neutral-500 dark:text-neutral-400 text-sm">
                              Yeni bildirim yok
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <button
                                key={notif.id}
                                onClick={() => {
                                  markAsRead(notif.id);
                                  if (notif.link) navigate(notif.link);
                                  setIsNotifMenuOpen(false);
                                }}
                                className={`w-full text-left p-3 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${
                                  !notif.is_read ? 'bg-primary-50/50 dark:bg-primary-900/20' : ''
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                                    !notif.is_read ? 'bg-primary-600' : 'bg-transparent'
                                  }`}></div>
                                  <div>
                                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{notif.title}</p>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{notif.message}</p>
                                  </div>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      setIsNotifMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <Avatar user={user} size="sm" />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                      {displayName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-float-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50"
                      >
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
                        >
                          Profilim
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Çıkış Yap
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:shadow-float-lg transition-all text-sm"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <div className="container-custom py-6 space-y-4">
              <Link
                to="/listings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-neutral-700 dark:text-neutral-300 hover:text-primary-600 font-medium transition-colors"
              >
                Tüm İlanlar
              </Link>

              <button
                onClick={() => {
                  navigate('/listings?category=Hesap');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-neutral-700 dark:text-neutral-300 hover:text-primary-600 font-medium transition-colors"
              >
                Hesaplar
              </button>

              <button
                onClick={() => {
                  navigate('/listings?category=Item');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-neutral-700 dark:text-neutral-300 hover:text-primary-600 font-medium transition-colors"
              >
                Itemler
              </button>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                {/* Mobile Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{theme === 'dark' ? 'Açık Mod' : 'Karanlık Mod'}</span>
                </button>

                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                    >
                      <Avatar user={user} size="sm" />
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                        {displayName}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-6 py-3 text-primary-600 border-2 border-primary-200 dark:border-primary-800 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:shadow-float-lg transition-all"
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}