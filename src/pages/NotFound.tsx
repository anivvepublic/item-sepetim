import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, Gamepad2, ArrowLeft, Ghost } from 'lucide-react';
import SEO from '@/components/seo/SEO';

export default function NotFound() {
  return (
    <>
      <SEO 
        title="404 - Sayfa Bulunamadı | Item Sepetim" 
        description="Aradığınız sayfa bulunamadı veya taşınmış olabilir." 
        url="/404" 
        noindex={true} 
      />
      
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6 overflow-hidden relative">
        {/* Arkaplan Efektleri */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container-custom max-w-4xl relative z-10 text-center">
          {/* Animasyonlu 404 Yazısı */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8"
          >
            <h1 className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter">
              <span className="bg-gradient-to-br from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent drop-shadow-2xl">
                4
              </span>
              <span className="inline-block animate-bounce mx-2 md:mx-4">
                <Ghost className="w-24 h-24 md:w-40 md:h-40 text-accent-500" />
              </span>
              <span className="bg-gradient-to-br from-accent-500 via-primary-600 to-accent-500 bg-clip-text text-transparent drop-shadow-2xl">
                4
              </span>
            </h1>
          </motion.div>

          {/* Başlık ve Açıklama */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Oops! İlan Başka Bir Boyuta Işınlanmış
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Aradığın sayfa ya silinmiş, ya taşınmış ya da henüz bu sunucuya drop edilmemiş. 
              Ama merak etme, envanterimizde hala yüzlerce item var!
            </p>
          </motion.div>

          {/* Butonlar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl font-bold text-lg shadow-float-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              Ana Üsse Dön
            </Link>

            <Link
              to="/listings"
              className="group flex items-center gap-2 px-8 py-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl font-bold text-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-float-lg transition-all"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              İlanlarda Ara
            </Link>
          </motion.div>

          {/* Alt Bilgi / Oyun Temalı Küçük Detay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex items-center justify-center gap-2 text-neutral-400 dark:text-neutral-600 text-sm"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Game Over değil, sadece respawn olman gerekiyor.</span>
            <button 
              onClick={() => window.history.back()} 
              className="ml-2 flex items-center gap-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri Git
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}