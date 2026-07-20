import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Heart, Gamepad2 } from 'lucide-react';
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

  const statusConfig = {
    active: { label: 'Aktif', className: 'bg-emerald-500/90 text-white' },
    sold: { label: 'Satıldı', className: 'bg-neutral-500/90 text-white' },
    pending: { label: 'Beklemede', className: 'bg-amber-500/90 text-white' },
  };
  const status = statusConfig[listing.status as keyof typeof statusConfig] || statusConfig.active;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, layout: { duration: 0.3 } }}
      className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-neutral-900/10 dark:hover:shadow-black/30 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <Link to={`/listings/${listing.id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-neutral-800 dark:to-neutral-850 overflow-hidden flex-shrink-0">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gamepad2 className="w-14 h-14 text-neutral-300 dark:text-neutral-700" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* View details overlay */}
          <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="flex items-center gap-1.5 text-white text-xs font-semibold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/25 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-3.5 h-3.5" /> Detayları Gör
            </span>
          </div>

          {/* Status badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-md shadow-sm ${status.className}`}>
              {status.label}
            </span>
          </div>

          {/* Favorite button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleFavoriteClick}
            className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
              isFav
                ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/40'
                : 'bg-black/30 border-white/20 text-white hover:bg-white hover:text-red-500 hover:border-transparent'
            }`}
            aria-label="Favorilere Ekle"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-white' : ''}`} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 min-w-0">
          {/* Tags */}
          <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
            <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-900/50 rounded-md text-[10px] sm:text-xs font-semibold truncate max-w-[100px]">
              {listing.game}
            </span>
            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded-md text-[10px] sm:text-xs font-medium truncate max-w-[90px]">
              {listing.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
            {listing.title}
          </h3>

          {/* Description */}
          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
            {listing.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
            <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 text-[10px] sm:text-xs min-w-0">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="truncate">{formatDate(listing.created_at)}</span>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <span className="text-base sm:text-xl font-black bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                {formatPrice(listing.price)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
