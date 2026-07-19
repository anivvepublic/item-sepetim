import { create } from 'zustand';
import { supabase } from '../supabase/client';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  is_read: boolean;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
}

interface Conversation {
  id: string;
  participants: string[];
  listing_id: string | null;
  last_message: string | null;
  last_message_at: string;
  created_at: string;
  listing?: {
    title: string;
    images: string[];
  };
  other_user?: {
    id: string;
    username: string;
    avatar_url: string;
    is_online: boolean;
  };
  unread_count: number;
}

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  fetchConversations: () => Promise<void>;
  openConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, type?: 'text' | 'image' | 'file') => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  subscribeToMessages: (conversationId: string) => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  isTyping: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title, images),
          messages:messages(id, content, created_at, sender_id)
        `)
        .contains('participants', [user.id])
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const conversationsWithDetails = await Promise.all(
        (conversations || []).map(async (conv: any) => {
          const otherUserId = conv.participants.find((p: string) => p !== user.id);
          
          const { data: otherUser } = await supabase
            .from('users')
            .select('id, username, avatar_url')
            .eq('id', otherUserId)
            .single();

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('sender_id', otherUserId)
            .eq('is_read', false);

          return {
            ...conv,
            other_user: otherUser || null,
            unread_count: unreadCount || 0,
          };
        })
      );

      set({ conversations: conversationsWithDetails });
    } catch (err: any) {
      console.error('[ChatStore] Fetch conversations error:', err.message || err);
    } finally {
      set({ isLoading: false });
    }
  },

  openConversation: async (conversationId: string) => {
    console.log('[ChatStore] 🔓 Conversation açılıyor:', conversationId);
    set({ isLoading: true });
    try {
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title, images)
        `)
        .eq('id', conversationId)
        .single();

      if (convError) {
        console.error('[ChatStore] ❌ Conversation çekme hatası:', convError.message || convError);
        throw convError;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const otherUserId = conversation.participants.find((p: string) => p !== user?.id);
      
      const { data: otherUser, error: userError } = await supabase
        .from('users')
        .select('id, username, avatar_url')
        .eq('id', otherUserId)
        .single();

      if (userError) {
        console.error('[ChatStore] ⚠️ Diğer kullanıcı çekme hatası:', userError.message || userError);
      }

      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select(`*`)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) {
        console.error('[ChatStore] ❌ Mesajları çekme hatası:', msgError.message || msgError);
        throw msgError;
      }

      console.log('[ChatStore] ✅ Conversation başarıyla açıldı, mesaj sayısı:', messages?.length || 0);

      set({
        activeConversation: { ...conversation, other_user: otherUser },
        messages: messages || [],
      });

      const unreadMessages = messages?.filter(m => m.sender_id !== user?.id && !m.is_read) || [];
      for (const msg of unreadMessages) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('id', msg.id);
      }

      set(state => ({
        conversations: state.conversations.map(c => 
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        )
      }));
    } catch (err: any) {
      console.error('[ChatStore] ❌ Open conversation genel hata:', err.message || err);
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    const { activeConversation } = get();
    if (!activeConversation) {
      console.error('[ChatStore] ❌ Aktif conversation yok');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('[ChatStore] ❌ Kullanıcı giriş yapmamış');
        return;
      }

      console.log('[ChatStore] 📤 Mesaj gönderiliyor:', { 
        conversationId: activeConversation.id, 
        sender_id: user.id, 
        content 
      });

      const { data: message, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: activeConversation.id,
          sender_id: user.id,
          content,
          type,
        }])
        .select()
        .single();

      if (error) {
        console.error('[ChatStore] ❌ Mesaj gönderme hatası:', error.message || error);
        alert('Mesaj gönderilemedi: ' + error.message);
        throw error;
      }

      console.log('[ChatStore] ✅ Mesaj başarıyla veritabanına kaydedildi:', message.id);

      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message: content.slice(0, 100),
          last_message_at: new Date().toISOString(),
        })
        .eq('id', activeConversation.id);

      if (updateError) {
        console.error('[ChatStore] ⚠️ Conversation güncelleme hatası:', updateError.message || updateError);
      }

      // ✅ MESAJI STATE'E EKLEME - SADECE REALTIME'DAN GELECEK
      // Bu şekilde mesaj iki kez görünmez
    } catch (err: any) {
      console.error('[ChatStore] ❌ Genel hata:', err.message || err);
    }
  },

  markAsRead: async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  },

  startTyping: (conversationId: string) => {
    console.log('Typing in:', conversationId);
  },

  stopTyping: (conversationId: string) => {
    console.log('Stopped typing in:', conversationId);
  },

  subscribeToMessages: (conversationId: string) => {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, 
        (payload) => {
          console.log('[ChatStore] 📥 Yeni mesaj geldi (Realtime):', payload.new);
          const newMessage = payload.new as Message;
          
          // ✅ DUPLICATE KONTROLÜ
          set(state => {
            if (state.messages.some(m => m.id === newMessage.id)) {
              console.log('[ChatStore] ⚠️ Duplicate mesaj, atlanıyor');
              return state;
            }
            return {
              messages: [...state.messages, newMessage],
              conversations: state.conversations.map(c => 
                c.id === conversationId 
                  ? { ...c, last_message: newMessage.content, last_message_at: newMessage.created_at }
                  : c
              )
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  unsubscribeFromMessages: () => {
    supabase.removeAllChannels();
  },
}));