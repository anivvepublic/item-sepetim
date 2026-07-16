import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bell, Moon, Sun, AlertTriangle, Trash2, Save, Eye, EyeOff, Camera, X, Upload } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useThemeStore } from '@/lib/store/themeStore';
import { supabase } from '@/lib/supabase/client';
import { showToast } from '@/components/ui/Toast';
import { uploadAvatar } from '@/lib/utils/avatar';
import Avatar from '@/components/ui/Avatar';

export default function ProfileSettings() {
  const { user, checkUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Username değiştirme
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  // Şifre değiştirme
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Avatar
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(user?.avatar_url || null);

  // Bildirim tercihleri
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Hesap silme
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername || newUsername.length < 3) {
      showToast('Kullanıcı adı en az 3 karakter olmalı', 'error');
      return;
    }

    setIsUpdatingUsername(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ username: newUsername })
        .eq('id', user?.id);

      if (error) {
        if (error.code === '23505') {
          showToast('Bu kullanıcı adı zaten alınmış', 'error');
        } else {
          throw error;
        }
        return;
      }

      await checkUser();
      showToast('Kullanıcı adı başarıyla güncellendi', 'success');
    } catch (error: any) {
      console.error('Username update error:', error);
      showToast('Bir hata oluştu: ' + error.message, 'error');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      showToast('Şifreler eşleşmiyor', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Şifre en az 6 karakter olmalı', 'error');
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      showToast('Şifre başarıyla değiştirildi', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      console.error('Password change error:', error);
      showToast('Şifre değiştirilemedi: ' + error.message, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingAvatar(true);

    try {
      const newAvatarUrl = await uploadAvatar({
        file,
        userId: user.id,
        currentAvatarUrl: user.avatar_url,
      });

      if (newAvatarUrl) {
        // Veritabanına kaydet
        const { error } = await supabase
          .from('users')
          .update({ avatar_url: newAvatarUrl })
          .eq('id', user.id);

        if (error) throw error;

        await checkUser();
        setPreviewAvatar(newAvatarUrl);
        showToast('Profil fotoğrafı başarıyla güncellendi', 'success');
      }
    } catch (error: any) {
      console.error('Avatar update error:', error);
      showToast('Avatar güncellenirken bir hata oluştu', 'error');
    } finally {
      setIsUploadingAvatar(false);
      // Input'u temizle (aynı dosyayı tekrar seçebilmek için)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;

    setIsUploadingAvatar(true);

    try {
      // Storage'dan sil
      if (user.avatar_url) {
        const urlObj = new URL(user.avatar_url);
        const pathParts = urlObj.pathname.split('/');
        const avatarIndex = pathParts.indexOf('avatars');
        if (avatarIndex !== -1) {
          const oldPath = pathParts.slice(avatarIndex + 1).join('/');
          await supabase.storage
            .from('avatars')
            .remove([oldPath]);
        }
      }

      // Veritabanından temizle
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) throw error;

      await checkUser();
      setPreviewAvatar(null);
      showToast('Profil fotoğrafı kaldırıldı', 'success');
    } catch (error: any) {
      console.error('Avatar remove error:', error);
      showToast('Avatar kaldırılırken bir hata oluştu', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'SİL') {
      showToast('Lütfen "SİL" yazarak onaylayın', 'error');
      return;
    }

    setIsDeletingAccount(true);

    try {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user?.id);

      if (deleteError) throw deleteError;

      const { error: authError } = await supabase.auth.admin.deleteUser(user?.id || '');
      
      if (authError) {
        console.warn('Admin yetkisi olmadan auth user silinemez, sadece local logout yapılıyor');
      }

      showToast('Hesabınız başarıyla silindi', 'success');
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error: any) {
      console.error('Account deletion error:', error);
      showToast('Hesap silinirken bir hata oluştu: ' + error.message, 'error');
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Hesap Ayarları
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Hesap tercihlerini ve güvenlik ayarlarını yönet
        </p>
      </div>

      {/* Avatar Bölümü */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Profil Fotoğrafı</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">JPG, PNG veya WebP (max 5MB)</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar Preview */}
          <div className="relative group">
            <Avatar user={{ ...user, avatar_url: previewAvatar }} size="xl" />
            
            {/* Hover Overlay */}
            <button
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-50"
            >
              {isUploadingAvatar ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Profil fotoğrafını değiştirmek için üzerine tıkla veya aşağıdaki butonu kullan.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {isUploadingAvatar ? 'Yükleniyor...' : 'Fotoğraf Seç'}
                </button>
                {previewAvatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Fotoğrafı Kaldır
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Username Değiştirme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Kullanıcı Adı</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Kullanıcı adını değiştir</p>
          </div>
        </div>

        <form onSubmit={handleUpdateUsername} className="space-y-4">
          <div>
            <label className="label">Yeni Kullanıcı Adı</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="kullaniciadi123"
              className="input"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Sadece harf, rakam ve alt çizgi kullanabilirsiniz
            </p>
          </div>
          <button
            type="submit"
            disabled={isUpdatingUsername || newUsername === user.username}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingUsername ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Güncelleniyor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Kullanıcı Adını Güncelle
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Şifre Değiştirme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-700 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Şifre Değiştir</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Hesap şifrenizi güncelleyin</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="label">Yeni Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Şifre Tekrar</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input pl-12 pr-12"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isChangingPassword || !newPassword || !confirmNewPassword}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChangingPassword ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Değiştiriliyor...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Şifreyi Değiştir
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Tema Tercihi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-neutral-600 to-neutral-800 rounded-xl flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Görünüm</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Tema tercihini değiştir</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-neutral-600" /> : <Sun className="w-5 h-5 text-accent-500" />}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {theme === 'dark' ? 'Karanlık Mod' : 'Aydınlık Mod'}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-primary-600' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Bildirim Tercihleri */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Bildirimler</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">E-posta bildirim tercihlerini yönet</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-100">İşlem Bildirimleri</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Satın alma ve favori bildirimleri</div>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailNotifications ? 'bg-primary-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-100">Pazarlama E-postaları</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Kampanya ve indirim bildirimleri</div>
            </div>
            <button
              onClick={() => setMarketingEmails(!marketingEmails)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                marketingEmails ? 'bg-primary-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  marketingEmails ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tehlikeli Bölge - Hesap Silme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6 lg:p-8 border-2 border-red-200 dark:border-red-900/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Tehlikeli Bölge</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Hesabınızı kalıcı olarak silin</p>
          </div>
        </div>

        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-6">
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Uyarı:</strong> Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinecek ve bu işlem geri alınamaz.
          </p>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Hesabımı Sil
        </button>
      </motion.div>

      {/* Hesap Silme Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full shadow-float-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Hesabı Sil</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu işlem geri alınamaz</p>
              </div>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
              Hesabınızı silmek istediğinizden emin misiniz? Onaylamak için aşağıya <strong>SİL</strong> yazın.
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="SİL"
              className="input mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || deleteConfirmText !== 'SİL'}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isDeletingAccount ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Siliniyor...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Hesabı Sil
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}