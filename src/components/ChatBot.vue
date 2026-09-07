<template>
  <!-- FAB Button -->
  <div
    class="chat-fab"
    @click="toggleChat"
    :class="{ 'has-unread': hasUnread && !isOpen }"
    :title="isOpen ? 'Tutup Chat' : 'Asisten BAPPERIDA AI'"
  >
    <i :data-lucide="isOpen ? 'x' : 'bot'" class="fab-icon"></i>
    <span v-if="hasUnread && !isOpen" class="unread-dot"></span>
  </div>

  <!-- Chat Panel -->
  <Transition name="chat-slide">
    <div v-if="isOpen" class="chat-panel">

      <!-- Header -->
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">
            <span class="persona-avatar-emoji">{{ currentPersonaObj.emoji }}</span>
            <span class="online-dot"></span>
          </div>
          <div>
            <div class="chat-title">{{ currentPersonaObj.name }}</div>
            <div class="chat-subtitle">{{ currentPerspectiveObj.name }} · {{ currentPersonalityObj.name }}</div>
          </div>
        </div>
        <div class="chat-header-actions">
          <!-- Persona Settings Toggle -->
          <button 
            class="btn-icon-chat" 
            :class="{ active: showConfigDrawer }"
            @click="showConfigDrawer = !showConfigDrawer" 
            title="Konfigurasi Persona, Perspektif & Personality"
          >
            <i data-lucide="sliders-horizontal"></i>
          </button>

          <!-- Doc Mode Toggle (RKA / Pra RKA) -->
          <div class="mode-toggle doc-mode-toggle">
            <button
              :class="{ active: docMode === 'rka' }"
              @click="docMode = 'rka'"
              title="Mode RKA: Analisis Dokumen RKA"
            >
              📊 RKA
            </button>
            <button
              :class="{ active: docMode === 'pra-rka' }"
              @click="docMode = 'pra-rka'"
              title="Mode Pra RKA: Perencanaan Awal"
            >
              📋 Pra RKA
            </button>
          </div>

          <!-- Mode Toggle -->
          <div class="mode-toggle">
            <button
              :class="{ active: chatMode === 'mode1' }"
              @click="chatMode = 'mode1'"
              :title="docMode === 'pra-rka' ? 'Mode 1: Analisis Kebutuhan' : 'Mode 1: Analisis Evaluasi RKA'"
            >
              <i data-lucide="microscope"></i>
            </button>
            <button
              :class="{ active: chatMode === 'mode2' }"
              @click="chatMode = 'mode2'"
              :title="docMode === 'pra-rka' ? 'Mode 2: Simulasi Pagu' : 'Mode 2: Eksekutor Revisi Dokumen'"
            >
              <i data-lucide="table-2"></i>
            </button>
          </div>
          <button class="btn-icon-chat" @click="clearChat" title="Hapus riwayat">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>

      <!-- PERSONA & PERSONALITY CONFIG DRAWER -->
      <div v-if="showConfigDrawer" class="chat-config-drawer">
        <div class="config-drawer-header">
          <span>⚙️ Pengaturan Persona & Gaya Bicara AI</span>
          <button class="btn-close-drawer" @click="showConfigDrawer = false">✕</button>
        </div>

        <div class="config-section-row">
          <label class="config-label">🎭 Persona (Peran AI):</label>
          <div class="pill-options-grid">
            <button
              v-for="p in personasList"
              :key="p.id"
              :class="['pill-opt-btn', { active: selectedPersona === p.id }]"
              @click="selectedPersona = p.id"
            >
              <span class="opt-emoji">{{ p.emoji }}</span>
              <span class="opt-name">{{ p.name }}</span>
            </button>
          </div>
        </div>

        <div class="config-section-row">
          <label class="config-label">🔍 Perspektif (Fokus Analisis):</label>
          <div class="pill-options-grid">
            <button
              v-for="pers in perspectivesList"
              :key="pers.id"
              :class="['pill-opt-btn', { active: selectedPerspective === pers.id }]"
              @click="selectedPerspective = pers.id"
            >
              <span class="opt-emoji">{{ pers.emoji }}</span>
              <span class="opt-name">{{ pers.name }}</span>
            </button>
          </div>
        </div>

        <div class="config-section-row">
          <label class="config-label">💬 Personality (Gaya Komunikasi):</label>
          <div class="pill-options-grid">
            <button
              v-for="sty in personalitiesList"
              :key="sty.id"
              :class="['pill-opt-btn', { active: selectedPersonality === sty.id }]"
              @click="selectedPersonality = sty.id"
            >
              <span class="opt-emoji">{{ sty.emoji }}</span>
              <span class="opt-name">{{ sty.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mode & Persona Quick Status Bar -->
      <div class="chat-mode-badge" :class="[chatMode, docMode]">
        <div class="badge-left">
          <span class="doc-mode-tag" :class="docMode">{{ docMode === 'pra-rka' ? '📋 Pra RKA' : '📊 RKA' }}</span>
          <i :data-lucide="chatMode === 'mode1' ? 'microscope' : 'table-2'"></i>
          <span v-if="docMode === 'pra-rka'">{{ chatMode === 'mode1' ? 'Analisis Kebutuhan & Prioritas' : 'Simulasi Pagu & Proyeksi SROI' }}</span>
          <span v-else>{{ chatMode === 'mode1' ? 'Mode 1: Analisis Evaluasi RKA' : 'Mode 2: Eksekutor Revisi Dokumen' }}</span>
        </div>
        <div class="badge-right" @click="showConfigDrawer = !showConfigDrawer" title="Klik untuk ubah persona">
          <span class="persona-tag">{{ currentPersonaObj.emoji }} {{ currentPersonaObj.name.split(' ')[0] }}</span>
        </div>
      </div>

      <!-- Messages -->
      <div class="chat-messages" ref="messagesEl">
        <!-- Welcome -->
        <div v-if="messages.length === 0" class="welcome-card">
          <div class="welcome-icon">
            <span style="font-size: 2rem;">{{ currentPersonaObj.emoji }}</span>
          </div>
          <h3>Halo! Saya {{ currentPersonaObj.name }} 👋</h3>
          <p>{{ currentPersonaObj.description }}</p>
          <div class="active-persona-info">
            <span>Fokus: <strong>{{ currentPerspectiveObj.name }}</strong></span>
            <span> · Gaya: <strong>{{ currentPersonalityObj.name }}</strong></span>
          </div>
          <div class="suggestion-chips">
            <button
              v-for="chip in dynamicSuggestions"
              :key="chip"
              class="chip"
              @click="sendSuggestion(chip)"
            >{{ chip }}</button>
          </div>
        </div>

        <!-- Bubbles -->
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="message-row"
          :class="msg.role"
        >
          <div v-if="msg.role === 'model'" class="msg-avatar">
            <span>{{ (msg.personaObj && msg.personaObj.emoji) || currentPersonaObj.emoji }}</span>
          </div>
          <div class="bubble" :class="msg.role">
            <!-- Header on model bubble -->
            <div v-if="msg.role === 'model' && msg.personaObj" class="bubble-persona-header">
              <span class="bubble-persona-badge">{{ msg.personaObj.emoji }} {{ msg.personaObj.name }}</span>
              <span v-if="msg.modelUsed" class="bubble-engine-tag">{{ msg.modelUsed }}</span>
            </div>

            <div
              v-if="msg.role === 'model'"
              class="bubble-inner"
              v-html="renderMarkdown(msg.content)"
            ></div>
            <div v-else class="bubble-inner">{{ msg.content }}</div>
            <div class="bubble-time">{{ msg.time }}</div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message-row model">
          <div class="msg-avatar">
            <span>{{ currentPersonaObj.emoji }}</span>
          </div>
          <div class="bubble model typing-bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <textarea
          ref="inputEl"
          v-model="inputText"
          class="chat-input"
          :placeholder="`Tanya ${currentPersonaObj.name} (${currentPerspectiveObj.name})...`"
          rows="1"
          @keydown.enter.exact.prevent="sendMessage"
          @input="autoResize"
        ></textarea>
        <button
          class="send-btn"
          :disabled="!inputText.trim() || isTyping"
          @click="sendMessage"
          title="Kirim"
        >
          <i v-if="isTyping" data-lucide="loader-circle" class="spin-icon"></i>
          <i v-else data-lucide="send"></i>
        </button>
      </div>

    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue';

const isOpen = ref(false);
const hasUnread = ref(true);
const chatMode = ref('mode1');
const docMode = ref('rka');
const showConfigDrawer = ref(false);

const selectedPersona = ref('auditor');
const selectedPerspective = ref('kepatuhan');
const selectedPersonality = ref('formal');

const messages = ref([]);
const inputText = ref('');
const isTyping = ref(false);
const messagesEl = ref(null);
const inputEl = ref(null);

const personasList = [
  { id: 'auditor', name: 'Auditor Senior BAPPERIDA', emoji: '🏛️', description: 'Kritis, teliti, fokus kepatuhan SSH/SBM, mitigasi risiko & audit regulasi.' },
  { id: 'konsultan', name: 'Konsultan Perencanaan & SROI', emoji: '💼', description: 'Strategis, berorientasi hasil SROI, efisiensi pagu & dampak publik.' },
  { id: 'tapd', name: 'Tim Anggaran Pemda (TAPD)', emoji: '⚖️', description: 'Fokus pada plafon anggaran daerah, rasionalisasi belanja & prioritas pembangunan.' },
  { id: 'verifikator', name: 'Verifikator Teknis RKA', emoji: '📋', description: 'Taktis dan detail pada struktur kode rekening belanja 5.2.x & rincian objek.' }
];

const perspectivesList = [
  { id: 'kepatuhan', name: 'Kepatuhan SSH & Efisiensi', emoji: '🛡️' },
  { id: 'sroi', name: 'Dampak Sosial & SROI', emoji: '📈' },
  { id: 'indikator', name: 'Indikator Renja & Target', emoji: '🎯' },
  { id: 'realokasi', name: 'Rasionalisasi & Realokasi', emoji: '🔄' }
];

const personalitiesList = [
  { id: 'formal', name: 'Formal & Regulatif', emoji: '📜' },
  { id: 'ringkas', name: 'Ringkas & Tegas (Executive)', emoji: '⚡' },
  { id: 'edukatif', name: 'Edukatif & Konsultatif', emoji: '🤝' }
];

const currentPersonaObj = computed(() => {
  return personasList.find(p => p.id === selectedPersona.value) || personasList[0];
});

const currentPerspectiveObj = computed(() => {
  return perspectivesList.find(p => p.id === selectedPerspective.value) || perspectivesList[0];
});

const currentPersonalityObj = computed(() => {
  return personalitiesList.find(p => p.id === selectedPersonality.value) || personalitiesList[0];
});

const dynamicSuggestions = computed(() => {
  if (docMode.value === 'pra-rka') {
    if (selectedPersona.value === 'auditor') {
      return [
        'Apa saja dokumen perencanaan yang harus disiapkan sebelum menyusun RKA?',
        'Cara memastikan program prioritas sesuai dengan RPJMD/RKPD?',
        'Bagaimana menghitung estimasi pagu awal berdasarkan SSH?',
        'Kerangka logis (logframe) yang ideal untuk program pembangunan daerah?'
      ];
    } else if (selectedPersona.value === 'konsultan') {
      return [
        'Bagaimana cara mengestimasi SROI pada tahap pra-perencanaan?',
        'Simulasi alokasi belanja ideal untuk program baru?',
        'Cara memetakan kebutuhan masyarakat menjadi program prioritas?',
        'Template kerangka draf awal RKA yang efektif?'
      ];
    } else if (selectedPersona.value === 'tapd') {
      return [
        'Cara menetapkan plafon anggaran awal per OPD?',
        'Kriteria prioritas program yang layak didanai APBD?',
        'Bagaimana sinkronisasi usulan program dengan kapasitas fiskal daerah?',
        'Distribusi pagu ideal antara belanja wajib dan belanja prioritas?'
      ];
    } else {
      return [
        'Struktur kode rekening belanja yang benar untuk program baru?',
        'Cara menentukan volume dan satuan output yang terukur?',
        'Format indikator kinerja yang sesuai standar Permendagri?',
        'Cara menyusun rincian belanja sesuai SSH/SBM terbaru?'
      ];
    }
  }

  if (selectedPersona.value === 'auditor') {
    return [
      'Batas maksimal belanja penunjang ATK & perjalanan dinas?',
      'Cara mendeteksi harga satuan belanja yang melebihi e-SSH?',
      'Bagaimana mitigasi risiko penumpukan pencairan dana di Triwulan IV?',
      'Jelaskan dampak temuan BPK terkait honorarium tim internal.'
    ];
  } else if (selectedPersona.value === 'konsultan') {
    return [
      'Bagaimana cara menghitung formula rasio SROI yang akurat?',
      'Apa arti persentase Deadweight dan bagaimana cara menurunkannya?',
      'Cara mengukur nilai manfaat sosial (Outcome) program stunting?',
      'Rekomendasi optimasi alokasi pagu belanja substantif.'
    ];
  } else if (selectedPersona.value === 'tapd') {
    return [
      'Bagaimana cara rasionalisasi belanja operasional perangkat daerah?',
      'Kriteria subkegiatan yang wajib disesuaikan pagu indikatifnya?',
      'Simulasi tabel realokasi belanja untuk subkegiatan prioritas.',
      'Menjaga keseimbangan belanja aparatur vs belanja pelayanan publik.'
    ];
  } else {
    return [
      'Format penulisan rincian belanja akun 5.2.02 dan 5.2.06 yang benar?',
      'Bagaimana cara mengecek kesesuaian target indikator output?',
      'Cara menyusun tabel komparasi revisi RKA sebelum vs sesudah?',
      'Validasi volume belanja barang yang diserahkan ke masyarakat.'
    ];
  }
});

// Re-render lucide icons after DOM update
function refreshIcons() {
  nextTick(() => {
    if (window.lucide) window.lucide.createIcons();
  });
}

watch([isOpen, messages, isTyping, chatMode, docMode, showConfigDrawer], refreshIcons);
onMounted(refreshIcons);

function toggleChat() {
  isOpen.value = !isOpen.value;
  hasUnread.value = false;
  if (isOpen.value) {
    nextTick(() => {
      refreshIcons();
      inputEl.value?.focus();
    });
  }
}

function clearChat() {
  messages.value = [];
}

function autoResize() {
  const el = inputEl.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

async function scrollToBottom() {
  await nextTick();
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  }
}

function sendSuggestion(text) {
  inputText.value = text;
  sendMessage();
}

function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/^\s*\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^\|(.+)\|$/gm, (row) => {
      const cells = row.split('|').filter((_, i, a) => i > 0 && i < a.length - 1);
      const isSep = cells.every(c => /^[-:]+$/.test(c.trim()));
      if (isSep) return '';
      const tag = 'td';
      return '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
    })
    .replace(/(<tr>[\s\S]+?<\/tr>)+/g, (m) => `<div class="table-responsive"><table class="chat-md-table">${m}</table></div>`)
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>');

  html = html.replace(/(<li>[\s\S]+?<\/li>)+/g, (m) => `<ul>${m}</ul>`);
  return `<p>${html}</p>`;
}

function getTime() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

async function sendMessage() {
  const text = inputText.value.trim();
  if (!text || isTyping.value) return;

  const currentP = { ...currentPersonaObj.value };
  messages.value.push({ role: 'user', content: text, time: getTime() });
  inputText.value = '';
  autoResize();
  await scrollToBottom();

  isTyping.value = true;
  await scrollToBottom();

  const historyForApi = messages.value.slice(0, -1).map(m => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const res = await fetch('/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        history: historyForApi,
        message: text,
        mode: chatMode.value,
        docMode: docMode.value,
        persona: selectedPersona.value,
        perspective: selectedPerspective.value,
        personality: selectedPersonality.value
      }),
    });
    const data = await res.json();
    isTyping.value = false;

    if (data.success && data.result) {
      messages.value.push({
        role: 'model',
        content: data.result,
        time: getTime(),
        personaObj: currentP,
        modelUsed: data.modelUsed || 'AI Engine'
      });
    } else {
      messages.value.push({
        role: 'model',
        content: `Maaf, terjadi kendala saat memproses jawaban: ${data.error || 'Silakan coba lagi.'}`,
        time: getTime(),
        personaObj: currentP
      });
    }
  } catch (err) {
    isTyping.value = false;
    messages.value.push({
      role: 'model',
      content: `Gagal terhubung ke server backend: ${err.message}`,
      time: getTime(),
      personaObj: currentP
    });
  }

  await scrollToBottom();
  refreshIcons();
}
</script>

<style scoped>
/* Floating Action Button */
.chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  z-index: 10000;
  transition: all 0.25s ease;
}

.chat-fab:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.5);
}

.fab-icon {
  width: 26px;
  height: 26px;
}

.unread-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
}

/* Slide Transition */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

/* Chat Panel */
.chat-panel {
  position: fixed;
  bottom: 92px;
  right: 24px;
  width: 440px;
  max-width: calc(100vw - 32px);
  height: 620px;
  max-height: calc(100vh - 120px);
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
}

/* Header */
.chat-header {
  padding: 14px 16px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-avatar {
  position: relative;
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.persona-avatar-emoji {
  font-size: 1.4rem;
}

.online-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid #1e293b;
}

.chat-title {
  font-weight: 700;
  font-size: 0.92rem;
  color: #f8fafc;
}

.chat-subtitle {
  font-size: 0.72rem;
  color: #94a3b8;
}

.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-icon-chat {
  background: transparent;
  border: none;
  color: #94a3b8;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon-chat:hover,
.btn-icon-chat.active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.mode-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2px;
}

.mode-toggle button {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.mode-toggle button.active {
  background: #2563eb;
  color: white;
}

/* Config Drawer */
.chat-config-drawer {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 14px;
  max-height: 250px;
  overflow-y: auto;
  font-size: 0.8rem;
}

.config-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.btn-close-drawer {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-weight: 700;
}

.config-section-row {
  margin-bottom: 10px;
}

.config-label {
  display: block;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
  font-size: 0.75rem;
}

.pill-options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.pill-opt-btn {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 0.72rem;
  color: #334155;
  text-align: left;
  transition: all 0.15s;
}

.pill-opt-btn:hover {
  border-color: #2563eb;
}

.pill-opt-btn.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #1d4ed8;
  font-weight: 700;
}

/* Mode & Status Badge */
.chat-mode-badge {
  padding: 6px 14px;
  font-size: 0.72rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}

.chat-mode-badge.mode1 {
  background: #eff6ff;
  color: #1d4ed8;
  border-bottom: 1px solid #dbeafe;
}

.chat-mode-badge.mode2 {
  background: #ecfdf5;
  color: #047857;
  border-bottom: 1px solid #d1fae5;
}

.chat-mode-badge.pra-rka {
  background: #fefce8;
  color: #a16207;
  border-bottom: 1px solid #fef08a;
}

.doc-mode-tag {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 4px;
  margin-right: 4px;
}

.doc-mode-tag.rka {
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
}

.doc-mode-tag.pra-rka {
  background: rgba(161, 98, 7, 0.12);
  color: #a16207;
}

.doc-mode-toggle {
  margin-right: 2px;
}

.doc-mode-toggle button {
  font-size: 0.68rem !important;
  padding: 3px 6px !important;
}

.badge-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.persona-tag {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
}

/* Welcome Card */
.welcome-card {
  text-align: center;
  padding: 20px 10px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.welcome-icon {
  margin-bottom: 8px;
}

.welcome-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.welcome-card p {
  font-size: 0.78rem;
  color: #64748b;
  margin-bottom: 8px;
}

.active-persona-info {
  font-size: 0.72rem;
  color: #2563eb;
  background: #eff6ff;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 12px;
}

.suggestion-chips {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.chip {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.75rem;
  color: #334155;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.chip:hover {
  background: #f1f5f9;
  border-color: #2563eb;
  color: #1d4ed8;
}

/* Message Rows & Bubbles */
.message-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.message-row.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.bubble {
  max-width: 82%;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 0.82rem;
  line-height: 1.45;
}

.bubble.user {
  background: #2563eb;
  color: white;
  border-bottom-right-radius: 2px;
}

.bubble.model {
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.bubble-persona-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.7rem;
}

.bubble-persona-badge {
  font-weight: 700;
  color: #1d4ed8;
}

.bubble-engine-tag {
  color: #94a3b8;
  font-size: 0.65rem;
}

.bubble-time {
  font-size: 0.65rem;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
}

.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
}

.typing-bubble .dot {
  width: 6px;
  height: 6px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typingBounce 1.2s infinite ease-in-out;
}

.typing-bubble .dot:nth-child(2) { animation-delay: 0.2s; }
.typing-bubble .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Chat Input Area */
.chat-input-area {
  padding: 10px 14px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 0.82rem;
  resize: none;
  max-height: 100px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #2563eb;
}

.send-btn {
  width: 36px;
  height: 36px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Markdown Tables in Chat */
:deep(.table-responsive) {
  overflow-x: auto;
  margin: 8px 0;
}

:deep(.chat-md-table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.74rem;
}

:deep(.chat-md-table th),
:deep(.chat-md-table td) {
  border: 1px solid #cbd5e1;
  padding: 4px 6px;
  text-align: left;
}

:deep(.chat-md-table tr:first-child) {
  background: #f1f5f9;
  font-weight: 700;
}
</style>
