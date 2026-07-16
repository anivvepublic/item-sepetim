import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle2, Clock, XCircle, ShoppingBag, Wallet, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTransactionStore } from '@/lib/store/transactionStore';
import { formatPrice, formatDate } from '../../../shared/utils';

const statusConfig = {
  completed: { 
    icon: CheckCircle2, 
    label: 'Tamamlandı', 
    color: 'text-success-600 dark:text-success-400', 
    bg: 'bg-success-50 dark:bg-success-900/20',
    border: 'border-success-200 dark:border-success-800'
  },
  pending: { 
    icon: Clock, 
    label: 'İşlemde', 
    color: 'text-accent-600 dark:text-accent-400', 
    bg: 'bg-accent-50 dark:bg-accent-900/20',
    border: 'border-accent-200 dark:border-accent-800'
  },
  cancelled: { 
    icon: XCircle, 
    label: 'İptal Edildi', 
    color: 'text-red-600 dark:text-red-400', 
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800'
  }
};

export default function ProfileTransactions() {
  const { transactions, isLoading, fetchTransactions, getCompletedCount, getTotalSpent } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const completedCount = getCompletedCount();
  const totalSpent = getTotalSpent();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 space-y-4">
              <div className="h-14 w-14 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse mx-auto"></div>
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mx-auto"></div>
              <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
          <Package className="w-8 h-8 text-primary-600" />
          Geçmiş İşlemler
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Satın alma geçmişini ve sipariş durumlarını buradan takip edebilirsin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center">
            <Wallet className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Toplam Harcama</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatPrice(totalSpent)}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-success-50 dark:bg-success-900/20 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-success-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Tamamlanan</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {completedCount}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-accent-50 dark:bg-accent-900/20 rounded-2xl flex items-center justify-center">
            <Clock className="w-7 h-7 text-accent-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Bekleyen</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
          </div>
        </motion.div>
      </div>

      {transactions.length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Henüz İşlem Yok</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">Yaptığın satın almalar burada görünecek.</p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            İlanlara Göz At
          </Link>
        </div>
      ) : (
        <div className="card p-6 lg:p-8">
          <div className="space-y-6">
            {transactions.map((trx, index) => {
              const config = statusConfig[trx.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              const listing = trx.listings;

              return (
                <motion.div
                  key={trx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border ${config.border} ${config.bg} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start gap-4 mb-4 md:mb-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-neutral-900 shadow-sm`}>
                      <StatusIcon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-lg">
                        {listing?.title || 'İlan Bilgisi Yok'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        <span>{listing?.game || 'Bilinmiyor'}</span>
                        <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                        <span>{formatDate(trx.created_at)}</span>
                        <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                        <span className="font-mono text-xs">{trx.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pl-16 md:pl-0">
                    <div className="text-right">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Tutar</p>
                      <p className="text-xl font-black text-neutral-900 dark:text-neutral-100">
                        {formatPrice(listing?.price || 0)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${config.color} bg-white dark:bg-neutral-900 shadow-sm`}>
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </span>
                      {listing && (
                        <Link
                          to={`/listings/${listing.id}`}
                          className="p-2 text-neutral-400 hover:text-primary-600 transition-colors"
                          title="İlanı Gör"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}