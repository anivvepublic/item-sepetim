import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/authStore';
import ChatModal from './ChatModal';

interface Conversation {
  id: string;
  last_message: string | null;
  last_message_at: string;
  listing_id: string | null;
  other_user: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
  listing: {
    title: string;
  } | null;
  unread_count: number;
}

interface ActiveChat {
  conversationId: string;
  listingId: string;
  sellerId: string;
  listingTitle: string;
}

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConversations();
      subscribeToMessages();
    } else {
      setConversations([]);
      setTotalUnread(0);
    }

    return () => {
      supabase.removeAllChannels();
    };
  }, [isAuthenticated, user]);

  const fetchConversations = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data: conversations } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title)
        `)
        .contains('participants', [user.id])
        .order('last_message_at', { ascending: false })
        .limit(20);

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

      setConversations(conversationsWithDetails);
      
      const total = conversationsWithDetails.reduce((sum, c) => sum + c.unread_count, 0);
      setTotalUnread(total);
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!user) return;

    supabase
      .channel(`fab-messages:${user.id}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchConversations();
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();
  };

  const handleConversationClick = (conv: Conversation) => {
    if (!conv.listing_id || !conv.other_user) {
      alert('Bu sohbet için gerekli bilgiler eksik.');
      return;
    }

    setActiveChat({
      conversationId: conv.id,
      listingId: conv.listing_id,
      sellerId: conv.other_user.id,
      listingTitle: conv.listing?.title || 'Sohbet',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}g`;
    if (hours > 0) return `${hours}sa`;
    return 'Az önce';
  };

  if (!isAuthenticated || !user) return null;

  return (
    <>
      {/* FAB Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-primary-500/50 transition-shadow"
      >
        <MessageSquare className="w-6 h-6" />
        {totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900"
          >
            {totalUnread > 9 ? '9+' : totalUnread}
          </motion.span>
        )}
      </motion.button>

      {/* Conversations Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-96 max-w-md max-h-[600px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Mesajlar</h3>
                  {totalUnread > 0 && (
                    <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Henüz mesaj yok</p>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/listings');
                      }}
                      className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                    >
                      İlanlara göz at →
                    </button>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleConversationClick(conv)}
                      className="w-full p-4 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {conv.other_user?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                              {conv.other_user?.username || 'Kullanıcı'}
                            </h4>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                              {formatTime(conv.last_message_at)}
                            </span>
                          </div>
                          {conv.listing && (
                            <p className="text-xs text-primary-500 truncate mb-1 flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {conv.listing.title}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate flex-1">
                              {conv.last_message || 'Henüz mesaj yok'}
                            </p>
                            {conv.unread_count > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/profile/messages');
                  }}
                  className="w-full py-2 text-center text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  Tüm Mesajları Gör →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      {activeChat && (
        <ChatModal
          isOpen={!!activeChat}
          onClose={() => setActiveChat(null)}
          listingId={activeChat.listingId}
          sellerId={activeChat.sellerId}
          listingTitle={activeChat.listingTitle}
        />
      )}
    </>
  );
}