import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShoppingCart, Shield, CreditCard, User, AlertCircle, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/seo/SEO';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  icon: React.ElementType;
  label: string;
  color: string;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    icon: ShoppingCart,
    label: 'Alım & Satım',
    color: 'from-primary-500 to-primary-600',
    items: [
      {
        q: 'Item Sepetim\'de nasıl hesap satışa çıkarabilirim?',
        a: 'Platforma kayıt olduktan sonra "İlan Oluştur" butonuna tıklayın. Oyununuzu, kategoriyi ve fiyatı belirleyin. Açıklama ve görseller ekleyin. İlanınız onaylandıktan sonra canlıya geçer.',
      },
      {
        q: 'Satın alma işleminden sonra hesabı nasıl teslim alırım?',
        a: 'Ödemeniz onaylandıktan sonra satıcı size hesap bilgilerini iletmekle yükümlüdür. Teslimat 24 saat içinde gerçekleşmelidir. Sorun yaşarsanız destek ekibimizle iletişime geçin.',
      },
      {
        q: 'İlan verirken hangi bilgileri sağlamam gerekiyor?',
        a: 'Oyun adı, kategori (Hesap/Item), fiyat, detaylı açıklama ve en az 1 ekran görüntüsü zorunludur. Rank, seviye, skin gibi detayları da eklemanızı öneririz.',
      },
      {
        q: 'Hesap satarken komisyon alıyor musunuz?',
        a: 'Evet, her başarılı satıştan küçük bir platform komisyonu alınmaktadır. Mevcut komisyon oranları ilan oluşturma ekranında görüntülenebilir.',
      },
    ],
  },
  {
    icon: Shield,
    label: 'Güvenlik',
    color: 'from-success-500 to-success-600',
    items: [
      {
        q: 'Satıcıların gerçek olduğundan nasıl emin olabilirim?',
        a: 'Tüm satıcılar platformumuza kayıt olurken kimlik doğrulamasından geçer. Doğrulanmış satıcılarda özel bir rozet görebilirsiniz. Ayrıca her satıcının puan ve yorum geçmişini inceleyebilirsiniz.',
      },
      {
        q: 'Aldığım hesap ban yerse ne olur?',
        a: 'Satıcı, hesabın ban durumunu gizlemişse bu bir dolandırıcılık vakasıdır. 48 saat içinde destek ekibimize başvurun. Durumu doğrularsak iade başlatırız.',
      },
      {
        q: 'Ödeme bilgilerim güvende mi?',
        a: 'Ödeme bilgileriniz 256-bit SSL şifreleme ile korunur. Kart bilgilerinizi hiçbir zaman sunucularımızda saklamayız. Tüm ödeme işlemleri PCI-DSS uyumlu altyapılardan geçer.',
      },
      {
        q: 'Platform garantisi var mı?',
        a: 'Evet. Satıcı, anlaşılan ürünü teslim etmezse ve 48 saat içinde çözüm sağlanamazsa platform güvencemiz devreye girer ve ödemenizi iade ederiz.',
      },
    ],
  },
  {
    icon: CreditCard,
    label: 'Ödeme & İade',
    color: 'from-accent-500 to-accent-600',
    items: [
      {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: 'Kredi/banka kartı, havale/EFT ve çeşitli dijital cüzdanlar ile ödeme yapabilirsiniz. Desteklenen yöntemler ödeme ekranında görüntülenir.',
      },
      {
        q: 'İade sürecim ne kadar sürer?',
        a: 'Onaylanan iade talepleri 3-7 iş günü içinde işleme alınır. Ödeme yönteminize göre paranızın hesabınıza geçme süresi değişebilir.',
      },
      {
        q: 'Teslimat gerçekleşmezse paramı geri alabilir miyim?',
        a: 'Kesinlikle. Satıcı ürünü teslim etmediği veya ürün tanımlananla örtüşmediği durumlarda tam iade hakkınız mevcuttur.',
      },
    ],
  },
  {
    icon: User,
    label: 'Hesap & Profil',
    color: 'from-purple-500 to-purple-600',
    items: [
      {
        q: 'Kullanıcı adımı değiştirebilir miyim?',
        a: 'Evet, Profil > Ayarlar sayfasından kullanıcı adınızı değiştirebilirsiniz. Kullanıcı adı değişikliği 30 günde bir kez yapılabilir.',
      },
      {
        q: 'Hesabımı nasıl silerim?',
        a: 'Profil > Ayarlar > Hesabımı Sil bölümünden hesabınızı kalıcı olarak silebilirsiniz. Silme işlemi geri alınamaz.',
      },
      {
        q: 'Şifremi unuttum, ne yapmalıyım?',
        a: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayın. E-posta adresinize şifre sıfırlama bağlantısı gönderilir.',
      },
    ],
  },
  {
    icon: AlertCircle,
    label: 'Sorunlar & Şikayetler',
    color: 'from-red-500 to-red-600',
    items: [
      {
        q: 'Dolandırıcılıkla karşılaştım, ne yapmalıyım?',
        a: 'Derhal destek ekibimize bildirin. İlgili kullanıcıyı ve işlemi raporlayın. Ekibimiz 2 saat içinde müdahale eder. Mümkünse kanıt (ekran görüntüsü vb.) saklayın.',
      },
      {
        q: 'Satıcı beni taciz ediyor, şikayet edebilir miyim?',
        a: 'Evet. Kullanıcı profilindeki "Şikayet Et" butonunu kullanın. Ciddi vakalar 24 saat içinde sonuçlandırılır. Gerekirse hesap askıya alınır.',
      },
      {
        q: 'Destek ekibine nasıl ulaşabilirim?',
        a: 'İletişim sayfamızdaki form, destek e-posta adresi veya canlı sohbet üzerinden 7/24 ulaşabilirsiniz. Yanıt süresi genellikle 1-2 saattir.',
      },
    ],
  },
];

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      >
        <span className="font-semibold text-neutral-900 dark:text-neutral-100 pr-4">{item.q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronDown className="w-5 h-5 text-primary-600" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-5 bg-primary-50/50 dark:bg-primary-900/10 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed pt-4">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItem, setOpenItem] = useState<number | null>(null);

  const handleToggle = (i: number) => {
    setOpenItem(openItem === i ? null : i);
  };

  const handleCategoryChange = (i: number) => {
    setActiveCategory(i);
    setOpenItem(null);
  };

  return (
    <>
      <SEO
        title="SSS - Sıkça Sorulan Sorular | Item Sepetim"
        description="Item Sepetim hakkında en çok sorulan soruların cevapları. Alım, satım, güvenlik, ödeme ve hesap yönetimi konularında yardım."
        url="/faq"
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-20 px-4">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                Sıkça Sorulan Sorular
              </h1>
              <p className="text-primary-100 text-lg max-w-xl mx-auto">
                Aradığınız cevabı bulamadınız mı? Destek ekibimiz 7/24 hizmetinizde.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-custom px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-4 sticky top-24">
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-2">Kategoriler</h3>
                <nav className="space-y-1">
                  {categories.map((cat, i) => (
                    <button
                      key={cat.label}
                      onClick={() => handleCategoryChange(i)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                        activeCategory === i
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <cat.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{cat.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 bg-gradient-to-br ${categories[activeCategory].color} rounded-xl flex items-center justify-center shadow-float`}>
                      {(() => {
                        const Icon = categories[activeCategory].icon;
                        return <Icon className="w-5 h-5 text-white" />;
                      })()}
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {categories[activeCategory].label}
                    </h2>
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm font-semibold">
                      {categories[activeCategory].items.length} soru
                    </span>
                  </div>
                  <div className="space-y-3">
                    {categories[activeCategory].items.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <FAQAccordionItem
                          item={item}
                          isOpen={openItem === i}
                          onToggle={() => handleToggle(i)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Still need help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 card p-8 text-center"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-float">
              <Headphones className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Hâlâ yardıma mı ihtiyacınız var?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Destek ekibimiz 7/24 çevrimiçi. Ortalama yanıt süremiz 1-2 saattir.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-float-lg transition-all"
            >
              <Headphones className="w-5 h-5" />
              Destek Al
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
