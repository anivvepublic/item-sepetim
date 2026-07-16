import { supabase } from '../supabase/client';
import { showToast } from '@/components/ui/Toast';

interface UploadAvatarOptions {
  file: File;
  userId: string;
  currentAvatarUrl?: string | null;
}

/**
 * Avatar yükleme helper'ı
 * - Resmi client-side'da sıkıştırır (max 400x400, 200KB)
 * - WebP formatına çevirir
 * - Supabase Storage'a yükler
 * - Eski avatarı siler
 */
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
    const fileExt = 'webp';
    const fileName = `avatar.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // 4. Eski avatarı sil (varsa)
    if (currentAvatarUrl) {
      const oldPath = extractPathFromUrl(currentAvatarUrl);
      if (oldPath) {
        await supabase.storage
          .from('avatars')
          .remove([oldPath]);
      }
    }

    // 5. Yeni avatarı yükle
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, compressedBlob, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: true, // Aynı dosya varsa üzerine yaz
      });

    if (uploadError) {
      console.error('Avatar upload error:', uploadError);
      showToast('Avatar yüklenirken bir hata oluştu', 'error');
      return null;
    }

    // 6. Public URL al
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Avatar upload error:', error);
    showToast('Beklenmeyen bir hata oluştu', 'error');
    return null;
  }
}

/**
 * Resmi sıkıştırır ve WebP'ye çevirir
 */
async function compressImage(file: File, maxSize: number, maxFileSizeKB: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      // Boyut hesapla (kare yap)
      const size = Math.min(img.width, img.height, maxSize);
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context alınamadı'));
        return;
      }

      // Resmi ortala ve kırp (cover)
      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;
      ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

      // WebP olarak export et, kaliteyi düşürerek dene
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

/**
 * Supabase public URL'den dosya yolunu çıkarır
 */
function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // /storage/v1/object/public/avatars/{user_id}/avatar.webp
    const avatarIndex = pathParts.indexOf('avatars');
    if (avatarIndex === -1) return null;
    return pathParts.slice(avatarIndex + 1).join('/');
  } catch {
    return null;
  }
}

/**
 * Kullanıcı adı veya email'den avatar URL'i oluşturur (placeholder)
 */
export function getAvatarPlaceholder(name: string): string {
  const colors = [
    'from-primary-500 to-primary-700',
    'from-accent-500 to-accent-700',
    'from-success-500 to-success-700',
    'from-blue-500 to-blue-700',
    'from-purple-500 to-purple-700',
    'from-pink-500 to-pink-700',
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}