import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Heart, Eye, Calendar } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/shared/utils';
import type { Listing } from '@/lib/shared/types';

interface PremiumListingCardProps {
  listing: Listing;
}

export default function PremiumListingCard({ listing }: PremiumListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Daha yumuşak bir tilt için spring kullanıyoruz
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-100, 100], [3, -3]); // Doğal his için ters
  const rotateY = useTransform(mouseX, [-100, 100], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newRipple = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  // Valorant için özel renkler (Dinamik olarak oyun ismine göre değişebilir)
  const accentColor = listing.game === 'Valorant' ? '#ff4655' : '#7c3aed';
  const tagGradient = listing.game === 'Valorant' 
    ? 'from-[#6d28d9] to-[#ec4899]' 
    : 'from-blue-600 to-cyan-400';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="relative w-[340px] h-[480px] rounded-2xl cursor-pointer group"
    >
      {/* 1. KATMAN: Neon Border Glow (Hover'da belirir) */}
      <motion.div 
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{ background: `linear-gradient(135deg, ${accentColor}, transparent, ${accentColor})` }}
      />

      {/* 2. KATMAN: Ana Kart (Glassmorphism + Noise) */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0d1117]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* Shimmer Effect (Hover'da soldan sağa kayan ışık) */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          initial={{ x: '-150%' }}
          whileHover={{ x: '150%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* --- ÜST GÖRSEL ALANI --- */}
        <div className="relative h-[55%] overflow-hidden">
          {/* Görsel */}
          <motion.img 
            src={listing.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={listing.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Radial Gradient Overlay (İçe çeken karanlık) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(13,17,23,0.8)_100%)]" />

          {/* Mesh Gradient Fade (Alt kısım geçişi) */}
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#0d1117] to-transparent" />

          {/* Status Badge (Pulsing) */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 z-20">
            <motion.span 
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] font-bold text-green-400 tracking-widest uppercase">Aktif</span>
          </div>

          {/* Favori Butonu (Frosted Glass) */}
          <motion.button
            onClick={handleFavoriteClick}
            whileTap={{ scale: 0.8 }}
            animate={isFavorite ? { scale: [1, 1.3, 0.9, 1] } : {}}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 z-20 hover:bg-white/20 transition-colors"
          >
            <Heart 
              className={`w-4 h-4 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </motion.button>
        </div>

        {/* --- ALT İÇERİK ALANI --- */}
        <div className="relative h-[45%] p-5 flex flex-col justify-between z-20">
          
          {/* Tag'ler */}
          <div className="flex gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold text-white bg-gradient-to-r ${tagGradient} shadow-[0_0_10px_rgba(109,40,217,0.3)]`}>
              {listing.game}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold text-white bg-white/10 border border-white/10">
              {listing.category}
            </span>
          </div>

          {/* Başlık (Gradient Text + Glow) */}
          <motion.h3 
            className="text-lg font-bold leading-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#f8fafc] to-[#c4b5fd] group-hover:drop-shadow-[0_0_8px_rgba(196,181,253,0.5)] transition-all duration-300"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {listing.title}
          </motion.h3>

          {/* Açıklama (Fade out mask) */}
          <p className="text-[13px] leading-relaxed text-[rgba(248,250,252,0.55)] line-clamp-2 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] mb-4">
            {listing.description}
          </p>

          {/* Fiyat ve Tarih */}
          <div className="flex items-end justify-between mt-auto pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[rgba(248,250,252,0.5)]">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{formatDate(listing.created_at)}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[rgba(248,250,252,0.5)] mb-0.5">Fiyat</span>
              <div className="flex items-center gap-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-red-500">
                <span className="text-sm font-semibold">₺</span>
                <span className="text-xl font-bold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {listing.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* "Detayları Gör" Butonu */}
          <motion.button
            onClick={handleButtonClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative w-full mt-4 overflow-hidden flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/15 text-[#f8fafc] text-sm font-semibold transition-colors duration-300 group/btn hover:border-[var(--accent)]"
            style={{ '--accent': accentColor } as React.CSSProperties}
          >
            {/* Ripple Effects */}
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                className="absolute bg-white/30 rounded-full pointer-events-none"
                initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y, opacity: 0.5 }}
                animate={{ width: 300, height: 300, x: ripple.x - 150, y: ripple.y - 150, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
            
            <Eye className="w-4 h-4 transition-colors group-hover/btn:text-[var(--accent)]" />
            <span className="relative z-10">Detayları Gör</span>
          </motion.button>

        </div>
      </div>
    </motion.div>
  );
}