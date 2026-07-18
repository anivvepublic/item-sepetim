# Walkthrough — Statik Sayfalar & Footer Güncellemesi

## Özet

Footer'daki tüm linkler `/terms`'e yönlendiriliyordu. Bu sprint'te her bağlantı için gerçek, içerik dolu sayfalar oluşturuldu ve routing ile constants yapısı güncellendi.

---

## Oluşturulan Yeni Sayfalar

### 1. `/about` — Hakkımızda ([About.tsx](file:///c:/Users/emreg/Desktop/item-sepetim/src/pages/About.tsx))
- Gradient hero banner
- 4 istatistik kartı (15.000+ kullanıcı, 50.000+ işlem, 4.9/5 puan, 2+ yıl)
- Misyon & vizyon bölümü (güvenlik maddeleri listesi)
- 4 değer kartı (Güven, Hız, Topluluk, Kullanıcı Odaklılık)
- Zaman çizelgesi (2024–2026)
- CTA bölümü (Kayıt Ol + İlanlara Göz At)

### 2. `/privacy` — Gizlilik Politikası ([Privacy.tsx](file:///c:/Users/emreg/Desktop/item-sepetim/src/pages/Privacy.tsx))
- 6698 sayılı KVKK uyumlu içerik
- 7 bölüm: Toplanan Veriler, Kullanım Amacı, Paylaşım, Güvenlik, KVKK Hakları, Çerezler, Saklama Süresi
- Her bölümde Lucide ikon + alt başlıklı liste yapısı
- Sayfa altında gizlilik iletişim e-postası

### 3. `/faq` — Sıkça Sorulan Sorular ([FAQ.tsx](file:///c:/Users/emreg/Desktop/item-sepetim/src/pages/FAQ.tsx))
- Sol sütun kategori navigasyonu (sidebar)
- 5 kategori: Alım & Satım, Güvenlik, Ödeme & İade, Hesap & Profil, Sorunlar & Şikayetler
- 17 soru-cevap, Framer Motion accordion animasyonu
- Kategori değişiminde smooth geçiş animasyonu
- Alt kısımda destek CTA butonu

### 4. `/contact` — İletişim ([Contact.tsx](file:///c:/Users/emreg/Desktop/item-sepetim/src/pages/Contact.tsx))
- 4 iletişim kanalı kartı (E-posta, Canlı Sohbet, Güvenlik, Gizlilik)
- Yanıt süresi rozetleri (Anlık / ~2 saat / ~30 dk)
- Tam işlevli iletişim formu (isim, e-posta, konu dropdown, mesaj)
- Form doğrulama + başarı/hata durumları
- Sağ sidebar: Çalışma saatleri ve yanıt süresi garantisi tablosu

---

## Güncellenen Dosyalar

### [Footer.tsx](file:///c:/Users/emreg/Desktop/item-sepetim/src/components/layout/Footer.tsx)
| Link | Eski | Yeni |
|------|------|------|
| Hakkımızda | `/terms` | `/about` |
| Kariyer | `/terms` | `/about` |
| Basında Biz | `/terms` | `/about` |
| İletişim | `/terms` | `/contact` |
| Blog | `/terms` | `/about` |
| Yardım Merkezi | `/terms` | `/faq` |
| Güvenli Alışveriş | `/terms` | `/faq` |
| SSS | `/terms` | `/faq` |
| Gizlilik Politikası | `/terms` | `/privacy` |
| Alt Gizlilik linki | `/terms` | `/privacy` |
| Alt Çerezler linki | `/terms` | `/faq` |

### [App.tsx](file:///c:/Users/emreg/Desktop/item-sepetim/src/App.tsx)
- 4 yeni lazy import eklendi: `About`, `Privacy`, `FAQ`, `Contact`
- 4 yeni Route tanımı: `/about`, `/privacy`, `/faq`, `/contact`

### [UserAgreement.tsx](file:///c:/Users/emreg/Desktop/item-sepetim/src/pages/UserAgreement.tsx)
- Hard-coded `/register` geri butonu → `navigate(-1)` ile dinamik hale getirildi
- Footer'dan gelen kullanıcılar artık geldikleri sayfaya döner

### [constants.ts](file:///c:/Users/emreg/Desktop/item-sepetim/src/lib/shared/constants.ts)
- `ROUTES` sabitine `ABOUT`, `PRIVACY`, `FAQ`, `CONTACT`, `TERMS` eklendi

---

## Test Edilmesi Gerekenler

- [ ] Footer'daki tüm linkler doğru sayfaya gidiyor
- [ ] `/about` sayfası animasyonları çalışıyor
- [ ] `/faq` accordion açılıp kapanıyor, kategori değişimi smooth
- [ ] `/contact` form submit → başarı mesajı görünüyor
- [ ] `/privacy` sayfası tam görüntüleniyor
- [ ] `/terms` sayfasında "Geri Dön" butonu önceki sayfaya dönüyor
