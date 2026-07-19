import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore, type CartItem } from '@/lib/store/cartStore';
import { usePaymentStore } from '@/lib/store/paymentStore';
import { formatPrice } from '@/lib/shared/utils';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';
import { showToast } from '@/components/ui/Toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { setPaymentItems } = usePaymentStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (!isAuthenticated) {
      showToast('Ödemeye geçmek için lütfen giriş yapın', 'info');
      onClose();
      navigate('/login');
      return;
    }

    const paymentItems = items.map((item: CartItem) => ({
      id: item.id,
      listingId: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      game: item.game,
      sellerId: '',
    }));

    setPaymentItems(paymentItems);
    onClose();
    navigate('/checkout?source=cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col border-l border-neutral-200 dark:border-neutral-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Sepetim</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{items.length} ürün</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Sepetiniz Boş</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 max-w-xs">
                    Henüz sepetinize herhangi bir ürün eklemediniz. İlanlara göz atarak alışverişe başlayabilirsiniz.
                  </p>
                  <button
                    onClick={() => { onClose(); navigate('/listings'); }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    İlanlara Göz At
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 group"
                    >
                      <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-xl overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-neutral-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                            {item.game}
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 mt-1">
                            {item.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-black text-gradient">
                            {formatPrice(item.price)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Sepetten Çıkar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-neutral-600 dark:text-neutral-400">Ara Toplam</span>
                  <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-float-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Ödemeye Geç
                  <ShoppingBag className="w-5 h-5" />
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full mt-3 py-3 text-neutral-500 dark:text-neutral-400 text-sm font-medium hover:text-red-500 transition-colors"
                >
                  Sepeti Temizle
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}