// composables/useRealtime.js
// Client SSE Real-time Synchronization untuk Sintra / Bapperida AI

import { ref } from 'vue';

const isConnected = ref(false);
const lastHeartbeat = ref(null);
const eventListeners = new Map();

let eventSource = null;
let reconnectTimer = null;
let reconnectAttempt = 0;
let manualDisconnect = false;

const MIN_RECONNECT_MS = 1500;
const MAX_RECONNECT_MS = 30000;

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
}

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect() {
  if (manualDisconnect || reconnectTimer || !localStorage.getItem('auth_token')) return;

  const delay = Math.min(
    MAX_RECONNECT_MS,
    MIN_RECONNECT_MS * Math.pow(2, Math.min(reconnectAttempt, 5))
  );
  reconnectAttempt += 1;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, delay);
}

function closeCurrentSource() {
  if (eventSource) {
    eventSource.onopen = null;
    eventSource.onmessage = null;
    eventSource.onerror = null;
    eventSource.close();
    eventSource = null;
  }
}

function connect() {
  if (manualDisconnect || eventSource || !localStorage.getItem('auth_token')) return;

  const token = localStorage.getItem('auth_token');
  const baseUrl = getApiBaseUrl();
  const sseUrl = `${baseUrl}/api/v1/realtime/stream?token=${encodeURIComponent(token)}`;

  try {
    const source = new EventSource(sseUrl, { withCredentials: true });
    eventSource = source;

    source.onopen = () => {
      // Abaikan event dari EventSource lama yang sudah ditutup.
      if (eventSource !== source) return;
      const wasReconnect = reconnectAttempt > 0;
      reconnectAttempt = 0;
      isConnected.value = true;
      lastHeartbeat.value = new Date().toISOString();
      clearReconnectTimer();

      if (wasReconnect) {
        triggerListeners('REALTIME_RECONNECTED', null, {
          type: 'REALTIME_RECONNECTED',
          timestamp: new Date().toISOString()
        });
      }
    };

    source.onmessage = (event) => {
      if (eventSource !== source) return;
      lastHeartbeat.value = new Date().toISOString();

      try {
        const data = JSON.parse(event.data);
        if (data && data.type) {
          if (data.type === 'CONNECTED') {
            triggerListeners('REALTIME_CONNECTED', data.payload ?? data, data);
            return;
          }
          triggerListeners(data.type, data.payload, data);
        }
      } catch (err) {
        console.warn('[Realtime] Payload SSE tidak valid:', err.message);
      }
    };

    source.onerror = () => {
      if (eventSource !== source) return;
      isConnected.value = false;
      closeCurrentSource();
      scheduleReconnect();
    };
  } catch (err) {
    console.warn('[Realtime] Gagal inisialisasi SSE:', err.message);
    isConnected.value = false;
    scheduleReconnect();
  }
}

function disconnect() {
  manualDisconnect = true;
  clearReconnectTimer();
  reconnectAttempt = 0;
  closeCurrentSource();
  isConnected.value = false;
}

function reconnect() {
  manualDisconnect = false;
  clearReconnectTimer();
  closeCurrentSource();
  isConnected.value = false;
  reconnectAttempt = 0;
  connect();
}

function on(eventType, callback) {
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, new Set());
  }
  eventListeners.get(eventType).add(callback);
  return () => off(eventType, callback);
}

function off(eventType, callback) {
  const listeners = eventListeners.get(eventType);
  if (!listeners) return;
  listeners.delete(callback);
  if (listeners.size === 0) eventListeners.delete(eventType);
}

function triggerListeners(type, payload, raw) {
  const listeners = eventListeners.get(type);
  if (listeners) {
    for (const cb of [...listeners]) {
      try { cb(payload, raw); } catch (e) {
        console.error(`[Realtime Callback Error ${type}]:`, e);
      }
    }
  }

  const universal = eventListeners.get('*');
  if (universal) {
    for (const cb of [...universal]) {
      try { cb({ type, payload, raw }); } catch (e) {
        console.error('[Realtime Callback Error *]:', e);
      }
    }
  }
}

// Browser/network lifecycle: jangan biarkan tab yang kembali online menunggu
// exponential backoff terlalu lama.
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    if (localStorage.getItem('auth_token')) reconnect();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && localStorage.getItem('auth_token') && !eventSource) {
      manualDisconnect = false;
      connect();
    }
  });
}

export function useRealtime() {
  return {
    isConnected,
    lastHeartbeat,
    connect: () => {
      manualDisconnect = false;
      connect();
    },
    reconnect,
    disconnect,
    on,
    off
  };
}
