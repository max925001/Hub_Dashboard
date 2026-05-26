import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '@/types/content';

interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<NotificationItem, 'read' | 'createdAt'>>) {
      const newNotif: NotificationItem = {
        ...action.payload,
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newNotif);
      state.unreadCount += 1;
    },
    addRawNotification(state, action: PayloadAction<NotificationItem>) {
      // For SSE payload which already has read and createdAt
      if (!state.items.find(item => item.id === action.payload.id)) {
        state.items.unshift(action.payload);
        if (!action.payload.read) {
          state.unreadCount += 1;
        }
      }
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find((item) => item.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.items.forEach((item) => {
        item.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification(state, action: PayloadAction<string>) {
      const notification = state.items.find((item) => item.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
    }
  }
});

export const {
  addNotification,
  addRawNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
export const selectNotifications = (state: { notifications: NotificationsState }) => state.notifications.items;
export const selectUnreadNotificationsCount = (state: { notifications: NotificationsState }) =>
  state.notifications.unreadCount;
