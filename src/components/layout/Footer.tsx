import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { GAME_CATEGORIES } from '@shared/constants';

export default function Footer() {
  const navigate = useNavigate();

  const handleGameClick = (game: string) => {
    navigate(`/?game=${encodeURIComponent(game)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const companyLinks = [
    { label: 'Hakkımızda', path: '/terms' },
    { label: 'Kariyer', path: '/terms' },
    { label: 'Basında Biz', path: '/terms' },
    { label: 'İletişim', path: '/terms' },
    { label: 'Blog', path: '/terms' },
  ];

  const supportLinks = [
    { label: 'Yardım Merkezi', path: '/terms' },
    { label: 'Güvenli Alışveriş', path: '/terms' },
    { label: 'İade Politikası', path: '/terms' },
    { label: 'SSS', path: '/terms' },
    { label: 'Kullanıcı Sözleşmesi', path: '/terms' },
    { label: 'Gizlilik Politikası', path: '/terms' },
  ];

  const accountCategories = [
    'Mobile Legends Hesapları',
    'Valorant Hesapları',
    'PUBG Mobile Hesapları',
    'Wild Rift Hesapları',
    'Standoff 2 Hesapları',
    'Roblox Hesapları',
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
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
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <div className="w-4 h-4 bg-success-500/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                </div>
                <span>SSL Güvenli</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <div className="w-4 h-4 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <span>256-bit Şifreleme</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <div className="w-4 h-4 bg-accent-500/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                </div>
                <span>Doğrulanmış Satıcılar</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span>7/24 Destek</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Şirket</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Categories */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Hesaplar</h4>
            <ul className="space-y-2.5">
              {accountCategories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleGameClick(category.split(' ')[0])}
                    className="text-neutral-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm text-left"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Destek</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © 2026 Item Sepetim. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/terms" className="text-neutral-500 hover:text-primary-400 transition-colors">
              Gizlilik
            </Link>
            <Link to="/terms" className="text-neutral-500 hover:text-primary-400 transition-colors">
              Şartlar
            </Link>
            <Link to="/terms" className="text-neutral-500 hover:text-primary-400 transition-colors">
              Çerezler
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}