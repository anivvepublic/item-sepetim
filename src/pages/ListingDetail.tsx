import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, Share2, MessageSquare, 
  Calendar, Eye, Tag,
  Shield, CheckCircle, AlertCircle,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useListingStore } from '@/lib/store/listingStore';
import { useAuthStore } from '@/lib/store/authStore';
import { formatPrice, formatDate } from '@/lib/shared/utils';
import ChatModal from '@/components/features/ChatModal';
import SEO from '@/components/seo/SEO';
import type { Listing } from '@/lib/shared/types';

// Listing type'ında henüz tanımlı olmayan ama API'den gelebilecek opsiyonel alanlar
interface ExtendedListing extends Listing {
  views_count?: number;
  features?: { key: string; value: string }[];
  tags?: string[];
  seller?: {
    username?: string;
    created_at?: string;
    listings_count?: number;
  };
}

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, isLoading, fetchListings } = useListingStore();
  const { isAuthenticated } = useAuthStore();
  const [listing, setListing] = useState<ExtendedListing | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // ── Galeri state ────────────────────────────────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (id) fetchListings({ status: 'active' });
  }, [id, fetchListings]);

  useEffect(() => {
    if (listings.length > 0 && id) {
      const found = listings.find((l: Listing) => l.id === id);
      if (found) {
        setListing(found as ExtendedListing);
        setActiveIndex(0); // reset galeri yeni ilan yüklenince
      }
    }
  }, [listings, id]);

  // Klavye navigasyonu (lightbox açıkken)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen || !listing?.images) return;
    if (e.key === 'ArrowRight') setActiveIndex(i => (i + 1) % listing.images!.length);
    if (e.key === 'ArrowLeft')  setActiveIndex(i => (i - 1 + listing.images!.length) % listing.images!.length);
    if (e.key === 'Escape') setLightboxOpen(false);
  }, [lightboxOpen, listing]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const images = listing?.images ?? [];
  const hasMultiple = images.length > 1;

  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex(i => (i - 1 + images.length) % images.length);
  };
  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex(i => (i + 1) % images.length);
  };

  const handleFavorite = () => setIsFavorite(f => !f);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing?.title, text: listing?.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setIsChatOpen(true);
  };

  // ── Loading / Not found ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">İlan Bulunamadı</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Bu ilan artık mevcut değil veya kaldırılmış olabilir.
          </p>
          <button
            onClick={() => navigate('/listings')}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            Tüm İlanlara Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${listing.title} - ${listing.game}`}
        description={listing.description}
        url={`/listings/${listing.id}`}
        image={images[0]}
      />

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Kapat */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Sayaç */}
            {hasMultiple && (
              <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
                {activeIndex + 1} / {images.length}
              </span>
            )}

            {/* Sol ok */}
            {hasMultiple && (
              <button
                onClick={goPrev}
                className="absolute left-3 sm:left-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Önceki"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Ana görsel */}
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              src={images[activeIndex]}
              alt={listing.title}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl select-none"
              onClick={e => e.stopPropagation()}
              draggable={false}
            />

            {/* Sağ ok */}
            {hasMultiple && (
              <button
                onClick={goNext}
                className="absolute right-3 sm:right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Sonraki"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}

            {/* Thumbnail strip */}
            {hasMultiple && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-2 max-w-[90vw] overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setActiveIndex(i); }}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeIndex
                        ? 'border-primary-500 opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sayfa ────────────────────────────────────────────────────────────── */}
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-6 sm:py-8">
        <div className="container-custom px-4 sm:px-6">

          {/* Geri butonu */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Geri Dön</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ── Sol: Görseller + Açıklama ──────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Galeri kartı */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-800"
              >
                {/* Ana görsel — tıklanabilir, oklarla geçiş */}
                <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 group">
                  {images.length > 0 ? (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activeIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          src={images[activeIndex]}
                          alt={listing.title}
                          className="w-full h-full object-cover cursor-zoom-in"
                          onClick={() => setLightboxOpen(true)}
                          draggable={false}
                        />
                      </AnimatePresence>

                      {/* Sayaç */}
                      {hasMultiple && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
                          {activeIndex + 1} / {images.length}
                        </span>
                      )}

                      {/* Sol ok */}
                      {hasMultiple && (
                        <button
                          onClick={goPrev}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                          aria-label="Önceki fotoğraf"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      )}

                      {/* Sağ ok */}
                      {hasMultiple && (
                        <button
                          onClick={goNext}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                          aria-label="Sonraki fotoğraf"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="w-16 h-16 text-neutral-300 dark:text-neutral-700" />
                    </div>
                  )}
                </div>

                {/* Thumbnail şeridi — tıklanınca aktif foto değişir */}
                {hasMultiple && (
                  <div className="p-3 flex gap-2 overflow-x-auto scrollbar-hide">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          i === activeIndex
                            ? 'border-primary-500 ring-1 ring-primary-400'
                            : 'border-transparent opacity-60 hover:opacity-90'
                        }`}
                        aria-label={`Fotoğraf ${i + 1}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Başlık, fiyat, açıklama */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full">
                        {listing.game}
                      </span>
                      <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-semibold rounded-full">
                        {listing.category}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 break-words">
                      {listing.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(listing.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{listing.views_count || 0} görüntülenme</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-6">
                  {formatPrice(listing.price)}
                </div>

                {/* Açıklama */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Açıklama</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>

                {/* Özellikler */}
                {listing.features && listing.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Özellikler</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {listing.features.map((feature, index) => (
                        <div key={index} className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{feature.key}</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{feature.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Etiketler */}
                {listing.tags && listing.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* ── Sağ: Satıcı + Aksiyonlar ───────────────────────────────────── */}
            {/* Mobilde bu blok içeriğin üstüne sticky bar olarak gelir */}
            <div className="space-y-5">

              {/* Mobil sticky fiyat + mesaj butonu */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-3 shadow-lg">
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Fiyat</p>
                  <p className="text-lg font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                    {formatPrice(listing.price)}
                  </p>
                </div>
                <button
                  onClick={handleContactSeller}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Mesaj At
                </button>
                <button
                  onClick={handleFavorite}
                  className={`p-2.5 rounded-xl border-2 transition-all ${
                    isFavorite
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400'
                  }`}
                  aria-label="Favorilere ekle"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Desktop aksiyonlar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-3"
              >
                <button
                  onClick={handleContactSeller}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  Satıcıya Mesaj At
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      isFavorite
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-2 border-red-200 dark:border-red-800'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    <span className="text-sm">Favori</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Paylaş</span>
                  </button>
                </div>
              </motion.div>

              {/* Satıcı Bilgileri */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-neutral-200 dark:border-neutral-800"
              >
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  Satıcı Bilgileri
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {listing.seller?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {listing.seller?.username || 'Satıcı'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span>Doğrulanmış Satıcı</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">Üyelik Tarihi</span>
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {listing.seller?.created_at ? formatDate(listing.seller.created_at) : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">Toplam İlan</span>
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {listing.seller?.listings_count || 0}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/profile/${listing.seller_id}`)}
                    className="w-full mt-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                  >
                    Satıcı Profilini Gör
                  </button>
                </div>
              </motion.div>

              {/* Güvenlik Uyarısı */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">Güvenli Alışveriş</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                      Ödeme yapmadan önce satıcıyla iletişime geçin ve ürün/hesap detaylarını teyit edin.
                      Şüpheli durumlarda işlem yapmayın.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Mobilde sayfa alt sticky bar için boşluk bırak */}
              <div className="lg:hidden h-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {listing && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          listingId={listing.id}
          sellerId={listing.seller_id}
          listingTitle={listing.title}
        />
      )}
    </>
  );
}