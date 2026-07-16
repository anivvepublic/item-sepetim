import { create } from 'zustand';
import { supabase } from '../supabase/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  link?: string;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      set({ notifications: [], unreadCount: 0 });
      return;
    }

    set({ isLoading: true });

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const notifications = data || [];
      const unread = notifications.filter((n: any) => !n.is_read).length;

      set({
        notifications,
        unreadCount,
        isLoading: false,
      });
    } catch (error) {
      console.error('[DEBUG] Fetch notifications error:', error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', session.user.id);

      const notifications = get().notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.is_read).length;

      set({ notifications, unreadCount });
    } catch (error) {
      console.error('[DEBUG] Mark as read error:', error);
    }
  },

  markAllAsRead: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', session.user.id)
        .eq('is_read', false);

      const notifications = get().notifications.map((n) => ({ ...n, is_read: true }));

      set({ notifications, unreadCount: 0 });
    } catch (error) {
      console.error('[DEBUG] Mark all as read error:', error);
    }
  },
}));