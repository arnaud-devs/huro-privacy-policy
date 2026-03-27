import { io, Socket } from 'socket.io-client';
import { store } from '@/store/store';
import { prependNotification, AppNotification } from '@/store/slices/notificationsSlice';
import { appendMessage } from '@/store/slices/messagingSlice';

const SOCKET_URL = 'https://huzago-backend-1.onrender.com';

let socket: Socket | null = null;

// Injected by _layout.tsx after push notifications are set up
let _showLocalNotification: ((title: string, body: string, data: Record<string, any>) => void) | null = null;

export function setLocalNotificationHandler(
  fn: (title: string, body: string, data: Record<string, any>) => void
) {
  _showLocalNotification = fn;
}

export function connectSocket(accessToken: string) {
  if (socket?.connected) return;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    auth: { token: accessToken },
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.log('[Socket] Connection error:', err.message);
  });

  // New notification
  socket.on('notification:new', (data: { notification: AppNotification }) => {
    store.dispatch(prependNotification(data.notification));
    _showLocalNotification?.(
      data.notification.title,
      data.notification.body,
      {
        entityType: data.notification.entityType,
        entityId: data.notification.entityId,
        notificationId: data.notification.id,
      }
    );
  });

  // New chat message — refresh the active conversation if it matches
  socket.on('message:new', (data: any) => {
    const activeId = store.getState().messaging.activeConversationId;
    if (data?.message && data.message.conversationId === activeId) {
      store.dispatch(appendMessage(data.message));
    }
  });

  // Offer status updated
  socket.on('offer:updated', (data: any) => {
    const activeId = store.getState().messaging.activeConversationId;
    if (data?.message && data.message.conversationId === activeId) {
      store.dispatch(appendMessage(data.message));
    }
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] Manually disconnected');
  }
}

export function getSocket(): Socket | null {
  return socket;
}
