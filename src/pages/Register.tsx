import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShoppingCart, ArrowRight, Shield, Zap, Clock, Gamepad2, User } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { showToast } from '@/components/ui/Toast';
import SEO from '@/components/seo/SEO';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score, text: 'Zayıf', color: 'bg-red-500' };
    if (score <= 3) return { score, text: 'Orta', color: 'bg-yellow-500' };
    if (score <= 4) return { score, text: 'İyi', color: 'bg-blue-500' };
    return { score, text: 'Güçlü', color: 'bg-green-500' };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('Kullanıcı sözleşmesini kabul etmeniz gerekmektedir');
      return;
    }

    if (username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalı');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, username);
      showToast('Hesabınız başarıyla oluşturuldu!', 'success');
      navigate('/');
    } catch (err: any) {
      console.error('Register error:', err);
      const errorMessage = err.message || 'Kayıt olurken bir hata oluştu';
      setError(errorMessage);
      
      if (errorMessage.includes('kullanıcı adı')) {
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Shield, text: 'Güvenli ve şifrelenmiş işlemler' },
    { icon: Zap, text: 'Anında teslimat garantisi' },
    { icon: Clock, text: '7/24 müşteri desteği' },
    { icon: Gamepad2, text: 'Geniş oyun seçeneği' }
  ];

  return (
    <>
      <SEO
        title="Kayıt Ol - Item Sepetim"
        description="Item Sepetim'e ücretsiz kayıt ol. Binlerce oyun hesabı ve item arasından seçim yap."
        url="/register"
        noindex={true}
      />

      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 flex flex-col justify-center p-8 lg:p-12 w-full min-h-[50vh] lg:min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-[1.5rem] flex items-center justify-center shadow-float-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">Item Sepetim</span>
                  <span className="text-sm text-primary-200">Premium Oyun Pazarı</span>
                </div>
              </Link>
            </motion.div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Neden Item
                  <span className="block bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                    Sepetim?
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-primary-200">
                  Binlerce oyuncunun güvendiği platformda yerini al
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-[1.5rem] p-4 border border-white/10"
                  >
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-accent-400" />
                    </div>
                    <span className="text-base lg:text-lg text-white font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8 mt-8 border-t border-white/20"
            >
              <p className="text-primary-200 text-sm">
                Kayıt olarak <Link to="/terms" className="text-white font-semibold hover:text-accent-400 transition-colors">Kullanım Şartları</Link> ve <Link to="/terms" className="text-white font-semibold hover:text-accent-400 transition-colors">Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50 px-4 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-[1.5rem] flex items-center justify-center shadow-float">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                    Item Sepetim
                  </span>
                  <span className="text-xs text-neutral-500 -mt-1">Premium Oyun Pazarı</span>
                </div>
              </Link>
            </div>

            <div className="card p-6 lg:p-8 shadow-float-lg rounded-[2rem]">
              <div className="text-center mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">Hesap Oluştur</h1>
                <p className="text-sm lg:text-base text-neutral-600">Birkaç adımda aramıza katıl</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                >
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                <div>
                  <label className="label">Kullanıcı Adı</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="kullaniciadi123"
                      required
                      className="input pl-12 rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Sadece harf, rakam ve alt çizgi kullanabilirsiniz</p>
                </div>

                <div>
                  <label className="label">E-posta</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      required
                      className="input pl-12 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Şifre</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="input pl-12 pr-12 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-600">Şifre Gücü:</span>
                        <span className={`text-xs font-semibold ${
                          passwordStrength.text === 'Zayıf' ? 'text-red-600' :
                          passwordStrength.text === 'Orta' ? 'text-yellow-600' :
                          passwordStrength.text === 'İyi' ? 'text-blue-600' :
                          'text-green-600'
                        }`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              i <= passwordStrength.score ? passwordStrength.color : 'bg-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">Şifre Tekrar</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="input pl-12 pr-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary-600 border-2 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-neutral-600 cursor-pointer leading-relaxed">
                    <Link to="/terms" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                      Kullanıcı Sözleşmesi
                    </Link>
                    'ni okudum ve kabul ediyorum.
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !acceptTerms}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group rounded-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Kayıt olunuyor...
                    </span>
                  ) : (
                    <>
                      Kayıt Ol
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm lg:text-base text-neutral-600">
                  Zaten hesabın var mı?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Giriş Yap
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}