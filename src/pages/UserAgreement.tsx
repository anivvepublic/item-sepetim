import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, CreditCard, Lock, AlertCircle } from 'lucide-react';

export default function UserAgreement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Dön
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card p-8 lg:p-12 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-float">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">Kullanıcı Sözleşmesi</h1>
              <p className="text-neutral-600 mt-1">Son güncelleme: 15 Temmuz 2026</p>
            </div>
          </div>
          <p className="text-neutral-700 leading-relaxed">
            İşbu Kullanıcı Sözleşmesi, Item Sepetim platformunu kullanan tüm kullanıcıları bağlayıcı niteliktedir. 
            Lütfen bu sözleşmeyi dikkatlice okuyunuz.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Sözleşmenin Konusu ve Kabul</h2>
                <p className="text-neutral-700 leading-relaxed">
                  İşbu Kullanıcı Sözleşmesi ("Sözleşme"), Item Sepetim platformunu ("Platform") kullanan tüm gerçek ve tüzel kişileri ("Kullanıcı") bağlayıcı niteliktedir. Platformu kullanarak, işbu Sözleşme'nin tüm hüküm ve koşullarını okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz. Bu sözleşme, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve ilgili mevzuat hükümlerine uygun olarak hazırlanmıştır.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Platformun Tanımı ve Amacı</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Item Sepetim, dijital oyun hesapları, oyun içi itemler, sanal para birimleri ve diğer dijital varlıkların alım-satımının yapılabileceği bir elektronik pazar yeridir. Platform, kullanıcılar arasında güvenli bir alışveriş ortamı sağlamayı hedefler. Platform üzerinden yapılan tüm işlemler, Türk Ticaret Kanunu ve ilgili diğer kanunlar çerçevesinde gerçekleştirilir.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">3. Kullanıcı Yükümlülükleri</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  Kullanıcı, Platformu kullanırken aşağıdaki yükümlülüklere uymayı kabul eder:
                </p>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>18 yaşından küçük olmamak ve yasal ehliyete sahip olmak</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Doğru, güncel ve eksiksiz bilgi vermek</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Hesap bilgilerini gizli tutmak ve üçüncü şahıslarla paylaşmamak</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Yasadışı, yanıltıcı veya aldatıcı faaliyetlerde bulunmamak</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Başka kullanıcıların haklarını ihlal etmemek</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Platformun güvenliğini tehlikeye atacak davranışlardan kaçınmak</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Section 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">4. Kişisel Verilerin Korunması (KVKK)</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Platform, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") hükümlerine uygun olarak hareket etmektedir. Kullanıcı'nın kişisel verileri, açık rızası alınarak işlenmekte ve 3. kişilerle paylaşılmamaktadır. Verileriniz, platformun güvenliği ve hizmet kalitesini artırmak amacıyla kullanılmaktadır. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">5. İşlem Güvenliği ve Sorumluluk</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Platform, alıcı ve satıcı arasında güvenli bir alışveriş ortamı sağlamayı taahhüt eder. Ancak, Kullanıcı'ların yaptığı işlemlerde ortaya çıkabilecek anlaşmazlıklardan Platform sorumlu tutulamaz. Kullanıcı, alım-satım işlemlerinden önce satıcının güvenilirliğini araştırmakla yükümlüdür. Platform, sadece aracı konumundadır ve işlemlerin güvenliğini sağlamak için gerekli teknik önlemleri alır.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 6 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">6. İade ve İptal Koşulları</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Dijital ürünlerin doğası gereği, teslimatı gerçekleşen hesap veya itemler için iade yapılamaz. Ancak, teslimatın gerçekleşmemesi veya ürünün tanıtılan özelliklere sahip olmaması durumunda, Platform aracılığıyla iade talebi oluşturulabilir. İade talepleri, Platform'un belirlediği süre ve koşullar çerçevesinde değerlendirilir. İade süreci, 6502 sayılı Tüketicinin Korunması Hakkında Kanun hükümlerine uygun olarak yürütülür.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 7 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">7</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Fikri Mülkiyet Hakları</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Platform'da yer alan tüm içerik, tasarım, logo, marka ve diğer fikri mülkiyet hakları Item Sepetim'e aittir. Kullanıcı'lar, bu içerikleri izinsiz kopyalayamaz, çoğaltamaz veya ticari amaçla kullanamaz. 5846 sayılı Fikir ve Sanat Eserleri Kanunu hükümleri saklıdır.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 8 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">8. Hesap Askıya Alma ve Sonlandırma</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Platform, işbu Sözleşme hükümlerine aykırı davranan Kullanıcı'ların hesaplarını önceden bildirimde bulunmaksızın askıya alma veya sonlandırma hakkını saklı tutar. Hesap sonlandırılması durumunda, Kullanıcı'nın bakiyesindeki tutarlar iade edilir. Kullanıcı, hesap sonlandırılması durumunda Platform'a başvurarak itiraz hakkına sahiptir.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 9 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">9</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Mücbir Sebep</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Doğal afet, savaş, terör, salgın hastalık, internet kesintisi, siber saldırı gibi Platform'un kontrolü dışında gelişen olaylar nedeniyle hizmetlerin geçici olarak kesintiye uğraması durumunda, Platform sorumlu tutulamaz. Bu tür durumlarda Platform, hizmeti en kısa sürede yeniden başlatmak için gerekli önlemleri alacaktır.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 10 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">10</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Uyuşmazlıkların Çözümü</h2>
                <p className="text-neutral-700 leading-relaxed">
                  İşbu Sözleşme'den doğacak uyuşmazlıklarda Türk Mahkemeleri ve İcra Daireleri yetkilidir. Sözleşme'nin yorumlanmasında Türk Hukuku uygulanır. Uyuşmazlık durumunda, taraflar öncelikle arabuluculuk yoluna başvuracaktır.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 11 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">11</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Değişiklik ve Güncellemeler</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Platform, işbu Sözleşme'yi herhangi bir zamanda tek taraflı olarak değiştirme hakkını saklı tutar. Değişiklikler, Platform'da yayımlandığı tarihte yürürlüğe girer. Kullanıcı'lar, güncel Sözleşme'yi periyodik olarak incelemekle yükümlüdür. Önemli değişiklikler durumunda Kullanıcı'ya e-posta ile bildirim yapılacaktır.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 12 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="card p-6 lg:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">12</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">İletişim</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Sözleşme ile ilgili soru ve görüşleriniz için <a href="mailto:info@itemsepetim.com" className="text-primary-600 hover:text-primary-700 font-semibold">info@itemsepetim.com</a> adresine e-posta gönderebilirsiniz. Platform, tüm kullanıcı geri bildirimlerini dikkate almakta ve hizmet kalitesini sürekli iyileştirmek için çalışmaktadır.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="card p-6 lg:p-8 mt-8 text-center"
        >
          <p className="text-neutral-600">
            Bu sözleşmeyi okuyarak, tüm şartları kabul etmiş olursunuz.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-float-lg transition-all"
          >
            Geri Dön
          </button>
        </motion.div>
      </div>
    </div>
  );
}