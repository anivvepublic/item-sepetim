import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, Share2, MessageSquare, 
  Calendar, Eye, Tag, Shield, CheckCircle, 
  AlertCircle, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useListingStore } from '@/lib/store/listingStore';
import { useAuthStore } from '@/lib/store/authStore';
import { formatPrice, formatDate } from '@/lib/shared/utils';
import ChatModal from '@/components/features/ChatModal';
import SEO from '@/components/seo/SEO';
import type { Listing } from '@/lib/shared/types';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, isLoading, fetchListings } = useListingStore();
  const { isAuthenticated } = useAuthStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListings({ status: 'active' });
    }
  }, [id, fetchListings]);

  useEffect(() => {
    if (listings.length > 0 && id) {
      const found = listings.find((l: Listing) => l.id === id);
      if (found) {
        setListing(found);
      }
    }
  }, [listings, id]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsChatOpen(true);
  };

  const nextImage = () => {
    if (listing?.images && listing.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing?.images && listing.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            İlan Bulunamadı
          </h2>
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
        image={listing.images?.[0]}
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
          <div className="container-custom py-3 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Geri Dön</span>
            </button>
            <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[140px] sm:max-w-[300px] lg:max-w-[400px]">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="container-custom py-4 sm:py-6 px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Sol: Görsel Galerisi (2/3) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Ana Görsel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-800"
              >
                <div 
                  className="aspect-video bg-neutral-100 dark:bg-neutral-800 cursor-pointer relative group"
                  onClick={() => setIsFullscreen(true)}
                >
                  {listing.images?.[selectedImage] ? (
                    <img
                      src={listing.images[selectedImage]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="w-16 h-16 text-neutral-300 dark:text-neutral-700" />
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {listing.images && listing.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {listing.images && listing.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-full">
                      {selectedImage + 1} / {listing.images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail'ler */}
                {listing.images && listing.images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {listing.images.slice(0, 6).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-primary-500 ring-2 ring-primary-500/20'
                            : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Başlık ve Fiyat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full">
                    {listing.game}
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-semibold rounded-full">
                    {listing.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(listing.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views_count || 0} görüntülenme</span>
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-6">
                  {formatPrice(listing.price)}
                </div>

                {/* Açıklama */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                    Açıklama
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>

                {/* Özellikler */}
                {listing.features && listing.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                      Özellikler
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {listing.features.map((feature: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
                        >
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            {feature.key}
                          </p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {feature.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Etiketler */}
                {listing.tags && listing.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                      Etiketler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag: string, index: number) => (
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

            {/* Sağ: Satıcı Bilgileri ve İşlemler (1/3) */}
            <div className="space-y-4">
              {/* İşlem Butonları */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-3 lg:sticky lg:top-20"
              >
                <button
                  onClick={handleContactSeller}
                  className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  Satıcıya Mesaj At
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-xl font-medium transition-all ${
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
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
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
                className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-neutral-200 dark:border-neutral-800"
              >
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  Satıcı Bilgileri
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                      {listing.seller?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {listing.seller?.username || 'Satıcı'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <CheckCircle className="w-3 h-3 text-green-500" />
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
                    className="w-full mt-4 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
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
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Güvenli Alışveriş
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                      Ödeme yapmadan önce satıcıyla iletişime geçin ve ürün/hesap detaylarını teyit edin. 
                      Şüpheli durumlarda işlem yapmayın.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && listing.images && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <img
            src={listing.images[selectedImage]}
            alt={listing.title}
            className="max-w-[90%] max-h-[90%] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white text-sm rounded-full">
            {selectedImage + 1} / {listing.images.length}
          </div>
        </motion.div>
      )}

      {/* Mobile Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 pb-safe">
        <div className="flex items-center gap-3">
          <button
            onClick={handleContactSeller}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Satıcıya Mesaj At
          </button>
          <button
            onClick={handleFavorite}
            className={`p-3 rounded-xl border-2 transition-all ${
              isFavorite
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
            aria-label="Favorilere Ekle"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl transition-all"
            aria-label="Paylaş"
          >
            <Share2 className="w-5 h-5" />
          </button>
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