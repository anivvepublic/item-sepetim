import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Shield, Heart, Package, TrendingUp } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/shared/utils';
import { useAuthStore } from '@/lib/store/authStore';
import { useFavoriteStore } from '@/lib/store/favoriteStore';
import { useTransactionStore } from '@/lib/store/transactionStore';
import { SkeletonProfile } from '@/components/ui/Skeleton';

export default function ProfileInfo() {
  const { user, isLoading: authLoading } = useAuthStore();
  const { favorites, fetchFavorites } = useFavoriteStore();
  const { fetchTransactions, getCompletedCount, getTotalSpent } = useTransactionStore();

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchTransactions();
    }
  }, [user, fetchFavorites, fetchTransactions]);

  if (authLoading) {
    return <SkeletonProfile />;
  }

  if (!user) return null;

  const completedCount = getCompletedCount();
  const totalSpent = getTotalSpent();

  const infoCards = [
    {
      icon: Mail,
      label: 'E-posta',
      value: user.email,
      gradient: 'from-accent-500 to-accent-700',
      bgGradient: 'from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20'
    },
    {
      icon: Calendar,
      label: 'Üyelik Başlangıcı',
      value: formatDate(user.created_at),
      gradient: 'from-success-500 to-success-700',
      bgGradient: 'from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20'
    },
    {
      icon: Shield,
      label: 'Hesap Durumu',
      value: 'Aktif',
      gradient: 'from-blue-500 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
    }
  ];

  const statsCards = [
    {
      icon: Heart,
      label: 'Favori İlanlar',
      value: favorites.length.toString(),
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: Package,
      label: 'Tamamlanan İşlem',
      value: completedCount.toString(),
      color: 'text-primary-600',
      bg: 'bg-primary-50 dark:bg-primary-900/20'
    },
    {
      icon: TrendingUp,
      label: 'Toplam Harcama',
      value: formatPrice(totalSpent),
      color: 'text-success-600',
      bg: 'bg-success-50 dark:bg-success-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Profil Bilgileri
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Hesap bilgilerini görüntüle ve düzenle
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 lg:p-8 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative flex items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-float-lg">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username || user.email} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <span className="text-4xl font-bold text-white">
                {(user.username || user.email)[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {user.username || 'Kullanıcı'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-2">{user.email}</p>
            {user.is_admin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-full text-sm font-semibold shadow-float">
                <Shield className="w-4 h-4" />
                Admin Hesabı
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`p-5 bg-gradient-to-br ${card.bgGradient} rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-float-lg transition-all cursor-default group`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-float group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">{card.label}</div>
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {card.value}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="card p-6 text-center group cursor-default hover:shadow-float-lg transition-all"
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bg} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {stat.value}
            </div>
            <div className="text-neutral-600 dark:text-neutral-400 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}