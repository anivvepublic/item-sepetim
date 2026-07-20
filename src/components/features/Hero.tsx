import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, ArrowRight, Star, Users, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HERO_IMAGES = [
  'https://steamcdn-a.akamaihd.net/steam/apps/730/library_600x900_2x.jpg',
  'https://steamcdn-a.akamaihd.net/steam/apps/578080/library_600x900_2x.jpg',
  'https://steamcdn-a.akamaihd.net/steam/apps/271590/library_600x900_2x.jpg',
  'https://steamcdn-a.akamaihd.net/steam/apps/1172470/library_600x900_2x.jpg',
];

const GAME_LABELS = ['CS2', 'PUBG', 'GTA V', 'APEX LEGENDS'];

const STATS = [
  { icon: Package, value: '150K+', label: 'Aktif İlan' },
  { icon: Users, value: '75K+', label: 'Memnun Kullanıcı' },
  { icon: Star, value: '300K+', label: 'Tamamlanan Sipariş' },
  { icon: Shield, value: '%100', label: 'Güvenli Alışveriş' },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-neutral-950 min-h-[92vh] flex flex-col">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-neutral-950">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
          alt="Gaming Background" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
        
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-600/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/3 mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/4 mix-blend-screen" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container-custom py-16 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">

            {/* Left: Text content (2/5) */}
            <div className="lg:col-span-2 flex flex-col items-center text-center lg:items-start lg:text-left pt-8 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-full mb-6 lg:mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-semibold text-primary-300 tracking-wider uppercase">
                  Türkiye'nin #1 Oyun Pazarı
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15] mb-4 sm:mb-5 max-w-lg lg:max-w-none mx-auto lg:mx-0"
              >
                Oyun Hesapları
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 py-1">
                  ve Itemler İçin
                </span>
                Tek Adres
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-neutral-400 text-sm sm:text-lg leading-relaxed mb-8 max-w-sm sm:max-w-md mx-auto lg:mx-0 px-2 sm:px-0"
              >
                Binlerce oyun hesabı ve item arasından en iyisini seç, güvenle satın al. Hızlı teslimat garantisi.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10 px-4 sm:px-0"
              >
                <button
                  onClick={() => navigate('/listings')}
                  className="group flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-900/40 hover:shadow-primary-900/60 hover:scale-[1.02] text-sm sm:text-base w-full sm:w-auto"
                >
                  Alışverişe Başla
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/create-listing')}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3.5 bg-white/8 hover:bg-white/12 border border-white/15 hover:border-white/25 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm text-sm sm:text-base w-full sm:w-auto"
                >
                  İlan Ver
                </button>
              </motion.div>

              {/* Feature pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-2.5"
              >
                {[
                  { icon: Shield, label: 'Güvenli Ödeme' },
                  { icon: Zap, label: 'Anında Teslimat' },
                  { icon: TrendingUp, label: 'En İyi Fiyat' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs text-neutral-300 font-medium"
                  >
                    <Icon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary-400" />
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: 4-panel slanted images (3/5) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-3 relative h-[320px] sm:h-[400px] lg:h-[480px] overflow-hidden rounded-2xl hidden sm:block"
            >
              <div className="absolute inset-0 flex gap-1.5">
                {HERO_IMAGES.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="relative flex-1 overflow-hidden group"
                    style={{
                      clipPath: i === 0
                        ? 'polygon(0 0, 92% 0, 100% 100%, 0 100%)'
                        : i === HERO_IMAGES.length - 1
                        ? 'polygon(0 0, 100% 0, 100% 100%, 8% 100%)'
                        : 'polygon(0 0, 92% 0, 100% 100%, 8% 100%)',
                      marginLeft: i > 0 ? '-16px' : '0',
                    }}
                  >
                    <img
                      src={src}
                      alt={`Game ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.style.background = `hsl(${220 + i * 20}, 50%, ${15 + i * 5}%)`;
                        }
                      }}
                    />
                    {/* Dark overlay that lightens on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:from-black/40 group-hover:via-black/10 group-hover:to-transparent transition-all duration-500" />
                    {/* Bottom label */}
                    <div className="absolute bottom-3 inset-x-0 flex justify-center">
                      <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase">
                        {GAME_LABELS[i]}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Gradient fade on edges */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none z-10" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-white/8">
        <div className="container-custom py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-3 py-2"
              >
                <div className="w-9 h-9 rounded-xl bg-primary-500/15 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white leading-none">{value}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}