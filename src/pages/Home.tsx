import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Shield, Zap } from 'lucide-react';
import Hero from '../components/features/Hero';
import ListingCard from '../components/features/ListingCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useListingStore } from '../lib/store/listingStore';
import SEO, { getWebsiteSchema } from '@/components/seo/SEO';
import type { Listing } from '@/lib/shared/types';

export default function Home() {
  const [searchParams] = useSearchParams();
  const { listings, isLoading, error, fetchListings } = useListingStore();

  const gameFilter = searchParams.get('game');
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const filters: any = {};
    if (gameFilter) filters.game = gameFilter;
    if (categoryFilter) filters.category = categoryFilter;
    fetchListings(filters);
  }, [fetchListings, gameFilter, categoryFilter]);

  const getFilterTitle = () => {
    if (gameFilter) return `${gameFilter} İlanları`;
    if (categoryFilter) return `${categoryFilter} İlanları`;
    return 'Son Eklenen İlanlar';
  };

  const getDescription = () => {
    if (gameFilter) return `${gameFilter} oyun hesapları ve itemleri güvenli alışveriş ile Item Sepetim'de.`;
    if (categoryFilter) return `${categoryFilter} ilanları - Güvenli oyun hesabı ve item alışverişi.`;
    return 'Türkiye\'nin en güvenilir oyun hesapları ve item pazar yeri.';
  };

  return (
    <>
      <SEO title={gameFilter || categoryFilter ? `${getFilterTitle()} - Item Sepetim` : 'Item Sepetim - Premium Oyun Pazarı'} description={getDescription()} url="/" schema={getWebsiteSchema()} />
      <div>
        <Hero />
        <section className="container-custom px-3 sm:px-4 py-12 sm:py-16 bg-white dark:bg-neutral-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4"><Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" /></div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">%100 Güvenli</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">Tüm işlemler şifrelenmiş ve koruma altında</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl mb-4"><Zap className="w-7 h-7 sm:w-8 sm:h-8 text-accent-600" /></div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Anında Teslimat</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">Satın alma sonrası hızlı ve güvenli teslimat</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-success-100 dark:bg-success-900/30 rounded-2xl mb-4"><TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-success-600" /></div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">En İyi Fiyatlar</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">Piyasanın en uygun ve rekabetçi fiyatları</p>
            </motion.div>
          </div>
        </section>

        <section id="listings" className="container-custom px-3 sm:px-4 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{getFilterTitle()}</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">{gameFilter || categoryFilter ? 'Filtrelenmiş sonuçlar' : 'En yeni ve popüler oyun hesapları ile itemler'}</p>
            </div>
            {listings.length > 0 && !isLoading && <span className="hidden md:block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold">{listings.length} ilan</span>}
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i: number) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && !isLoading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900/50 rounded-2xl p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4"><Package className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" /></div>
              <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-2">Bir Sorun Oluştu</h3>
              <p className="text-red-600 dark:text-red-300 text-sm sm:text-base">{error}</p>
            </motion.div>
          )}

          {!isLoading && !error && listings.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 sm:py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-6"><Package className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-400" /></div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">İlan Bulunamadı</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-lg">{gameFilter || categoryFilter ? 'Bu filtreye uygun ilan bulunmuyor' : 'Yeni ilanlar eklendiğinde burada görünecek'}</p>
            </motion.div>
          )}

          {!isLoading && !error && listings.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {listings.map((listing: Listing, index: number) => (
                <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}