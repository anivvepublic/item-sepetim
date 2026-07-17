import { supabase } from '../supabase/client';
import { showToast } from '@/components/ui/Toast';

interface UploadAvatarOptions {
  file: File;
  userId: string;
  currentAvatarUrl?: string | null;
}

export async function uploadAvatar({ file, userId, currentAvatarUrl }: UploadAvatarOptions): Promise<string | null> {
  try {
    // 1. Dosya validasyonu
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Sadece JPG, PNG veya WebP formatları kabul edilir', 'error');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Dosya boyutu 5MB\'dan küçük olmalı', 'error');
      return null;
    }

    // 2. Resmi sıkıştır
    const compressedBlob = await compressImage(file, 400, 200);
    
    // 3. Dosya yolu
    const fileName = `avatar.webp`;
    const filePath = `${userId}/${fileName}`;

    console.log('Avatar yükleme başlıyor:', filePath);

    // 4. Eski avatarı SUPABASE STORAGE'dan sil
    if (currentAvatarUrl) {
      const oldPath = extractPathFromUrl(currentAvatarUrl);
      if (oldPath) {
        console.log('Eski avatar siliniyor:', oldPath);
        const { error: removeError } = await supabase.storage
          .from('avatars')
          .remove([oldPath]);
        
        if (removeError) {
          console.error('Eski avatar silinirken hata:', removeError);
        } else {
          console.log('Eski avatar silindi');
        }
      }
    }

    // 5. Yeni avatarı yükle (upsert: false çünkü sildik)
    console.log('Yeni avatar yükleniyor...');
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, compressedBlob, {
        contentType: 'image/webp',
        cacheControl: '0', // Cache'i kapat
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload hatası:', uploadError);
      showToast('Avatar yüklenirken hata: ' + uploadError.message, 'error');
      return null;
    }

    console.log('Upload başarılı');

    // 6. Public URL al
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrl);

    // 7. Cache busting timestamp
    const timestamp = new Date().getTime();
    const urlWithCacheBust = `${publicUrl}?t=${timestamp}&v=${Math.random()}`;

    // 8. users tablosunu güncelle
    console.log('Users tablosu güncelleniyor...');
    const { error: dbError } = await supabase
      .from('users')
      .update({ 
        avatar_url: urlWithCacheBust,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (dbError) {
      console.error('Database update hatası:', dbError);
      showToast('Veritabanı güncellenemedi: ' + dbError.message, 'error');
      return null;
    }

    console.log('Database güncellendi');

    // 9. Supabase Auth metadata'yı güncelle
    console.log('Auth metadata güncelleniyor...');
    const { error: authError } = await supabase.auth.updateUser({
      data: { 
        avatar_url: urlWithCacheBust,
        updated_at: new Date().toISOString()
      }
    });

    if (authError) {
      console.error('Auth update hatası:', authError);
    } else {
      console.log('Auth metadata güncellendi');
    }

    return urlWithCacheBust;
  } catch (error: any) {
    console.error('Beklenmeyen hata:', error);
    showToast('Beklenmeyen hata: ' + error.message, 'error');
    return null;
  }
}

async function compressImage(file: File, maxSize: number, maxFileSizeKB: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = Math.min(img.width, img.height, maxSize);
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context alınamadı'));
        return;
      }

      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;
      ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Blob oluşturulamadı'));
              return;
            }
            if (blob.size > maxFileSizeKB * 1024 && quality > 0.3) {
              quality -= 0.1;
              tryCompress();
            } else {
              resolve(blob);
            }
          },
          'image/webp',
          quality
        );
      };

      tryCompress();
    };

    img.onerror = () => reject(new Error('Resim yüklenemedi'));
    reader.readAsDataURL(file);
  });
}

function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const avatarIndex = pathParts.indexOf('avatars');
    if (avatarIndex === -1) return null;
    return pathParts.slice(avatarIndex + 1).join('/');
  } catch {
    return null;
  }
}