import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, User, Shield, MessageCircle, ShoppingCart, ChevronLeft, ChevronRight, Package, Clock } from 'lucide-react';
import { useListingStore } from '@/lib/store/listingStore';
import { useAuthStore } from '@/lib/store/authStore';
import { SkeletonListingDetail } from '@/components/ui/Skeleton';
import SEO, { getProductSchema } from '@/components/seo/SEO';
import type { Listing } from '@/lib/shared/types';
import { formatPrice, formatDate } from '@/lib/shared/utils';
import ListingCard from '@/components/features/ListingCard';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchListingById, fetchListings, listings } = useListingStore();
  const { isAuthenticated } = useAuthStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);

  useEffect(() => {
    const loadListing = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const data = await fetchListingById(id);
      setListing(data);
      setIsLoading(false);

      if (data) {
        await fetchListings({ game: data.game, status: 'active' });
      }
    };

    loadListing();
  }, [id, fetchListingById, fetchListings]);

  useEffect(() => {
    if (listing) {
      const similar = listings.filter(l => l.id !== listing.id).slice(0, 3);
      setSimilarListings(similar);
    }
  }, [listings, listing]);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    alert('Satın alma işlemi yakında aktif olacak!');
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    alert('Mesajlaşma sistemi yakında aktif olacak!');
  };

  if (isLoading) {
    return (
      <>
        <SEO
          title="İlan Detayı Yükleniyor"
          description="İlan detayları yükleniyor..."
          noindex={true}
        />
        <SkeletonListingDetail />
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <SEO
          title="İlan Bulunamadı - Item Sepetim"
          description="Aradığınız ilan bulunamadı veya kaldırılmış olabilir."
          noindex={true}
        />
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-6">
              <Package className="w-12 h-12 text-neutral-400" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">İlan Bulunamadı</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8">Bu ilan silinmiş veya taşınmış olabilir.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-float-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Ana Sayfaya Dön
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : ['https://via.placeholder.com/800x600?text=No+Image'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <SEO
        title={`${listing.title} - ${formatPrice(listing.price)}`}
        description={listing.description.slice(0, 160)}
        image={listing.images?.[0]}
        url={`/listings/${listing.id}`}
        type="product"
        schema={getProductSchema(listing)}
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
        <div className="container-custom">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Geri Dön
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card overflow-hidden"
              >
                <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={images[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-float hover:bg-white dark:hover:bg-neutral-900 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-float hover:bg-white dark:hover:bg-neutral-900 transition-all"
                      >
                        <ChevronRight className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                      </button>

                      <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex gap-2 overflow-x-auto">
                      {images.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                            currentImageIndex === index
                              ? 'border-primary-600 shadow-float'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}
                        >
                          <img src={image} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6 lg:p-8"
              >
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Açıklama</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6 lg:p-8"
              >
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Detaylar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <Tag className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">Oyun</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">{listing.game}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <Package className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">Kategori</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">{listing.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">Eklenme Tarihi</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">{formatDate(listing.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">Durum</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {listing.status === 'active' ? 'Aktif' : listing.status === 'sold' ? 'Satıldı' : 'Beklemede'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6 lg:p-8 sticky top-24"
              >
                <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 leading-tight">
                  {listing.title}
                </h1>

                <div className="mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Fiyat</div>
                  <div className="text-4xl font-bold text-gradient">
                    {formatPrice(listing.price)}
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">Satıcı</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {listing.seller_id ? 'Kullanıcı' : 'Admin'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePurchase}
                    className="w-full btn-primary flex items-center justify-center gap-2 group"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isAuthenticated ? 'Satın Al' : 'Giriş Yap ve Satın Al'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContactSeller}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {isAuthenticated ? 'Satıcıya Soru Sor' : 'Giriş Yap ve Soru Sor'}
                  </motion.button>
                </div>

                <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-primary-900 dark:text-primary-100 text-sm mb-1">Güvenli Alışveriş</div>
                      <div className="text-xs text-primary-700 dark:text-primary-300">
                        Tüm işlemler şifrelenmiş ve güvende. Paranız koruma altında.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {similarListings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Benzer İlanlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarListings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}