/**
 * Supabase Edge Function: Shopier Odeme Entegrasyonu
 * 
 * Bu fonksiyon, Shopier API Key ve Secret bilgilerini guvenli bir sekilde
 * backend tarafinda kullanarak odeme linki olusturur.
 * 
 * Client tarafi: POST /functions/v1/shopier-payment
 * 
 * Gereksinimler:
 * - Supabase projesinde SHOPIER_API_KEY ve SHOPIER_API_SECRET environment degiskenleri
 * - Shopier API URL (varsayilan: https://api.shopier.com/api/v1)
 * 
 * Not: Shopier API dokumantasyonu saglandiginda endpoint ve parametreler
 * buraya gore guncellenebilir.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface ShopierBuyer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface ShopierOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CreateOrderRequest {
  orderId: string;
  buyer: ShopierBuyer;
  items: ShopierOrderItem[];
  currency?: string;
  conversationId?: string;
  callbackUrl?: string;
  returnUrl?: string;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('SHOPIER_API_KEY');
    const apiSecret = Deno.env.get('SHOPIER_API_SECRET');
    const apiUrl = Deno.env.get('SHOPIER_API_URL') || 'https://api.shopier.com/api/v1';

    if (!apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Shopier API bilgileri yapilandirilmamis',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body: CreateOrderRequest = await req.json();

    if (!body.orderId || !body.buyer || !body.items || body.items.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Eksik siparis bilgileri',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const payload = {
      api_key: apiKey,
      api_secret: apiSecret,
      order_id: body.orderId,
      buyer: {
        id: body.buyer.id,
        email: body.buyer.email,
        first_name: body.buyer.firstName,
        last_name: body.buyer.lastName,
        phone: body.buyer.phone || '',
      },
      basket: body.items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
      })),
      currency: body.currency || 'TRY',
      conversation_id: body.conversationId || body.orderId,
      callback_url: body.callbackUrl,
      return_url: body.returnUrl,
    };

    // TODO: Gercek Shopier endpoint'i ve HTTP methodu dokumantasyona gore ayarlanacak.
    const response = await fetch(`${apiUrl}/order/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        'X-API-SECRET': apiSecret,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Bilinmeyen hata');
      return new Response(
        JSON.stringify({
          success: false,
          error: `Shopier API hatasi: ${response.status} - ${errorText}`,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

    // TODO: Shopier response formatina gore alan adlari guncellenecek.
    const paymentUrl = data.payment_url || data.paymentUrl || data.url;
    const shopierOrderId = data.order_id || data.orderId || data.id;

    if (!paymentUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Shopier odeme linki donmedi',
          raw: data,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl,
        orderId: body.orderId,
        shopierOrderId,
        conversationId: body.conversationId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Beklenmeyen bir hata olustu',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
