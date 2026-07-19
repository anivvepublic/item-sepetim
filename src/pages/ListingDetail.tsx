import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, Share2, MessageSquare, 
  Calendar, Eye, Tag, MapPin, Phone, Mail,
  Shield, CheckCircle, AlertCircle
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
  const { user, isAuthenticated } = useAuthStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
    // Favori ekleme/çıkarma işlemi (ileride favorites tablosu ile)
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

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
        <div className="container-custom">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Geri Dön</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol: Görseller ve Açıklama (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ana Görsel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-800"
              >
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-800">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="w-16 h-16 text-neutral-300 dark:text-neutral-700" />
                    </div>
                  )}
                </div>

                {/* Thumbnail'ler */}
                {listing.images && listing.images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {listing.images.slice(1, 5).map((img, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
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
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full">
                        {listing.game}
                      </span>
                      <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-semibold rounded-full">
                        {listing.category}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
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

                <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-6">
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
                    <div className="grid grid-cols-2 gap-3">
                      {listing.features.map((feature: any, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
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
            <div className="space-y-6">
              {/* İşlem Butonları */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-3"
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
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800"
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
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6"
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