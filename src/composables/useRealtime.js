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

const MIN_RECONNECT_MS = 2000;
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
  if (manualDisconnect || reconnectTimer || eventSource) return;

  const delay = Math.min(
    MAX_RECONNECT_MS,
    MIN_RECONNECT_MS * Math.pow(2, reconnectAttempt)
  );
  reconnectAttempt += 1;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, delay);
}

function closeEventSource() {
  if (eventSource) {
    try { eventSource.close(); } catch {}
    eventSource = null;
  }
  isConnected.value = false;
}

function handleMessage(event) {
  lastHeartbeat.value = new Date().toISOString();

  try {
    const data = JSON.parse(event.data);
    if (data && data.type) {
      triggerListeners(data.type, data.payload, data);
    }
  } catch (err) {
    console.warn('[Realtime] Payload SSE tidak valid:', err.message);
  }
}

function connect() {
  manualDisconnect = false;

  if (eventSource || reconnectTimer) return;

  const token = localStorage.getItem('auth_token');
  if (!token) return;

  const baseUrl = getApiBaseUrl();
  const sseUrl = `${baseUrl}/api/v1/realtime/stream?token=${encodeURIComponent(token)}`;

  try {
    const source = new EventSource(sseUrl, { withCredentials: true });
    eventSource = source;

    source.onopen = () => {
      // Abaikan event dari koneksi lama yang sudah ditutup.
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
      handleMessage(event);
    };

    source.onerror = () => {
      if (eventSource !== source) return;

      isConnected.value = false;
      closeEventSource();
      scheduleReconnect();
    };
  } catch (err) {
    console.warn('[Realtime] Gagal inisialisasi SSE:', err.message);
    closeEventSource();
    scheduleReconnect();
  }
}

function disconnect() {
  manualDisconnect = true;
  clearReconnectTimer();
  reconnectAttempt = 0;
  closeEventSource();
}

function reconnectNow() {
  if (manualDisconnect) return;
  clearReconnectTimer();
  closeEventSource();
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
  if (eventListeners.has(eventType)) {
    eventListeners.get(eventType).delete(callback);
    if (eventListeners.get(eventType).size === 0) {
      eventListeners.delete(eventType);
    }
  }
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

  const wildcardListeners = eventListeners.get('*');
  if (wildcardListeners) {
    for (const cb of [...wildcardListeners]) {
      try { cb({ type, payload, raw }); } catch (e) {
        console.error('[Realtime Callback Error *]:', e);
      }
    }
  }
}

// Bantu browser yang sempat offline / tab lama aktif kembali.
if (typeof window !== 'undefined') {
  window.addEventListener('online', reconnectNow);
}

export function useRealtime() {
  return {
    isConnected,
    lastHeartbeat,
    connect,
    disconnect,
    reconnectNow,
    on,
    off
  };
}
