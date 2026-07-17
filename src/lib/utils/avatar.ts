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

    // 2. Resmi sıkıştır ve WebP'ye çevir
    const compressedBlob = await compressImage(file, 400, 200);
    
    // 3. Dosya yolu: avatars/{user_id}/avatar.webp
    const fileName = `avatar.webp`;
    const filePath = `${userId}/${fileName}`;

    // 4. Eski avatarı sil (varsa) - upsert yerine önce sil
    if (currentAvatarUrl) {
      const oldPath = extractPathFromUrl(currentAvatarUrl);
      if (oldPath) {
        const { error: removeError } = await supabase.storage
          .from('avatars')
          .remove([oldPath]);
        
        if (removeError) {
          console.error('Eski avatar silinirken hata:', removeError);
        }
      }
    }

    // 5. Yeni avatarı yükle (upsert: false, çünkü zaten sildik)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, compressedBlob, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Avatar upload hatası:', uploadError);
      showToast('Avatar yüklenirken bir hata oluştu: ' + uploadError.message, 'error');
      return null;
    }

    // 6. Public URL al
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Cache busting: URL'e timestamp ekle
    const timestamp = new Date().getTime();
    const urlWithCacheBust = `${publicUrl}?t=${timestamp}`;

    return urlWithCacheBust;
  } catch (error: any) {
    console.error('Avatar upload beklenmeyen hata:', error);
    showToast('Beklenmeyen bir hata oluştu: ' + error.message, 'error');
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