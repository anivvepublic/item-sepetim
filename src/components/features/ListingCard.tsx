import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Tag, Eye, Heart } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useFavoriteStore } from '@/lib/store/favoriteStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/shared/utils';
import type { Listing } from '@/lib/shared/types';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const isFav = isFavorite(listing.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Favorilere eklemek için lütfen giriş yapın', 'info');
      return;
    }
    await toggleFavorite(listing);
  };

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.9 }} 
      whileHover={{ y: -8 }} 
      transition={{ duration: 0.3, layout: { duration: 0.4 } }} 
      className="card overflow-hidden group cursor-pointer relative min-w-0"
    >
      <Link to={`/listings/${listing.id}`} className="block h-full flex flex-col">
        <div className="relative h-40 sm:h-48 md:h-52 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden flex-shrink-0">
          {listing.images && listing.images.length > 0 ? (
            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Tag className="w-12 h-12 sm:w-16 sm:h-16 text-primary-400/50" /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 sm:pb-6">
            <div className="flex items-center gap-2 text-white font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white/20 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/30 text-xs sm:text-sm">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" /><span>Detayları Gör</span>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.8 }} onClick={handleFavoriteClick} className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${isFav ? 'bg-red-500/90 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-black/30 border-white/20 text-white hover:bg-white hover:text-red-500'}`} aria-label="Favorilere Ekle">
            <motion.div animate={isFav ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'fill-white' : ''}`} />
            </motion.div>
          </motion.button>
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg backdrop-blur-md ${listing.status === 'active' ? 'bg-success-500/90 text-white' : listing.status === 'sold' ? 'bg-neutral-500/90 text-white' : 'bg-accent-500/90 text-white'}`}>
              {listing.status === 'active' ? 'Aktif' : listing.status === 'sold' ? 'Satıldı' : 'Beklemede'}
            </span>
          </div>
        </div>
        
        <div className="p-3 sm:p-5 flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg text-[10px] sm:text-xs font-bold truncate max-w-[120px]">{listing.game}</span>
            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-[10px] sm:text-xs font-bold truncate max-w-[120px]">{listing.category}</span>
          </div>
          <h3 className="text-sm sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
            {listing.title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed flex-1">
            {listing.description}
          </p>
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
            <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-500 text-[10px] sm:text-xs min-w-0">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{formatDate(listing.created_at)}</span>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-gradient block leading-none">
                {formatPrice(listing.price)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
