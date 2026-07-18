import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';

export default function Footer() {
  const companyLinks = [
    { label: 'Hakkımızda', path: '/about' },
    { label: 'Kariyer', path: '/about' },
    { label: 'Basında Biz', path: '/about' },
    { label: 'İletişim', path: '/contact' },
    { label: 'Blog', path: '/about' },
  ];

  const supportLinks = [
    { label: 'Yardım Merkezi', path: '/faq' },
    { label: 'Güvenli Alışveriş', path: '/faq' },
    { label: 'İade Politikası', path: '/terms' },
    { label: 'SSS', path: '/faq' },
    { label: 'Kullanıcı Sözleşmesi', path: '/terms' },
    { label: 'Gizlilik Politikası', path: '/privacy' },
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-float">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Item Sepetim</h3>
                <p className="text-sm text-neutral-400">Premium Oyun Pazarı</p>
              </div>
            </Link>
            <p className="text-neutral-400 leading-relaxed text-sm max-w-md">
              Türkiye'nin en güvenilir oyun hesapları ve item pazar yeri. 2024'ten beri binlerce oyuncuya güvenli alışveriş deneyimi sunuyoruz.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-neutral-400"><div className="w-4 h-4 bg-success-500/20 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-success-500 rounded-full"></div></div><span>SSL Güvenli</span></div>
              <div className="flex items-center gap-2 text-xs text-neutral-400"><div className="w-4 h-4 bg-primary-500/20 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-primary-500 rounded-full"></div></div><span>256-bit Şifreleme</span></div>
              <div className="flex items-center gap-2 text-xs text-neutral-400"><div className="w-4 h-4 bg-accent-500/20 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-accent-500 rounded-full"></div></div><span>Doğrulanmış Satıcılar</span></div>
              <div className="flex items-center gap-2 text-xs text-neutral-400"><div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-blue-500 rounded-full"></div></div><span>7/24 Destek</span></div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Şirket</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}><Link to={link.path} className="text-neutral-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm"><ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Hesaplar</h4>
            <ul className="space-y-2.5">
              {['Mobile Legends', 'Valorant', 'PUBG Mobile', 'Wild Rift', 'Standoff 2', 'Roblox'].map((cat) => (
                <li key={cat}><Link to={`/listings?game=${encodeURIComponent(cat)}`} className="text-neutral-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm"><ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />{cat} Hesapları</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Destek</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}><Link to={link.path} className="text-neutral-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm"><ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">© 2026 Item Sepetim. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-neutral-500 hover:text-primary-400 transition-colors">Gizlilik</Link>
            <Link to="/terms" className="text-neutral-500 hover:text-primary-400 transition-colors">Şartlar</Link>
            <Link to="/faq" className="text-neutral-500 hover:text-primary-400 transition-colors">Çerezler</Link>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-800/50 flex justify-center">
          <span className="text-neutral-600 text-xs font-mono tracking-widest">v0.0.3</span>
        </div>
      </div>
    </footer>
  );
}