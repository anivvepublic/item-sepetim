import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavoriteStore } from '@/lib/store/favoriteStore';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ListingCard from '@/components/features/ListingCard';

export default function ProfileFavorites() {
  const { favorites, isLoading, fetchFavorites } = useFavoriteStore();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            Favori İlanlarım
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Takip ettiğin {favorites.length} ilan
          </p>
        </div>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
            <div className="relative w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            Henüz Favorin Yok
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mb-8">
            Beğendiğin ilanları favorilere ekleyerek daha sonra kolayca bulabilir ve fiyat değişimlerini takip edebilirsin.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-float-lg transition-all group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            İlanları Keşfet
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {favorites.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}