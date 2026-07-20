import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Shield, Zap, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import Hero from '../components/features/Hero';
import ListingCard from '../components/features/ListingCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useListingStore } from '../lib/store/listingStore';
import SEO, { getWebsiteSchema } from '@/components/seo/SEO';
import type { Listing } from '@/lib/shared/types';

const FEATURES = [
  {
    icon: Shield,
    title: '%100 Güvenli',
    description: 'Tüm işlemler şifrelenmiş ve koruma altında',
    color: 'from-primary-500/10 to-primary-600/5',
    iconColor: 'text-primary-500',
    borderColor: 'border-primary-100 dark:border-primary-900/40',
  },
  {
    icon: Zap,
    title: 'Anında Teslimat',
    description: 'Satın alma sonrası hızlı ve güvenli teslimat',
    color: 'from-amber-500/10 to-amber-600/5',
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-100 dark:border-amber-900/40',
  },
  {
    icon: TrendingUp,
    title: 'En İyi Fiyatlar',
    description: 'Piyasanın en uygun ve rekabetçi fiyatları',
    color: 'from-emerald-500/10 to-emerald-600/5',
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-100 dark:border-emerald-900/40',
  },
];

export default function Home() {
  const [searchParams] = useSearchParams();
  const { listings, isLoading, error, fetchListings } = useListingStore();

  const gameFilter = searchParams.get('game');
  const categoryFilter = searchParams.get('category');
  const isFiltered = !!(gameFilter || categoryFilter);

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

  return (
    <>
      <SEO
        title={isFiltered ? `${getFilterTitle()} - Item Sepetim` : 'Item Sepetim - Premium Oyun Pazarı'}
        description={
          gameFilter
            ? `${gameFilter} oyun hesapları ve itemleri güvenli alışveriş ile Item Sepetim'de.`
            : 'Türkiye\'nin en güvenilir oyun hesapları ve item pazar yeri.'
        }
        url="/"
        schema={getWebsiteSchema()}
      />

      <div>
        {/* Hero - only show on unfiltered home */}
        {!isFiltered && <Hero />}

        {/* Features Section */}
        {!isFiltered && (
          <section className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
            <div className="container-custom py-14 sm:py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {FEATURES.map(({ icon: Icon, title, description, color, iconColor, borderColor }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br ${color} border ${borderColor}`}
                  >
                    <div className={`w-11 h-11 rounded-xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">{title}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Listings Section */}
        <section id="listings" className="container-custom px-3 sm:px-4 py-12 sm:py-16">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                  {isFiltered ? 'Filtrelenmiş Sonuçlar' : 'Keşfet'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {getFilterTitle()}
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                {isFiltered ? 'Arama kriterlerinize uyan ilanlar' : 'En yeni ve popüler oyun hesapları ile itemler'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {listings.length > 0 && !isLoading && (
                <span className="hidden sm:flex px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold">
                  {listings.length} ilan
                </span>
              )}
              <Link
                to="/listings"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
              >
                Tümünü Gör
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 text-center"
            >
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">Bir Sorun Oluştu</h3>
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Empty */}
          {!isLoading && !error && listings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Package className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">İlan Bulunamadı</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                {isFiltered ? 'Bu filtreye uygun ilan bulunmuyor' : 'Yeni ilanlar eklendiğinde burada görünecek'}
              </p>
            </motion.div>
          )}

          {/* Grid */}
          {!isLoading && !error && listings.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {listings.map((listing: Listing, index: number) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="h-full"
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Load more button */}
          {!isLoading && !error && listings.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/listings"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-primary-950/40 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold rounded-xl transition-all duration-300 text-sm border border-neutral-200 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800"
              >
                Tüm İlanları Gör
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}