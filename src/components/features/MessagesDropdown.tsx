import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/authStore';

interface Conversation {
  id: string;
  last_message: string | null;
  last_message_at: string;
  other_user: {
    username: string;
    avatar_url: string | null;
  } | null;
  listing: {
    title: string;
  } | null;
  unread_count: number;
}

interface MessagesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  totalUnread: number;
}

export default function MessagesDropdown({ isOpen, onClose, totalUnread }: MessagesDropdownProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && user) {
      fetchConversations();
      subscribeToConversations();
    }

    return () => {
      supabase.removeAllChannels();
    };
  }, [isOpen, user]);

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
        .limit(5);

      const conversationsWithDetails = await Promise.all(
        (conversations || []).map(async (conv: any) => {
          const otherUserId = conv.participants.find((p: string) => p !== user.id);
          
          const { data: otherUser } = await supabase
            .from('users')
            .select('username, avatar_url')
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
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToConversations = () => {
    if (!user) return;

    supabase
      .channel(`conversations:${user.id}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'conversations'
        }, 
        () => {
          fetchConversations();
        }
      )
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
      .subscribe();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50"
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
                onClick={onClose}
                className="p-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversations List */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Henüz mesaj yok</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      onClose();
                      navigate('/profile/messages');
                    }}
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
                          <p className="text-xs text-primary-500 truncate mb-1">
                            {conv.listing.title}
                          </p>
                        )}
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                          {conv.last_message || 'Henüz mesaj yok'}
                        </p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => {
                  onClose();
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
  );
}