import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, X, Check, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'item-sepetim-cookie-consent';

type ConsentChoice = 'accepted' | 'rejected' | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentChoice>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice;
    if (saved) {
      setConsent(saved);
    } else {
      // 1 saniye gecikme ile göster (kullanıcı siteyi görsün)
      const timer = setTimeout(() => setConsent(null), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setConsent('accepted');
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setConsent('rejected');
  };

  if (consent !== null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]"></div>
          
          <div className="p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="hidden md:flex w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl items-center justify-center flex-shrink-0">
                <Cookie className="w-7 h-7 text-primary-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Cookie className="w-5 h-5 text-primary-600 md:hidden" />
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    Çerez Kullanımı
                  </h3>
                </div>
                
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                  Size daha iyi bir deneyim sunmak için çerezleri kullanıyoruz. 
                  Siteyi kullanarak{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium underline">
                    Gizlilik Politikamızı
                  </Link>
                  {' '}kabul etmiş olursunuz.
                </p>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-success-600" />
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Zorunlu Çerezler</span>
                          </div>
                          <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Aktif
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-accent-600" />
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Analiz Çerezleri</span>
                          </div>
                          <span className="text-xs text-neutral-500">İsteğe bağlı</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleReject}
                className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors flex items-center justify-center gap-1 sm:justify-start"
              >
                <Settings className="w-4 h-4" />
                {showDetails ? 'Detayları Gizle' : 'Detayları Göster'}
              </button>
              
              <div className="flex gap-2 sm:ml-auto">
                <button
                  onClick={handleReject}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm"
                >
                  Reddet
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-float-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                >
                  Kabul Et
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}