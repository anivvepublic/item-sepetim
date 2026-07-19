import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Home, Package, FileText } from 'lucide-react';
import { shopierPaymentService, type ShopierCallbackPayload } from '@/lib/services/shopier';
import SEO from '@/components/seo/SEO';
import { usePaymentStore } from '@/lib/store/paymentStore';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'success' | 'failure' | 'pending' | 'mock'>('pending');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState('Odeme sonucu kontrol ediliyor...');

  const { reset, items } = usePaymentStore();

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    const statusParam = searchParams.get('status');

    setOrderId(orderIdParam);

    if (statusParam === 'mock') {
      setStatus('mock');
      setMessage('Bu bir test odemesidir. Gercek Shopier API bilgileri eklendiginde kullanici Shopier odeme sayfasina yonlendirilecektir.');
      return;
    }

    const payload: ShopierCallbackPayload = {
      orderId: orderIdParam || '',
      status: (statusParam as any) || 'pending',
      transactionId: searchParams.get('transactionId') || undefined,
      amount: searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : undefined,
      currency: searchParams.get('currency') || undefined,
      signature: searchParams.get('signature') || undefined,
    };

    const isVerified = shopierPaymentService.verifyCallback(payload);

    if (isVerified) {
      setStatus('success');
      setMessage('Odemeniz basariyla alindi. Siparis durumunuzu "Islemlerim" sayfasindan takip edebilirsiniz.');
      // Basarili odeme sonrasi odeme state'i temizlenebilir
      if (orderIdParam) {
        reset();
      }
    } else if (payload.status === 'failure') {
      setStatus('failure');
      setMessage('Odeme islemi basarisiz oldu veya iptal edildi. Lutfen tekrar deneyin veya destek ile iletisime gecin.');
    } else {
      setStatus('pending');
      setMessage('Odeme durumu henuz netlesmedi. Lutfen biraz bekleyin, onaylandiginda e-posta ile bilgilendirileceksiniz.');
    }
  }, [searchParams, reset]);

  const iconConfig = {
    success: { icon: CheckCircle, color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-900/20', title: 'Odeme Basarili' },
    failure: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', title: 'Odeme Basarisiz' },
    pending: { icon: Loader2, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-900/20', title: 'Islem Bekleniyor' },
    mock: { icon: CheckCircle, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20', title: 'Test Odeme Modu' },
  };

  const config = iconConfig[status];
  const Icon = config.icon;

  return (
    <>
      <SEO
        title={`${config.title} - Item Sepetim`}
        description="Odeme sonucu sayfasi."
        url="/payment/result"
        noindex={true}
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className={`w-24 h-24 ${config.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <Icon className={`w-12 h-12 ${config.color} ${status === 'pending' ? 'animate-spin' : ''}`} />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            {config.title}
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            {message}
          </p>

          {orderId && (
            <div className="mb-6 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Siparis No</p>
              <p className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">{orderId}</p>
            </div>
          )}

          {items.length > 0 && status === 'success' && (
            <div className="mb-6 text-left">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Satin Alinan Urunler:</p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.listingId} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary-500" />
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Ana Sayfa
            </Link>
            <Link
              to="/profile/transactions"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-xl font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Islemlerim
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
