import { motion } from 'framer-motion';
import { Shield, Eye, Database, Lock, UserCheck, Trash2, Mail, FileText } from 'lucide-react';
import SEO from '@/components/seo/SEO';

const sections = [
  {
    icon: Database,
    title: '1. Topladığımız Veriler',
    content: [
      { subtitle: 'Hesap Bilgileri', text: 'Kayıt olurken sağladığınız e-posta adresi, kullanıcı adı ve şifre (şifrelenmiş olarak) saklanır.' },
      { subtitle: 'Profil Bilgileri', text: 'Gönüllü olarak eklediğiniz profil fotoğrafı ve diğer bilgiler.' },
      { subtitle: 'İşlem Geçmişi', text: 'Platform üzerinde gerçekleştirdiğiniz alım-satım işlemlerine ait kayıtlar.' },
      { subtitle: 'Teknik Veriler', text: 'IP adresi, tarayıcı türü, cihaz bilgisi ve platform kullanım istatistikleri.' },
    ],
  },
  {
    icon: Eye,
    title: '2. Verilerinizi Nasıl Kullanıyoruz?',
    content: [
      { subtitle: 'Hizmet Sunumu', text: 'Hesabınızı yönetmek, işlemlerinizi gerçekleştirmek ve size destek sağlamak.' },
      { subtitle: 'Güvenlik', text: 'Dolandırıcılık, yetkisiz erişim ve diğer güvenlik tehditlerini tespit etmek ve önlemek.' },
      { subtitle: 'İletişim', text: 'İşlemleriniz, hesabınız veya platformdaki değişiklikler hakkında sizi bilgilendirmek.' },
      { subtitle: 'İyileştirme', text: 'Platform performansını, kullanıcı deneyimini ve hizmet kalitesini artırmak.' },
    ],
  },
  {
    icon: UserCheck,
    title: '3. Verilerinizi Kimlerle Paylaşıyoruz?',
    content: [
      { subtitle: 'Üçüncü Taraflarla Paylaşım Yok', text: 'Kişisel verilerinizi reklam amaçlı üçüncü taraflarla kesinlikle paylaşmıyoruz.' },
      { subtitle: 'Yasal Zorunluluklar', text: 'Yalnızca mahkeme kararı veya yasal düzenleme gerektirdiğinde yetkili makamlarla paylaşım yapılır.' },
      { subtitle: 'Hizmet Sağlayıcılar', text: 'Platform altyapısı için kullandığımız güvenilir hizmet sağlayıcılar (Supabase vb.) GDPR/KVKK uyumludur.' },
    ],
  },
  {
    icon: Lock,
    title: '4. Veri Güvenliği',
    content: [
      { subtitle: 'Şifreleme', text: 'Tüm veriler 256-bit AES şifreleme ile korunur. SSL/TLS protokolleri tüm bağlantılarda zorunludur.' },
      { subtitle: 'Şifre Güvenliği', text: 'Şifreleriniz bcrypt algoritması ile hashlenerek saklanır. Şifrelerinize asla erişemeyiz.' },
      { subtitle: 'Erişim Kontrolü', text: 'Verilerinize yalnızca yetkili personel erişebilir. Tüm erişimler kayıt altına alınır.' },
      { subtitle: 'Düzenli Denetim', text: 'Güvenlik sistemlerimiz düzenli olarak denetlenir ve güncellenir.' },
    ],
  },
  {
    icon: Shield,
    title: '5. KVKK Kapsamındaki Haklarınız',
    content: [
      { subtitle: 'Bilgi Alma Hakkı', text: 'Kişisel verilerinizin işlenip işlenmediğini öğrenme ve buna ilişkin bilgi talep etme hakkınız.' },
      { subtitle: 'Düzeltme Hakkı', text: 'Hatalı veya eksik kişisel verilerinizin düzeltilmesini talep etme hakkınız.' },
      { subtitle: 'Silme Hakkı', text: 'Belirli koşullar altında kişisel verilerinizin silinmesini ("unutulma hakkı") talep etme hakkınız.' },
      { subtitle: 'İtiraz Hakkı', text: 'Kişisel verilerinizin işlenmesine itiraz etme hakkınız.' },
    ],
  },
  {
    icon: FileText,
    title: '6. Çerezler (Cookies)',
    content: [
      { subtitle: 'Zorunlu Çerezler', text: 'Oturum yönetimi ve güvenlik için gerekli olan temel çerezler. Bunları devre dışı bırakamazsınız.' },
      { subtitle: 'Analitik Çerezler', text: 'Platform kullanımını anlamamıza yardımcı olan anonim istatistik çerezleri. Tercihlerinize göre kapatabilirsiniz.' },
      { subtitle: 'Tercih Çerezleri', text: 'Dil, tema gibi tercihlerinizi hatırlayan çerezler.' },
    ],
  },
  {
    icon: Trash2,
    title: '7. Veri Saklama Süresi',
    content: [
      { subtitle: 'Aktif Hesaplar', text: 'Hesabınız aktif olduğu sürece verileriniz saklanır.' },
      { subtitle: 'Silinen Hesaplar', text: 'Hesabınızı sildiğinizde kişisel verileriniz 30 gün içinde sistemden kaldırılır.' },
      { subtitle: 'İşlem Kayıtları', text: 'Yasal zorunluluk gereği işlem kayıtları 10 yıl süreyle saklanır.' },
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <SEO
        title="Gizlilik Politikası - Item Sepetim"
        description="Item Sepetim gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi edinin."
        url="/privacy"
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card p-8 lg:p-12 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-float">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                  Gizlilik Politikası
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">Son güncelleme: 15 Temmuz 2026</p>
              </div>
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-900/50 rounded-xl p-4 mb-4">
              <p className="text-primary-700 dark:text-primary-300 text-sm font-medium">
                🔒 Item Sepetim olarak gizliliğinize saygı duyuyoruz. Bu politika, 6698 sayılı KVKK hükümlerine uygun olarak hazırlanmıştır.
              </p>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Bu Gizlilik Politikası, Item Sepetim platformunu kullanırken kişisel verilerinizin nasıl toplandığını, 
              işlendiğini ve korunduğunu açıklar. Platformumuzu kullanarak bu politikayı kabul etmiş olursunuz.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="card p-6 lg:p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((item) => (
                    <div key={item.subtitle} className="flex gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{item.subtitle}: </span>
                        <span className="text-neutral-600 dark:text-neutral-400">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact for privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8 mt-8 text-center"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Gizlilik ile ilgili sorularınız mı var?</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              KVKK kapsamındaki haklarınızı kullanmak veya sorularınız için bize ulaşın.
            </p>
            <a
              href="mailto:privacy@itemsepetim.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-float-lg transition-all"
            >
              <Mail className="w-4 h-4" />
              privacy@itemsepetim.com
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
