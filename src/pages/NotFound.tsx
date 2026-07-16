import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, Gamepad2 } from 'lucide-react';
import SEO from '@/components/seo/SEO';

export default function NotFound() {
  return (
    <>
      <SEO
        title="404 - Sayfa Bulunamadı"
        description="Aradığınız sayfa bulunamadı. Ana sayfaya dönerek devam edebilirsiniz."
        noindex={true}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="relative mb-8"
          >
            <div className="text-[12rem] md:text-[16rem] font-black leading-none bg-gradient-to-br from-primary-600 via-accent-500 to-primary-700 bg-clip-text text-transparent select-none">
              404
            </div>
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Gamepad2 className="w-24 h-24 md:w-32 md:h-32 text-primary-600/20" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4"
          >
            Ups! Bu sayfa kaybolmuş
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-600 dark:text-neutral-400 mb-8"
          >
            Aradığın sayfa ya taşınmış, ya silinmiş ya da hiç var olmamış. 
            Ama merak etme, sana yardımcı olacak başka yollar var.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-float-lg transition-all group"
            >
              <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Ana Sayfaya Dön
            </Link>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold hover:border-primary-600 hover:text-primary-600 transition-all"
            >
              <Search className="w-5 h-5" />
              İlanlara Göz At
            </Link>
          </motion.div>

          {/* Popüler Oyunlar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Belki bunları arıyordun?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Valorant', 'Mobile Legends', 'PUBG Mobile', 'Wild Rift'].map((game) => (
                <Link
                  key={game}
                  to={`/listings?game=${encodeURIComponent(game)}`}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm hover:bg-primary-600 hover:text-white transition-all"
                >
                  {game}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}