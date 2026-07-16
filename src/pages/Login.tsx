import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShoppingCart, ArrowRight, Shield, Zap, Clock, Gamepad2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { showToast } from '@/components/ui/Toast';
import SEO from '@/components/seo/SEO';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      showToast('Giriş başarılı! Hoş geldin.', 'success');
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Giriş yapılırken bir hata oluştu';
      setError(errorMessage);
      
      if (errorMessage.includes('Invalid login credentials')) {
        setError('E-posta veya şifre hatalı');
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('E-posta adresiniz henüz doğrulanmamış');
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
        title="Giriş Yap - Item Sepetim"
        description="Item Sepetim hesabına giriş yap. Oyun hesapları ve item alışverişine devam et."
        url="/login"
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
                  Tekrar
                  <span className="block bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                    Hoş Geldin!
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-primary-200">
                  Hesabına giriş yap ve alışverişe devam et
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
                <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">Giriş Yap</h1>
                <p className="text-sm lg:text-base text-neutral-600">Hesabına giriş yaparak devam et</p>
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
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group rounded-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    <>
                      Giriş Yap
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm lg:text-base text-neutral-600">
                  Hesabın yok mu?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Kayıt Ol
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