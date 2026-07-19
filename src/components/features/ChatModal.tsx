import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Check, CheckCheck } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { useAuthStore } from '@/lib/store/authStore';
import { supabase } from '@/lib/supabase/client';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  sellerId: string;
  listingTitle: string;
}

export default function ChatModal({ isOpen, onClose, listingId, sellerId, listingTitle }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { 
    messages, 
    isLoading, 
    openConversation, 
    sendMessage, 
    subscribeToMessages, 
    unsubscribeFromMessages 
  } = useChatStore();
  
  const { user } = useAuthStore();

  // ✅ SADECE BİR KEZ ÇALIŞACAK
  useEffect(() => {
    if (isOpen && listingId && sellerId && !isInitialized) {
      console.log('[ChatModal] 🚀 İlk yükleme, conversation oluşturuluyor');
      findOrCreateConversation();
      setIsInitialized(true);
    }
  }, [isOpen, listingId, sellerId, isInitialized]);

  useEffect(() => {
    if (conversationId && !messages.length) {
      console.log('[ChatModal] 📂 Conversation açılıyor:', conversationId);
      openConversation(conversationId);
      const unsubscribe = subscribeToMessages(conversationId);
      return () => {
        console.log('[ChatModal] 🔌 Subscription kapatılıyor');
        unsubscribe();
      };
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Modal kapandığında state'i sıfırla
  useEffect(() => {
    if (!isOpen) {
      setConversationId(null);
      setIsInitialized(false);
      setMessage('');
    }
  }, [isOpen]);

  const findOrCreateConversation = async () => {
    if (!user) {
      console.error('[ChatModal] ❌ Kullanıcı giriş yapmamış');
      return;
    }

    if (!sellerId) {
      console.error('[ChatModal] ❌ Satıcı ID yok');
      alert('Bu ilan için satıcı bilgisi bulunamadı.');
      onClose();
      return;
    }

    console.log('[ChatModal] 🔍 Conversation aranıyor:', { userId: user.id, sellerId, listingId });

    try {
      const { data: existingConv, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .contains('participants', [user.id, sellerId])
        .eq('listing_id', listingId)
        .maybeSingle();

      if (searchError) {
        console.error('[ChatModal] ❌ Conversation arama hatası:', searchError.message || searchError);
        throw searchError;
      }

      if (existingConv) {
        console.log('[ChatModal] ✅ Mevcut conversation bulundu:', existingConv.id);
        setConversationId(existingConv.id);
      } else {
        console.log('[ChatModal] 🆕 Yeni conversation oluşturuluyor');
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert([{
            participants: [user.id, sellerId],
            listing_id: listingId,
          }])
          .select()
          .single();

        if (createError) {
          console.error('[ChatModal] ❌ Conversation oluşturma hatası:', createError.message || createError);
          throw createError;
        }

        console.log('[ChatModal] ✅ Yeni conversation oluşturuldu:', newConv.id);
        setConversationId(newConv.id);
      }
    } catch (err: any) {
      console.error('[ChatModal] ❌ Genel hata:', err.message || err);
      alert('Sohbet başlatılamadı: ' + (err.message || 'Bilinmeyen hata'));
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    console.log('[ChatModal] 📤 Mesaj gönderiliyor:', message);
    await sendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Bugün';
    if (date.toDateString() === yesterday.toDateString()) return 'Dün';
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                {listingTitle[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{listingTitle}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Satıcı ile sohbet</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Send className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Henüz mesaj yok. İlk mesajı sen gönder!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender_id === user?.id || msg.sender?.username === 'Sen';
                const showDate = index === 0 || new Date(msg.created_at).toDateString() !== new Date(messages[index - 1].created_at).toDateString();

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex items-center justify-center my-4">
                        <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs rounded-full">
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl ${
                          isMe
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-sm'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-neutral-400">{formatTime(msg.created_at)}</span>
                          {isMe && (msg.is_read ? <CheckCheck className="w-3 h-3 text-primary-500" /> : <Check className="w-3 h-3 text-neutral-400" />)}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  rows={1}
                  className="w-full px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 resize-none max-h-32"
                  style={{ minHeight: '44px' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="p-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}