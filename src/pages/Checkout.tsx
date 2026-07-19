import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, ArrowLeft, AlertCircle, Package, Trash2, Loader2 } from 'lucide-react';
import { usePaymentStore } from '@/lib/store/paymentStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/shared/utils';
import SEO from '@/components/seo/SEO';
import { showToast } from '@/components/ui/Toast';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const { items, isLoading, startPayment, removeByListingId } = usePaymentStore();
  const { removeItem } = useCartStore();

  const source = searchParams.get('source');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (items.length === 0 && !isLoading && !isProcessing) {
      // Sepet/odeme bilgisi yoksa uyari goster ama hemen yonlendirme
    }
  }, [items.length, isLoading, isProcessing]);

  const handleRemoveItem = (listingId: string) => {
    removeByListingId(listingId);
    removeItem(listingId);
  };

  const handleStartPayment = async () => {
    if (!agreed) {
      showToast('Devam etmek icin kullanici sozlesmesini kabul edin', 'info');
      return;
    }

    if (items.length === 0) {
      showToast('Odeme yapilacak urun bulunmuyor', 'error');
      return;
    }

    setIsProcessing(true);

    const returnUrl = `${window.location.origin}/payment/result`;
    const callbackUrl = `${window.location.origin}/payment/callback`;

    const result = await startPayment(returnUrl, callbackUrl);

    setIsProcessing(false);

    if (result.success && result.paymentUrl) {
      // Gercek Shopier entegrasyonunda kullanici yonlendirilir.
      // Mock modda basari sayfasina git.
      if (result.paymentUrl.includes('status=mock')) {
        showToast('Shopier entegrasyonu icin API bilgilerini .env dosyasina ekleyin', 'info');
      }
      window.location.href = result.paymentUrl;
    } else {
      showToast(result.error || 'Odeme baslatilamadi', 'error');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const serviceFee = 0; // Ileride komisyon eklenebilir
  const grandTotal = total + serviceFee;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <SEO
        title="Guvenli Odeme - Item Sepetim"
        description="Secili ilanlar icin guvenli odeme adimi. Shopier altyapisi ile kolay ve hizli odeme."
        url="/checkout"
        noindex={true}
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-3 sm:px-4">
        <div className="container-custom max-w-5xl">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Don
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-primary-600" />
              Guvenli Odeme
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Secili urunleri Shopier ile guvenli bir sekilde odemeye hazirlayin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol: Urunler ve Kullanici */}
            <div className="lg:col-span-2 space-y-6">
              {/* Urunler */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-4 sm:p-6"
              >
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-600" />
                  Urunler ({items.length})
                </h2>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                      Odeme yapilacak urun bulunmuyor.
                    </p>
                    <button
                      onClick={() => navigate('/listings')}
                      className="btn-primary"
                    >
                      Ilanlara Goz At
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.listingId}
                        className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800"
                      >
                        <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-xl overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                {item.game || 'Oyun'}
                              </span>
                              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                                {item.title}
                              </h3>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.listingId)}
                              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                              title="Kaldir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xl font-black text-gradient mt-2">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Kullanici Bilgileri */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-4 sm:p-6"
              >
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Alici Bilgileri
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-xs">E-posta</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Kullanici Adi</label>
                    <input
                      type="text"
                      value={user?.username || user?.email?.split('@')[0] || ''}
                      disabled
                      className="input bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">
                  Bilgileriniz profilinizden otomatik alinir. Degistirmek icin hesap ayarlarini kullanin.
                </p>
              </motion.div>

              {/* Uyari */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Odeme sonrasi teslimat icin saticiyla iletisime gecin. Platform, siparis kaydini olusturur
                  ve siparis durumunu "Islemlerim" sayfasindan takip edebilirsiniz.
                </p>
              </motion.div>
            </div>

            {/* Sag: Ozet */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-4 sm:p-6 lg:sticky lg:top-24 space-y-4"
              >
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  Odeme Ozeti
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Ara Toplam</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Hizmet Bedeli</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2 flex items-center justify-between text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    <span>Toplam</span>
                    <span className="text-gradient">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                    <a href="/terms" target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                      Kullanici Sozlesmesi
                    </a>
                    'ni okudum ve kabul ediyorum.
                  </label>
                </div>

                <button
                  onClick={handleStartPayment}
                  disabled={isLoading || isProcessing || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-float-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Yonlendiriliyor...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {source === 'cart' ? 'Sepeti Ode' : 'Simdi Satinal'}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Shopier ile guvenli odeme
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
