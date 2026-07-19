/**
 * Shopier Ödeme Servisi
 * 
 * ⚠️ GÜVENLİK UYARISI:
 * Shopier API Key ve Secret bilgileri asla client-side (tarayıcı) kodunda kullanılmamalıdır.
 * Bu servis geçici/alternatif kullanım içindir. Gerçek entegrasyonda:
 * - Supabase Edge Function, Next.js API route veya ayrı bir backend kullanın.
 * - API key/secret bilgilerini sadece backend ortam değişkenlerinde saklayın.
 * - Client'tan sadece ödeme başlatma isteği gönderin, gerçek API çağrısını backend yapın.
 */

export interface ShopierBuyer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ShopierOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateShopierOrderParams {
  buyer: ShopierBuyer;
  items: ShopierOrderItem[];
  orderId: string;
  currency?: 'TRY' | 'USD' | 'EUR';
  conversationId?: string;
  callbackUrl?: string;
  returnUrl?: string;
}

export interface ShopierPaymentResult {
  success: boolean;
  paymentUrl?: string;
  orderId?: string;
  conversationId?: string;
  error?: string;
}

export interface ShopierCallbackPayload {
  orderId: string;
  status: 'success' | 'failure' | 'pending';
  transactionId?: string;
  amount?: number;
  currency?: string;
  signature?: string;
}

class ShopierPaymentService {
  private apiKey: string;
  private apiSecret: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = (import.meta as any).env.VITE_SHOPIER_API_KEY || '';
    this.apiSecret = (import.meta as any).env.VITE_SHOPIER_API_SECRET || '';
    this.apiUrl = (import.meta as any).env.VITE_SHOPIER_API_URL || 'https://api.shopier.com/api/v1';
  }

  private getDefaultCallbackUrls(): { callbackUrl: string; returnUrl: string } {
    const baseUrl = window.location.origin;
    return {
      callbackUrl: (import.meta as any).env.VITE_SHOPIER_CALLBACK_URL || `${baseUrl}/payment/callback`,
      returnUrl: (import.meta as any).env.VITE_SHOPIER_RETURN_URL || `${baseUrl}/payment/result`,
    };
  }

  private isConfigured(): boolean {
    return Boolean(
      this.apiKey &&
        this.apiSecret &&
        !this.apiKey.includes('shopier_api_key') &&
        !this.apiSecret.includes('shopier_api_secret')
    );
  }

  /**
   * Yeni bir Shopier ödeme siparişi oluşturur.
   * Gerçek entegrasyonda bu fonksiyon backend tarafında çalışmalıdır.
   */
  async createOrder(params: CreateShopierOrderParams): Promise<ShopierPaymentResult> {
    try {
      if (!this.isConfigured()) {
        console.warn(
          '[Shopier] API bilgileri yapilandirilmamis. Mock odeme linki donduruluyor. '
          + 'Gercek entegrasyon icin .env dosyasindaki VITE_SHOPIER_API_KEY ve VITE_SHOPIER_API_SECRET degerlerini guncelleyin '
          + 've bu istegi bir backend/Edge Function uzerinden yapin.'
        );

        return {
          success: true,
          paymentUrl: `${window.location.origin}/payment/result?orderId=${params.orderId}&status=mock`,
          orderId: params.orderId,
          conversationId: params.conversationId,
        };
      }

      const { callbackUrl, returnUrl } = this.getDefaultCallbackUrls();

      const payload = {
        api_key: this.apiKey,
        api_secret: this.apiSecret,
        order_id: params.orderId,
        buyer: {
          id: params.buyer.id,
          email: params.buyer.email,
          first_name: params.buyer.firstName,
          last_name: params.buyer.lastName,
          phone: params.buyer.phone || '',
        },
        basket: params.items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
        })),
        currency: params.currency || 'TRY',
        conversation_id: params.conversationId || params.orderId,
        callback_url: params.callbackUrl || callbackUrl,
        return_url: params.returnUrl || returnUrl,
      };

      const response = await fetch(`${this.apiUrl}/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
          'X-API-SECRET': this.apiSecret,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Bilinmeyen hata');
        throw new Error(`Shopier API hatasi: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.payment_url && !data.paymentUrl) {
        throw new Error('Shopier odeme linki donmedi');
      }

      return {
        success: true,
        paymentUrl: data.payment_url || data.paymentUrl,
        orderId: params.orderId,
        conversationId: params.conversationId,
      };
    } catch (error: any) {
      console.error('[Shopier] Odeme olusturma hatasi:', error);
      return {
        success: false,
        orderId: params.orderId,
        error: error.message || 'Odeme olusturulurken bir hata olustu',
      };
    }
  }

  /**
   * Shopier'den gelen callback/return verisini dogrular.
   * Gerçek entegrasyonda imza (signature) dogrulamasi backend'de yapilmalidir.
   */
  verifyCallback(payload: ShopierCallbackPayload): boolean {
    if (!payload.orderId || !payload.status) {
      return false;
    }

    if (!this.isConfigured()) {
      console.warn('[Shopier] Mock mod: callback dogrulama atlandi.');
      return payload.status === 'success';
    }

    // TODO: Gercek Shopier signature dogrulamasi backend uzerinde eklenecek.
    // Bu client-side versiyonda sadece status kontrolu yapilir.
    return payload.status === 'success';
  }
}

export const shopierPaymentService = new ShopierPaymentService();

export default ShopierPaymentService;
