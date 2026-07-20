import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Share2, MessageSquare,
  Calendar, Eye, Tag, Shield, CheckCircle,
  AlertCircle, ChevronLeft, ChevronRight, X,
  ShoppingCart, CreditCard, Gamepad2, Star, Clock,
  ZoomIn, Package
} from 'lucide-react';
import { useListingStore } from '@/lib/store/listingStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import { usePaymentStore } from '@/lib/store/paymentStore';
import { formatPrice, formatDate } from '@/lib/shared/utils';
import ChatModal from '@/components/features/ChatModal';
import SEO from '@/components/seo/SEO';
import type { Listing } from '@/lib/shared/types';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, isLoading, fetchListings } = useListingStore();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { setPaymentItems } = usePaymentStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (id) fetchListings({ status: 'active' });
  }, [id, fetchListings]);

  useEffect(() => {
    if (listings.length > 0 && id) {
      const found = listings.find((l: Listing) => l.id === id);
      if (found) setListing(found);
    }
  }, [listings, id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing?.title, text: listing?.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setIsChatOpen(true);
  };

  const handleAddToCart = () => {
    if (!listing) return;
    addItem({ id: listing.id, title: listing.title, price: listing.price, image: listing.images?.[0] || '', game: listing.game });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!listing) return;
    setPaymentItems([{ id: listing.id, listingId: listing.id, title: listing.title, price: listing.price, image: listing.images?.[0], game: listing.game, sellerId: listing.seller_id }]);
    navigate('/checkout');
  };

  const nextImage = () => {
    if (listing?.images?.length) setSelectedImage((prev) => (prev + 1) % listing.images.length);
  };
  const prevImage = () => {
    if (listing?.images?.length) setSelectedImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">İlan yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Package className="w-10 h-10 text-neutral-400" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">İlan Bulunamadı</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6 text-sm leading-relaxed">
            Bu ilan artık mevcut değil veya kaldırılmış olabilir.
          </p>
          <button
            onClick={() => navigate('/listings')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
          >
            Tüm İlanlara Git
          </button>
        </div>
      </div>
    );
  }

  const hasImages = listing.images && listing.images.length > 0;

  return (
    <>
      <SEO
        title={`${listing.title} - ${listing.game}`}
        description={listing.description}
        url={`/listings/${listing.id}`}
        image={listing.images?.[0]}
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Top breadcrumb bar */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="container-custom py-3.5 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri Dön
            </button>
            <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[200px] sm:max-w-[350px] lg:max-w-[500px] hidden sm:block">
              {listing.title}
            </h1>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-all ${isFavorite ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
              >
                <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Share2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="container-custom py-6 sm:py-8 px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

            {/* Left: Images + Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">

              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
              >
                {/* Main image */}
                <div
                  className="aspect-video bg-neutral-100 dark:bg-neutral-800 cursor-zoom-in relative group overflow-hidden"
                  onClick={() => hasImages && setIsFullscreen(true)}
                >
                  {hasImages ? (
                    <img
                      src={listing.images[selectedImage]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <Gamepad2 className="w-16 h-16 text-neutral-300 dark:text-neutral-700" />
                      <span className="text-sm text-neutral-400 dark:text-neutral-600">Görsel yok</span>
                    </div>
                  )}

                  {/* Zoom overlay */}
                  {hasImages && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        <ZoomIn className="w-4 h-4" />
                        Büyüt
                      </div>
                    </div>
                  )}

                  {/* Navigation arrows */}
                  {listing.images && listing.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Counter */}
                  {listing.images && listing.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full font-medium">
                      {selectedImage + 1} / {listing.images.length}
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                      listing.status === 'active' ? 'bg-emerald-500/90 text-white' :
                      listing.status === 'sold' ? 'bg-neutral-500/90 text-white' : 'bg-amber-500/90 text-white'
                    }`}>
                      {listing.status === 'active' ? 'Aktif' : listing.status === 'sold' ? 'Satıldı' : 'Beklemede'}
                    </span>
                  </div>
                </div>

                {/* Thumbnails */}
                {listing.images && listing.images.length > 1 && (
                  <div className="p-3 flex gap-2 overflow-x-auto">
                    {listing.images.slice(0, 8).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-primary-500 ring-2 ring-primary-500/20'
                            : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Title, Price, Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800"
              >
                {/* Tags */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="px-3 py-1 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-900/50 text-xs font-bold rounded-full">
                    {listing.game}
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold rounded-full">
                    {listing.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 leading-tight">
                  {listing.title}
                </h2>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(listing.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{listing.views_count || 0} görüntülenme</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/30 dark:to-neutral-800 rounded-xl border border-primary-100 dark:border-primary-900/30">
                  <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                    {formatPrice(listing.price)}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-neutral-500" />
                    Açıklama
                  </h3>
                  {listing.description ? (
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                      {listing.description}
                    </p>
                  ) : (
                    <p className="text-neutral-400 dark:text-neutral-600 italic text-sm">Açıklama eklenmemiş.</p>
                  )}
                </div>

                {/* Features */}
                {listing.features && listing.features.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4">Özellikler</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {listing.features.map((feature: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">{feature.key}</p>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{feature.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {listing.tags && listing.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-full border border-neutral-200 dark:border-neutral-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Actions + Seller */}
            <div className="space-y-4">

              {/* Price + Actions (sticky) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 lg:sticky lg:top-[88px] space-y-3"
              >
                {/* Price */}
                <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Fiyat</p>
                  <div className="text-3xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                    {formatPrice(listing.price)}
                  </div>
                </div>

                {/* Buy now */}
                <button
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 transition-all duration-300"
                >
                  <CreditCard className="w-5 h-5" />
                  Hemen Satın Al
                </button>

                {/* Message seller */}
                <button
                  onClick={handleContactSeller}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  Satıcıya Mesaj At
                </button>

                {/* Secondary actions */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={handleAddToCart}
                    className="flex flex-col items-center gap-1.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 rounded-xl transition-colors border border-neutral-200 dark:border-neutral-700"
                  >
                    <ShoppingCart className="w-4.5 h-4.5" />
                    <span className="text-[10px] font-medium">Sepete</span>
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all border ${
                      isFavorite
                        ? 'bg-red-50 dark:bg-red-950/30 text-red-500 border-red-200 dark:border-red-800'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-750'
                    }`}
                  >
                    <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">Favori</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 rounded-xl transition-colors border border-neutral-200 dark:border-neutral-700"
                  >
                    <Share2 className="w-4.5 h-4.5" />
                    <span className="text-[10px] font-medium">Paylaş</span>
                  </button>
                </div>

                {/* Trust badges */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  {[
                    { icon: Shield, text: '100% Güvenli Ödeme' },
                    { icon: Clock, text: 'Hızlı Teslimat Garantisi' },
                    { icon: Star, text: 'Onaylı Satıcı' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <Icon className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Seller card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800"
              >
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-500" />
                  Satıcı Bilgileri
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {listing.seller?.username?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                      {listing.seller?.username || 'Satıcı'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      Doğrulanmış Satıcı
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm border-t border-neutral-100 dark:border-neutral-800 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs">Üyelik Tarihi</span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-medium text-xs">
                      {listing.seller?.created_at ? formatDate(listing.seller.created_at) : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs">Toplam İlan</span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-medium text-xs">
                      {listing.seller?.listings_count || 0}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/profile/${listing.seller_id}`)}
                  className="w-full mt-4 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-semibold transition-colors border border-neutral-200 dark:border-neutral-700"
                >
                  Satıcı Profilini Gör
                </button>
              </motion.div>

              {/* Safety warning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">Güvenli Alışveriş</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                      Ödeme yapmadan önce satıcıyla iletişime geçin ve ürün detaylarını teyit edin.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && hasImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/97 z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            {listing.images && listing.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
            <img
              src={listing.images[selectedImage]}
              alt={listing.title}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {listing.images && listing.images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full">
                {selectedImage + 1} / {listing.images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/97 dark:bg-neutral-900/97 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 pb-safe">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all"
          >
            <CreditCard className="w-4.5 h-4.5" />
            Satın Al · {formatPrice(listing.price)}
          </button>
          <button
            onClick={handleAddToCart}
            className="w-12 h-12 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl"
            aria-label="Sepete Ekle"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${
              isFavorite
                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-500'
                : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
            aria-label="Favorilere Ekle"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Chat modal */}
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