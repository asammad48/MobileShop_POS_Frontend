import { create } from 'zustand';
import type { Notification } from '@shared/schema';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  
  setNotifications: (notifications) => set({ 
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length
  }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1
  })),
  
  markAsRead: (notificationId) => set((state) => {
    const notifications = state.notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    return {
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    };
  }),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0
  })),
  
  removeNotification: (notificationId) => set((state) => {
    const notifications = state.notifications.filter(n => n.id !== notificationId);
    return {
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    };
  }),
  
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
