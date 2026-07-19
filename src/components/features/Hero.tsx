import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap } from 'lucide-react';
import { GAME_CATEGORIES } from '@/lib/shared/constants';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Hero() {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, title: 'Güvenli Alışveriş', description: 'Tüm işlemler şifrelenmiş ve güvende' },
    { icon: Zap, title: 'Anında Teslimat', description: 'Satın alma sonrası hızlı teslimat' },
    { icon: TrendingUp, title: 'En İyi Fiyatlar', description: 'Piyasanın en uygun fiyatları' }
  ];

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.jpg" alt="Gaming Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-primary-950/80 to-black/90"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse"></div>
        </div>
      </div>

      <div className="container-custom relative z-10 py-20 lg:py-32">
        {/* YAZILAR ORTADA */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <Zap className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-white">Türkiye'nin #1 Oyun Pazarı</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight sm:leading-relaxed tracking-wide text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.02em' }}>
            <span className="block mb-1 sm:mb-2">Oyun Hesapları ve</span>
            <span className="block mb-1 sm:mb-2 bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">Itemler İçin</span>
            <span className="block">Tek Adres</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg sm:text-xl md:text-2xl text-neutral-200 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Binlerce oyun hesabı ve item, güvenli alışveriş, hızlı teslimat
          </motion.p>

          {/* ARAMA ÇUBUĞU - ORTADA AMA DROPDOWN SOLA AÇILIYOR */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-3xl mx-auto">
            <SearchBar variant="hero" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-wrap justify-center gap-3 mt-8">
            {GAME_CATEGORIES.map((game: string) => (
              <button key={game} onClick={() => navigate(`/?game=${encodeURIComponent(game)}`)} className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white hover:bg-white/20 hover:border-accent-400/50 transition-all" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {game}
              </button>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-500/20 rounded-xl mb-4">
                  <feature.icon className="w-7 h-7 text-accent-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{feature.title}</h3>
                <p className="text-neutral-300 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 dark:from-neutral-950 to-transparent z-10"></div>
    </section>
  );
}