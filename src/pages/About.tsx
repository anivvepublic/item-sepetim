import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Shield, Zap, Users, Star, TrendingUp, Award, Heart, ArrowRight } from 'lucide-react';
import SEO from '@/components/seo/SEO';

const stats = [
  { label: 'Aktif Kullanıcı', value: '15.000+', icon: Users, color: 'from-primary-500 to-primary-600' },
  { label: 'Tamamlanan İşlem', value: '50.000+', icon: TrendingUp, color: 'from-accent-500 to-accent-600' },
  { label: 'Ortalama Puan', value: '4.9/5', icon: Star, color: 'from-yellow-400 to-yellow-500' },
  { label: 'Yıllık Deneyim', value: '2+', icon: Award, color: 'from-success-500 to-success-600' },
];

const values = [
  {
    icon: Shield,
    title: 'Güven & Güvenlik',
    description: 'Her işlem SSL şifreleme ve 256-bit güvenlik protokolleri ile korunur. Kullanıcı verileriniz hiçbir zaman üçüncü taraflarla paylaşılmaz.',
    color: 'bg-primary-100 dark:bg-primary-900/30',
    iconColor: 'text-primary-600',
  },
  {
    icon: Zap,
    title: 'Hız & Verimlilik',
    description: 'Anında bildirimler ve hızlı teslimat süreçleriyle işlemlerinizi dakikalar içinde tamamlayın. Bekletmeyiz.',
    color: 'bg-accent-100 dark:bg-accent-900/30',
    iconColor: 'text-accent-600',
  },
  {
    icon: Heart,
    title: 'Kullanıcı Odaklılık',
    description: '7/24 destek ekibimiz ve kullanıcı geri bildirimlerine dayanan sürekli geliştirme anlayışımızla her zaman yanınızdayız.',
    color: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500',
  },
  {
    icon: Users,
    title: 'Topluluk',
    description: 'Binlerce doğrulanmış satıcı ve alıcıdan oluşan güvenilir bir topluluk. Yorumlar ve puanlamalarla şeffaf bir ekosistem.',
    color: 'bg-success-100 dark:bg-success-900/30',
    iconColor: 'text-success-600',
  },
];

const milestones = [
  { year: '2024', title: 'Kuruluş', desc: 'Item Sepetim, oyun hesapları ve item ticaretine güvenli bir alternatif sunmak amacıyla kuruldu.' },
  { year: '2024', title: 'İlk 1.000 Kullanıcı', desc: 'Lansmandan yalnızca 3 ay sonra platformumuz 1.000 aktif kullanıcıya ulaştı.' },
  { year: '2025', title: 'Doğrulanmış Satıcı Sistemi', desc: 'Satıcı doğrulama ve güvence sistemi devreye alındı. Kullanıcı güveni %40 arttı.' },
  { year: '2026', title: 'Türkiye\'nin En Büyük Oyun Pazarı', desc: '15.000+ kullanıcı ve 50.000+ tamamlanan işlemle sektörün lider platformu olduk.' },
];

export default function About() {
  return (
    <>
      <SEO
        title="Hakkımızda - Item Sepetim"
        description="Item Sepetim, Türkiye'nin en güvenilir oyun hesapları ve item pazar yeri. 2024'ten beri binlerce oyuncuya güvenli alışveriş deneyimi sunuyoruz."
        url="/about"
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 py-24 px-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="container-custom relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Türkiye'nin En Güvenilir<br />
                <span className="text-yellow-300">Oyun Pazarı</span>
              </h1>
              <p className="text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
                2024'ten bu yana oyun dünyasına güvenli, hızlı ve şeffaf bir alışveriş deneyimi sunuyoruz. 
                Her işlemin arkasında gerçek bir güvence var.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="container-custom px-4 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-6 text-center group hover:shadow-float-lg transition-all"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 shadow-float`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-black text-neutral-900 dark:text-neutral-100 mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="bg-white dark:bg-neutral-900 py-20 px-4">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm font-semibold mb-4">
                  Misyonumuz
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-neutral-100 mb-6">
                  Oyun dünyasında güveni yeniden inşa ediyoruz
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-6">
                  Item Sepetim olarak amacımız tek: Oyuncuların dijital varlıklarını satarken ya da satın alırken 
                  hiçbir endişe yaşamaması. Doğrulanmış satıcı sistemi, escrow ödeme modeli ve 
                  7/24 destek hattımızla sektörde yeni bir standart belirliyoruz.
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Her işlemde şeffaflık, her anlaşmazlıkta hızlı çözüm, her kullanıcıda tam memnuniyet. 
                  Bu bizim vazgeçilmez üç ilkemiz.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-3xl p-8 border border-primary-100 dark:border-primary-900/50">
                  <div className="space-y-4">
                    {['✅ Doğrulanmış Satıcı Güvencesi', '🔒 SSL & 256-bit Şifreleme', '💬 7/24 Canlı Destek', '🔄 Hızlı İade Süreci', '⭐ Şeffaf Değerlendirme Sistemi', '🛡️ KVKK Uyumlu Veri İşleme'].map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-sm"
                      >
                        <span className="text-base">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="container-custom px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-accent-100 dark:bg-accent-900/30 text-accent-600 rounded-full text-sm font-semibold mb-4">
              Değerlerimiz
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-neutral-100">
              Bizi farklı kılan ne?
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-8 group hover:shadow-float-lg transition-all"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${val.color} rounded-2xl mb-5`}>
                  <val.icon className={`w-7 h-7 ${val.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">{val.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white dark:bg-neutral-900 py-20 px-4">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-success-100 dark:bg-success-900/30 text-success-600 rounded-full text-sm font-semibold mb-4">
                Yolculuğumuz
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-neutral-100">
                Bugünlere nasıl geldik?
              </h2>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-float">
                    <span className="text-white font-black text-sm">{m.year}</span>
                  </div>
                  <div className="card p-6 flex-1">
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-lg mb-2">{m.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-custom px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-12 text-center shadow-float-lg"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Topluluğumuza katıl
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              15.000'den fazla oyuncu zaten Item Sepetim'de. Sen de güvenli alışveriş deneyimini keşfet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold hover:shadow-float-lg transition-all group"
              >
                Ücretsiz Kayıt Ol
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/listings"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/30 transition-all"
              >
                İlanlara Göz At
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
