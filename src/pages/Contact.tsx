import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Clock, Send, CheckCircle, AlertCircle, Headphones, Globe } from 'lucide-react';
import SEO from '@/components/seo/SEO';

const contactMethods = [
  {
    icon: Mail,
    title: 'E-posta',
    description: 'Genel sorular ve geri bildirimler',
    value: 'destek@itemsepetim.com',
    action: 'mailto:destek@itemsepetim.com',
    color: 'from-primary-500 to-primary-600',
    badge: '~2 saat',
  },
  {
    icon: MessageCircle,
    title: 'Canlı Sohbet',
    description: '7/24 anlık destek',
    value: 'Şu an çevrimiçi',
    action: '#',
    color: 'from-success-500 to-success-600',
    badge: 'Anlık',
  },
  {
    icon: Headphones,
    title: 'Uyuşmazlık Bildirimi',
    description: 'Dolandırıcılık veya anlaşmazlık raporlama',
    value: 'guvenlik@itemsepetim.com',
    action: 'mailto:guvenlik@itemsepetim.com',
    color: 'from-red-500 to-red-600',
    badge: '~30 dk',
  },
  {
    icon: Globe,
    title: 'Gizlilik & KVKK',
    description: 'Kişisel veri talepleri',
    value: 'privacy@itemsepetim.com',
    action: 'mailto:privacy@itemsepetim.com',
    color: 'from-accent-500 to-accent-600',
    badge: '~4 saat',
  },
];

const subjects = [
  'Genel Soru',
  'Alım/Satım Sorunu',
  'Ödeme Problemi',
  'Güvenlik / Dolandırıcılık',
  'Hesap Sorunu',
  'Teknik Problem',
  'İade Talebi',
  'Diğer',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="İletişim - Item Sepetim"
        description="Item Sepetim destek ekibiyle iletişime geçin. 7/24 yardım, e-posta ve canlı sohbet desteği sunuyoruz."
        url="/contact"
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
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                Bize Ulaşın
              </h1>
              <p className="text-primary-100 text-lg max-w-xl mx-auto">
                Sorularınız, önerileriniz veya sorunlarınız için destek ekibimiz 7/24 yanınızdadır.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-custom px-4 py-16">
          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((m, i) => (
              <motion.a
                key={m.title}
                href={m.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 group hover:shadow-float-lg transition-all cursor-pointer block"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center mb-4 shadow-float group-hover:scale-110 transition-transform`}>
                  <m.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100">{m.title}</h3>
                  <span className="text-xs bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {m.badge}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{m.description}</p>
                <p className="text-sm text-primary-600 font-semibold group-hover:underline">{m.value}</p>
              </motion.a>
            ))}
          </div>

          {/* Form + Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-8"
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-success-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                      Mesajınız İletildi!
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                      En kısa sürede geri dönüş yapacağız. Ortalama yanıt süremiz 1-2 saattir.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="px-6 py-3 text-primary-600 border-2 border-primary-200 dark:border-primary-800 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Mesaj Gönder</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-8">Formu doldurun, ekibimiz size ulaşsın.</p>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Adınız Soyadınız *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Örn: Ahmet Yılmaz"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            E-posta Adresiniz *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ornek@mail.com"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          Konu *
                        </label>
                        <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          <option value="">Konu seçin...</option>
                          {subjects.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          Mesajınız *
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Sorununuzu veya isteğinizi detaylı açıklayın..."
                          rows={6}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:shadow-float-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Gönderiliyor...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Mesajı Gönder
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  Çalışma Saatlerimiz
                </h3>
                <div className="space-y-3">
                  {[
                    { day: 'Pazartesi - Cuma', hours: '09:00 - 22:00' },
                    { day: 'Cumartesi', hours: '10:00 - 20:00' },
                    { day: 'Pazar', hours: '12:00 - 18:00' },
                    { day: 'Acil Destek (7/24)', hours: 'Tüm Günler' },
                  ].map((row) => (
                    <div key={row.day} className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">{row.day}</span>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{row.hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4">Hızlı Yanıt Garantisi</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Canlı Sohbet', value: 'Anlık', color: 'bg-success-500' },
                    { label: 'E-posta', value: '~2 saat', color: 'bg-primary-500' },
                    { label: 'Güvenlik Bildirimi', value: '~30 dk', color: 'bg-red-500' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${row.color} rounded-full`} />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{row.label}</span>
                      </div>
                      <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{row.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-6 text-white"
              >
                <h3 className="font-bold mb-2">Sık sorulan sorular için</h3>
                <p className="text-primary-100 text-sm mb-4">Hızlıca yanıt bulabilmek için SSS sayfamızı ziyaret edin.</p>
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  SSS'ye Git →
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
