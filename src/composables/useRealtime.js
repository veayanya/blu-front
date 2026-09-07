// composables/useRealtime.js
// Client SSE Real-time Synchronization untuk Sintra / Bapperida AI

import { ref } from 'vue';

const isConnected = ref(false);
const lastHeartbeat = ref(null);
const eventListeners = new Map(); // eventType -> Set of callbacks

let eventSource = null;
let reconnectTimer = null;

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || '';
}

export function useRealtime() {
  function connect() {
    if (eventSource) return;

    const token = localStorage.getItem('auth_token');
    const baseUrl = getApiBaseUrl();
    const sseUrl = `${baseUrl}/api/v1/realtime/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;

    try {
      eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onopen = () => {
        isConnected.value = true;
        lastHeartbeat.value = new Date().toISOString();
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
      };

      eventSource.onmessage = (event) => {
        lastHeartbeat.value = new Date().toISOString();
        try {
          const data = JSON.parse(event.data);
          if (data && data.type) {
            triggerListeners(data.type, data.payload, data);
          }
        } catch {}
      };

      eventSource.onerror = () => {
        isConnected.value = false;
        disconnect();
        // Coba hubungkan ulang setelah 4 detik
        if (!reconnectTimer) {
          reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            connect();
          }, 4000);
        }
      };
    } catch (err) {
      console.warn('[Realtime] Gagal inisialisasi SSE:', err.message);
    }
  }

  function disconnect() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    isConnected.value = false;
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
    }
  }

  function triggerListeners(type, payload, raw) {
    if (eventListeners.has(type)) {
      for (const cb of eventListeners.get(type)) {
        try { cb(payload, raw); } catch (e) { console.error(`[Realtime Callback Error ${type}]:`, e); }
      }
    }
    // Universal listener '*'
    if (eventListeners.has('*')) {
      for (const cb of eventListeners.get('*')) {
        try { cb({ type, payload, raw }); } catch {}
      }
    }
  }

  return {
    isConnected,
    lastHeartbeat,
    connect,
    disconnect,
    on,
    off
  };
}
