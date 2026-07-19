import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Tag, Eye, Heart, Gamepad2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useFavoriteStore } from '@/lib/store/favoriteStore';
import { showToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/shared/utils';
import type { Listing } from '@/lib/shared/types';

interface ListingCardProps {
  listing: Listing;
}

// Kalp partikül bileşeni
interface ParticleProps {
  angle: number;
  distance: number;
  delay: number;
  size: number;
}

function HeartParticle({ angle, distance, delay, size }: ParticleProps) {
  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians) * distance;
  const y = Math.sin(radians) * distance;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
      animate={{ 
        opacity: 0, 
        scale: [0, 1.2, 0.8], 
        x: x, 
        y: y,
        rotate: angle > 180 ? -45 : 45
      }}
      transition={{ duration: 0.8, delay: delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute top-1/2 left-1/2 pointer-events-none"
    >
      <Heart className="text-red-500 fill-red-500" style={{ width: size, height: size }} />
    </motion.div>
  );
}

// Oyun bazlı renk haritası
const GAME_COLORS: Record<string, string> = {
  'Valorant': 'from-red-500 to-orange-500',
  'Mobile Legends': 'from-blue-500 to-purple-500',
  'PUBG Mobile': 'from-yellow-500 to-red-500',
  'Wild Rift': 'from-green-500 to-blue-500',
  'League of Legends': 'from-blue-600 to-indigo-600',
  'CS2': 'from-orange-500 to-yellow-500',
  'Fortnite': 'from-purple-500 to-pink-500',
  'Roblox': 'from-red-600 to-red-400',
  'Minecraft': 'from-green-600 to-emerald-500',
  'GTA V': 'from-green-500 to-teal-500',
};

export default function ListingCard({ listing }: ListingCardProps) {
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const [showBurst, setShowBurst] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isFav = isFavorite(listing.id);

  useEffect(() => {
    if (showBurst) {
      const timer = setTimeout(() => setShowBurst(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showBurst]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isAuthenticated) {
      showToast('Favorilere eklemek için lütfen giriş yapın', 'info');
      return;
    }

    if (!isFav) {
      setBurstKey(prev => prev + 1);
      setShowBurst(true);
    }

    await toggleFavorite(listing);
  };

  const particles = Array.from({ length: 10 }, (_, i) => ({
    angle: (360 / 10) * i + (Math.random() * 20 - 10),
    distance: 40 + Math.random() * 20,
    delay: Math.random() * 0.1,
    size: 8 + Math.random() * 6,
  }));

  const gameColor = GAME_COLORS[listing.game] || 'from-primary-500 to-accent-500';
  const isNew = (Date.now() - new Date(listing.created_at).getTime()) < 24 * 60 * 60 * 1000;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.9 }} 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, layout: { duration: 0.4 } }}
      className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-neutral-950/50 dark:hover:shadow-neutral-950/80 transition-all duration-300 border border-neutral-100 dark:border-neutral-800 min-w-0"
    >
      <Link to={`/listings/${listing.id}`} className="block h-full flex flex-col">
        {/* GÖRSEL ALANI */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden flex-shrink-0">
          {/* Görsel */}
          {listing.images && listing.images.length > 0 ? (
            <>
              <motion.img 
                src={listing.images[0]} 
                alt={listing.title} 
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                onLoad={() => setImageLoaded(true)}
                style={{ opacity: imageLoaded ? 1 : 0 }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-300 dark:text-neutral-700" />
            </div>
          )}

          {/* ÜST BADGE'LER */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            {/* Yeni Rozeti */}
            {isNew && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm"
              >
                <Sparkles className="w-3 h-3" />
                Yeni
              </motion.span>
            )}
            {/* Durum Rozeti */}
            <span className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm ${
              listing.status === 'active' 
                ? 'bg-success-500/90 text-white' 
                : listing.status === 'sold' 
                ? 'bg-neutral-500/90 text-white' 
                : 'bg-accent-500/90 text-white'
            }`}>
              {listing.status === 'active' ? 'Aktif' : listing.status === 'sold' ? 'Satıldı' : 'Beklemede'}
            </span>
          </div>

          {/* KALP BUTONU */}
          <motion.button 
            whileTap={{ scale: 0.85 }}
            onClick={handleFavoriteClick} 
            className={`absolute top-3 right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
              isFav 
                ? 'bg-red-500/95 border-red-400 text-white shadow-lg shadow-red-500/50' 
                : 'bg-white/90 dark:bg-neutral-900/90 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-red-500 hover:border-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/50'
            }`}
            aria-label="Favorilere Ekle"
          >
            <motion.div 
              animate={isFav ? { 
                scale: [1, 1.3, 1],
                rotate: [0, -10, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'fill-white' : ''}`} />
            </motion.div>

            <AnimatePresence>
              {showBurst && (
                <motion.div key={burstKey} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {particles.map((particle, index) => (
                    <HeartParticle key={index} {...particle} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* ALT BADGE'LER (Görselin üzerinde) */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-full shadow-lg">
              <Eye className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Detayları Gör</span>
            </div>
          </div>
        </div>

        {/* İÇERİK ALANI */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 min-w-0">
          {/* Oyun ve Kategori Etiketleri */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${gameColor} text-white rounded-lg text-[10px] sm:text-xs font-bold shadow-sm`}>
              <Gamepad2 className="w-3 h-3" />
              {listing.game}
            </span>
            <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-[10px] sm:text-xs font-medium">
              {listing.category}
            </span>
          </div>

          {/* Başlık */}
          <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
            {listing.title}
          </h3>

          {/* Açıklama */}
          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
            {listing.description}
          </p>

          {/* Alt Bilgi: Tarih ve Fiyat */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
            <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500 text-[10px] sm:text-xs min-w-0">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="truncate">{formatDate(listing.created_at)}</span>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent block leading-none">
                {formatPrice(listing.price)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}