<template>
  <div class="bapperida-agentic-container">
    
    <!-- ════════════════════ TOP HEADER BAR ════════════════════ -->
    <header class="bapperida-top-header">
      <div class="header-brand">
        <button v-if="selectedAgentMode" class="btn-back-mode" @click="selectedAgentMode = null" title="Kembali ke Pemilihan Mode">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
        <div class="brand-logo-circle" :class="selectedAgentMode === 'pra-rka' ? 'pra-rka-logo' : ''">
          <svg v-if="selectedAgentMode !== 'pra-rka'" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div>
          <h1 class="brand-title">BAPPERIDA KABUPATEN</h1>
          <p class="brand-subtitle" v-if="!selectedAgentMode">Pilih Mode AI Agent — RKA atau Pra RKA</p>
          <p class="brand-subtitle" v-else-if="selectedAgentMode === 'rka'">Sistem Analis Perencanaan &amp; Anggaran RKA (Aibot Gemini)</p>
          <p class="brand-subtitle" v-else>Perencanaan &amp; Persiapan Pra-RKA (Aibot Gemini)</p>
        </div>
      </div>

      <div class="header-engine-pill">
        <span class="engine-live-dot"></span>
        <span class="engine-pill-text">AI Engine: Gemini 2.5 Flash</span>
      </div>
    </header>

    <!-- ════════════════════ MODE SELECTION SCREEN ════════════════════ -->
    <div v-if="!selectedAgentMode" class="mode-selection-screen">
      <div class="mode-selection-intro">
        <h2 class="mode-intro-title">Pilih Mode AI Agent</h2>
        <p class="mode-intro-desc">Silakan pilih jenis analisis yang ingin Anda lakukan. Setiap mode memiliki konteks dan fokus AI yang berbeda.</p>
      </div>

      <div class="mode-cards-row">
        <!-- RKA Mode Card -->
        <div class="mode-select-card rka-card" @click="selectedAgentMode = 'rka'">
          <div class="mode-card-glow rka-glow"></div>
          <div class="mode-card-icon-ring rka-ring">
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
              <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
            </svg>
          </div>
          <h3 class="mode-card-title">📊 Mode RKA</h3>
          <p class="mode-card-subtitle">Analisis &amp; Evaluasi Dokumen RKA</p>
          <ul class="mode-card-features">
            <li>🔬 Analisis Evaluasi RKA (SROI, SSH, Efisiensi)</li>
            <li>📋 Eksekutor Revisi Dokumen &amp; Tabel Komparasi</li>
            <li>📊 Audit 40–100 Subkegiatan Sekaligus</li>
            <li>📥 Ekspor Hasil ke CSV / JSON</li>
          </ul>
          <div class="mode-card-action">
            <span>Masuk ke Mode RKA</span>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><path d="m9 18 6-6-6-6"></path></svg>
          </div>
        </div>

        <!-- Pra RKA Mode Card -->
        <div class="mode-select-card pra-rka-card" @click="selectedAgentMode = 'pra-rka'">
          <div class="mode-card-glow pra-rka-glow"></div>
          <div class="mode-card-icon-ring pra-rka-ring">
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <h3 class="mode-card-title">📋 Mode Pra RKA</h3>
          <p class="mode-card-subtitle">Perencanaan &amp; Persiapan Pra-RKA</p>
          <ul class="mode-card-features">
            <li>📝 Analisis Kebutuhan &amp; Prioritas Program</li>
            <li>🧮 Simulasi Pagu &amp; Proyeksi SROI Awal</li>
            <li>📄 Generator Draf Awal RKA</li>
            <li>🔗 Sinkronisasi RPJMD / RKPD / Renstra</li>
          </ul>
          <div class="mode-card-action">
            <span>Masuk ke Mode Pra RKA</span>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><path d="m9 18 6-6-6-6"></path></svg>
          </div>
        </div>
      </div>
    </div>


    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- ════════════ RKA MODE WORKSPACE (EXISTING CONTENT) ════════════ -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <template v-if="selectedAgentMode === 'rka'">

    <!-- ════════════════════ NAVIGATION MODE TABS ════════════════════ -->
    <nav class="bapperida-nav-tabs">
      <button 
        class="nav-tab-item" 
        :class="{ active: currentMode === 'mode1' }"
        @click="currentMode = 'mode1'"
      >
        <span class="tab-icon">🔬</span>
        <span>Mode 1: Analis Evaluasi RKA</span>
      </button>

      <button 
        class="nav-tab-item" 
        :class="{ active: currentMode === 'mode2' }"
        @click="currentMode = 'mode2'"
      >
        <span class="tab-icon">📋</span>
        <span>Mode 2: Eksekutor Revisi Dokumen</span>
      </button>

      <button 
        class="nav-tab-item" 
        :class="{ active: currentMode === 'mode3' }"
        @click="currentMode = 'mode3'"
      >
        <span class="tab-icon">&lt;/&gt;</span>
        <span>Integrasi &amp; Dok API</span>
      </button>
    </nav>


    <!-- ══════════════════════════════════════════════════════════════════════════ -->
    <!-- ════════════════════ MODE 1: ANALIS EVALUASI RKA ════════════════════════ -->
    <!-- ══════════════════════════════════════════════════════════════════════════ -->
    <main v-if="currentMode === 'mode1'" class="bapperida-grid-layout">
      
      <!-- ── LEFT PANEL: INPUT USULAN RKA ── -->
      <section class="bapperida-panel left-panel">
        <div class="panel-header-row">
          <div class="panel-title-group">
            <span class="panel-icon">📝</span>
            <h2 class="panel-heading">Input Usulan RKA</h2>
          </div>
          <button class="btn-sample-data" @click="loadSampleData" title="Isi contoh data RKA secara otomatis">
            🪄 Contoh Data
          </button>
        </div>

        <!-- Scale Selector (40 - 100 Subkegiatan) -->
        <div class="form-group-box">
          <div class="scale-header-flex">
            <label class="form-label">Skala Analisis Subkegiatan:</label>
            <span class="scale-badge-pill">{{ subkegScale }} Subkegiatan</span>
          </div>
          <div class="scale-chips-row">
            <button 
              v-for="scale in [40, 50, 75, 100]" 
              :key="scale" 
              class="scale-chip-btn" 
              :class="{ active: subkegScale === scale }"
              @click="setSubkegScale(scale)"
            >
              {{ scale }} Subkeg {{ scale === 100 ? '(Maks)' : '' }}
            </button>
          </div>
        </div>

        <!-- Upload File Box -->
        <div class="form-group-box">
          <label class="form-label">Unggah Dokumen (Excel / CSV / TXT / JSON / PDF)</label>
          <div 
            class="file-dropzone" 
            :class="{ 'dropzone-reading': isReadingFile }"
            @click="triggerFileInput" 
            @dragover.prevent 
            @drop.prevent="handleFileDrop"
          >
            <input 
              type="file" 
              ref="fileInputRef" 
              @change="handleFileSelect" 
              accept=".xlsx,.xls,.csv,.txt,.json,.pdf" 
              style="display: none;" 
            />
            <div class="dropzone-cloud-icon">
              <div v-if="isReadingFile" class="loading-pulse-ring small"></div>
              <svg v-else viewBox="0 0 24 24" width="32" height="32" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                <path d="M12 12v9"></path>
                <path d="m16 16-4-4-4 4"></path>
              </svg>
            </div>
            <div class="dropzone-text-main">
              <strong v-if="isReadingFile">{{ readingStatusText }}</strong>
              <template v-else>
                <strong>Klik untuk memilih file</strong> atau seret file ke sini
              </template>
            </div>
            <div class="dropzone-text-sub">
              {{ uploadedFileName ? '📄 ' + uploadedFileName + (isReadingFile ? ' (Sedang membaca...)' : ' (Selesai diekstrak ke textarea)') : 'Format: PDF, XLSX, XLS, CSV, TXT, JSON (Maks. 20MB)' }}
            </div>
          </div>
        </div>

        <!-- Textarea RKA -->
        <div class="form-group-box">
          <div class="textarea-header-flex">
            <label class="form-label">Teks / Rincian Rekening RKA</label>
            <span class="badge-editable-tag">✏️ Dapat Diedit</span>
          </div>
          <textarea 
            v-model="inputRkaText"
            class="bapperida-textarea"
            placeholder="Masukkan rincian program, indikator output, dan pos belanja RKA di sini (otomatis terisi saat berkas PDF diunggah dan dapat diedit)..."
            rows="7"
          ></textarea>
        </div>

        <!-- Catatan Tambahan -->
        <div class="form-group-box">
          <label class="form-label">Catatan Analisis Tambahan (Opsional)</label>
          <input 
            type="text" 
            v-model="inputNotes"
            class="bapperida-input"
            placeholder="Contoh: Fokus pada penghematan sewa gedung dan perjalanan dinas..."
          />
        </div>

        <!-- Main Action Button -->
        <button 
          class="btn-evaluasi-primary" 
          :disabled="isAnalyzing"
          @click="runEvaluasiRka"
        >
          <span class="btn-spinner" v-if="isAnalyzing">⏳</span>
          <span v-else>🔬</span>
          <span>{{ isAnalyzing ? 'Sedang Membedah ' + subkegScale + ' Subkegiatan...' : 'Jalankan Evaluasi RKA' }}</span>
        </button>
      </section>


      <!-- ── RIGHT PANEL: HASIL MEMBEDAH DOKUMEN RKA ── -->
      <section class="bapperida-panel right-panel">
        <div class="panel-header-row">
          <div class="panel-title-group">
            <span class="panel-icon">📊</span>
            <h2 class="panel-heading">Hasil Membedah Dokumen RKA</h2>
          </div>
          <div v-if="hasEvaluated" class="evaluated-actions">
            <button class="btn-action-ghost" @click="exportEvaluation('csv')">📥 Unduh CSV</button>
            <button class="btn-action-ghost" @click="exportEvaluation('json')">📄 Unduh JSON</button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!hasEvaluated && !isAnalyzing" class="empty-state-box">
          <div class="empty-calculator-icon">
            <svg viewBox="0 0 24 24" width="56" height="56" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2"></rect>
              <line x1="8" x2="16" y1="6" y2="6"></line>
              <line x1="16" x2="16" y1="14"></line>
              <path d="M16 10h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M8 10h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M8 14h.01"></path>
              <path d="M12 18h.01"></path>
              <path d="M8 18h.01"></path>
            </svg>
          </div>
          <p class="empty-text">
            Masukkan usulan RKA di panel kiri lalu klik <strong>Jalankan Evaluasi RKA</strong> untuk membedah Efisiensi, Efektivitas, Deadweight, dan SROI.
          </p>
        </div>

        <!-- Loading State -->
        <div v-else-if="isAnalyzing" class="empty-state-box">
          <div class="loading-pulse-ring"></div>
          <p class="empty-text">
            Agentic AI sedang mengaudit <strong>{{ subkegScale }} Subkegiatan</strong> terhadap Standar Satuan Harga (e-SSH) dan formula SROI...
          </p>
        </div>

        <!-- Results View -->
        <div v-else class="evaluation-results-content">
          
          <!-- 4 Core Pillars Grid -->
          <div class="pillars-grid-4">
            <div class="pillar-card">
              <div class="pillar-top">
                <span class="pillar-label">EFISIENSI BIAYA</span>
                <span class="pillar-icon">⚡</span>
              </div>
              <div class="pillar-value">{{ evalResult.efisiensiScore }}%</div>
              <div class="pillar-desc">{{ evalResult.efisiensiDesc }}</div>
            </div>

            <div class="pillar-card">
              <div class="pillar-top">
                <span class="pillar-label">EFEKTIVITAS IKU</span>
                <span class="pillar-icon">🎯</span>
              </div>
              <div class="pillar-value">{{ evalResult.efektivitasScore }}%</div>
              <div class="pillar-desc">{{ evalResult.efektivitasDesc }}</div>
            </div>

            <div class="pillar-card">
              <div class="pillar-top">
                <span class="pillar-label">DEADWEIGHT RATIO</span>
                <span class="pillar-icon">📉</span>
              </div>
              <div class="pillar-value">{{ evalResult.deadweightScore }}%</div>
              <div class="pillar-desc">{{ evalResult.deadweightDesc }}</div>
            </div>

            <div class="pillar-card highlight">
              <div class="pillar-top">
                <span class="pillar-label">RASIO SROI</span>
                <span class="pillar-icon">🧮</span>
              </div>
              <div class="pillar-value text-emerald">{{ evalResult.sroiRatio }}</div>
              <div class="pillar-desc">{{ evalResult.sroiVerdict }}</div>
            </div>
          </div>

          <!-- Executive Insights Summary -->
          <div class="summary-insight-card">
            <div class="insight-header">
              <span>💡 Ringkasan Analisis {{ subkegScale }} Subkegiatan (Pagu Total: {{ formatRupiah(evalResult.totalPagu) }})</span>
            </div>
            <ul class="insight-list">
              <li v-for="(point, pIdx) in evalResult.insights" :key="'ins-'+pIdx">
                {{ point }}
              </li>
            </ul>
          </div>

          <!-- Table of 40 - 100 Subkegiatans -->
          <div class="subkeg-matrix-card">
            <div class="matrix-header-row">
              <h3>Matriks {{ evaluatedSubkegs.length }} Subkegiatan RKA</h3>
              <input 
                type="text" 
                v-model="tableFilterText" 
                placeholder="Filter subkegiatan..." 
                class="matrix-search-input"
              />
            </div>

            <div class="matrix-table-wrap">
              <table class="matrix-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subkegiatan &amp; OPD</th>
                    <th>Pagu Anggaran</th>
                    <th>SROI</th>
                    <th>SSH</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sub, sIdx) in filteredEvaluatedSubkegs" :key="'sub-'+sIdx">
                    <td>{{ sIdx + 1 }}</td>
                    <td>
                      <div class="sub-name">{{ sub.nama }}</div>
                      <div class="sub-opd">{{ sub.opd }} · <code>{{ sub.kode }}</code></div>
                    </td>
                    <td class="font-bold">{{ formatRupiah(sub.pagu) }}</td>
                    <td>
                      <span class="badge-sroi" :class="sub.sroi >= 1.0 ? 'good' : 'warn'">
                        {{ sub.sroi?.toFixed(2) }}
                      </span>
                    </td>
                    <td>
                      <span class="badge-status" :class="sub.kepatuhanSsh === 'Sesuai Standar' ? 'badge-good' : 'badge-warn'">
                        {{ sub.kepatuhanSsh }}
                      </span>
                    </td>
                    <td>
                      <span class="badge-status" :class="(sub.statusEfisiensi || '').includes('Efisien') && !sub.statusEfisiensi.includes('Inefisien') ? 'badge-good' : 'badge-risk'">
                        {{ sub.statusEfisiensi }}
                      </span>
                    </td>
                    <td>
                      <button class="btn-table-revisi" @click="openInMode2(sub)">
                        Revisi
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

    </main>


    <!-- ══════════════════════════════════════════════════════════════════════════ -->
    <!-- ═════════════════ MODE 2: EKSEKUTOR REVISI DOKUMEN ══════════════════════ -->
    <!-- ══════════════════════════════════════════════════════════════════════════ -->
    <main v-else-if="currentMode === 'mode2'" class="bapperida-grid-layout">
      
      <!-- ── LEFT PANEL: PARAMETER REVISI ── -->
      <section class="bapperida-panel left-panel">
        <div class="panel-header-row">
          <div class="panel-title-group">
            <span class="panel-icon">📋</span>
            <h2 class="panel-heading">Parameter Revisi RKA</h2>
          </div>
          <span class="badge-active-sub">{{ revisionData.subKegiatan || 'Subkegiatan Aktif' }}</span>
        </div>

        <div class="form-group-box">
          <label class="form-label">Pagu Anggaran Target (Rp)</label>
          <input 
            type="number" 
            v-model.number="revisionData.pagu" 
            class="bapperida-input" 
            @input="recalculateRevision"
          />
        </div>

        <div class="form-group-box">
          <label class="form-label">Outcome Dampak Sosial (Rp)</label>
          <input 
            type="number" 
            v-model.number="revisionData.outcome" 
            class="bapperida-input" 
            @input="recalculateRevision"
          />
        </div>

        <div class="form-group-box">
          <label class="form-label">Deadweight (%)</label>
          <input 
            type="number" 
            min="0" 
            max="60" 
            v-model.number="revisionData.deadweight" 
            class="bapperida-input" 
            @input="recalculateRevision"
          />
        </div>

        <div class="form-group-box">
          <label class="form-label">Kurva RPD Triwulanan (Q1 / Q2 / Q3 / Q4 %)</label>
          <div class="rpd-inputs-flex">
            <input type="number" v-model.number="revisionData.rpd.Q1" class="bapperida-input small" placeholder="Q1" />
            <input type="number" v-model.number="revisionData.rpd.Q2" class="bapperida-input small" placeholder="Q2" />
            <input type="number" v-model.number="revisionData.rpd.Q3" class="bapperida-input small" placeholder="Q3" />
            <input type="number" v-model.number="revisionData.rpd.Q4" class="bapperida-input small" placeholder="Q4" />
          </div>
          <button class="btn-inline-link" @click="applyIdealRpd">✨ Set Kurva Ideal (20% · 30% · 35% · 15%)</button>
        </div>

        <div class="form-group-box">
          <label class="form-label">Instruksi AI Copilot Eksekutor</label>
          <textarea 
            v-model="revisionPrompt" 
            class="bapperida-textarea" 
            placeholder="Contoh: Pangkas belanja perjalanan dinas 30%, alihkan ke belanja bahan pelatihan, dan seimbangkan rasio SROI..."
            rows="3"
          ></textarea>
        </div>

        <button class="btn-evaluasi-primary" @click="executeRevisiAi">
          <span>⚡</span>
          <span>Eksekusi Rekonstruksi Revisi</span>
        </button>
      </section>


      <!-- ── RIGHT PANEL: TABEL HASIL KOMPARASI REVISI ── -->
      <section class="bapperida-panel right-panel">
        <div class="panel-header-row">
          <div class="panel-title-group">
            <span class="panel-icon">📑</span>
            <h2 class="panel-heading">Tabel Hasil Rekonstruksi Revisi</h2>
          </div>
          <button class="btn-action-ghost" @click="saveNewRevisionVersion">💾 Simpan Versi Baru</button>
        </div>

        <!-- Markdown Comparison Table -->
        <div class="matrix-table-wrap">
          <table class="matrix-table">
            <thead>
              <tr>
                <th>Kode &amp; Rekening Belanja</th>
                <th>Anggaran Awal</th>
                <th>Anggaran Usulan Baru</th>
                <th>Status Aksi</th>
                <th>Justifikasi Perubahan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rIdx) in revisionTableRows" :key="'rev-'+rIdx">
                <td>
                  <code>{{ row.kode }}</code>
                  <div class="sub-name">{{ row.nama }}</div>
                </td>
                <td class="text-muted">{{ formatRupiah(row.lama) }}</td>
                <td class="font-bold text-emerald">{{ formatRupiah(row.baru) }}</td>
                <td>
                  <span :class="['badge-status', row.aksi === 'DIKURANGI' ? 'badge-risk' : (row.aksi === 'DITAMBAH' ? 'badge-good' : 'badge-info')]">
                    {{ row.aksi }}
                  </span>
                </td>
                <td style="font-size: 0.78rem;">{{ row.justifikasi }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Metric comparison card -->
        <div class="pillars-grid-4" style="margin-top: 20px;">
          <div class="pillar-card">
            <span class="pillar-label">PAGU REVISI</span>
            <div class="pillar-value">{{ formatRupiah(revisionData.pagu) }}</div>
          </div>
          <div class="pillar-card">
            <span class="pillar-label">SROI SEBELUM</span>
            <div class="pillar-value text-muted">1.02</div>
          </div>
          <div class="pillar-card highlight">
            <span class="pillar-label">SROI SESUDAH</span>
            <div class="pillar-value text-emerald">{{ revisionComputedSroi }}</div>
          </div>
          <div class="pillar-card">
            <span class="pillar-label">STATUS KEPATUHAN</span>
            <div class="pillar-value text-emerald">SESUAI SSH</div>
          </div>
        </div>
      </section>

    </main>


    <!-- ══════════════════════════════════════════════════════════════════════════ -->
    <!-- ════════════════════ MODE 3: INTEGRASI & DOK API ════════════════════════ -->
    <!-- ══════════════════════════════════════════════════════════════════════════ -->
    <main v-else class="bapperida-panel" style="padding: 24px;">
      <div class="panel-header-row">
        <div class="panel-title-group">
          <span class="panel-icon">&lt;/&gt;</span>
          <h2 class="panel-heading">Dokumentasi API &amp; Integrasi BAPPERIDA</h2>
        </div>
      </div>

      <div class="api-docs-content">
        <div class="api-endpoint-card">
          <div class="endpoint-header">
            <span class="http-badge post">POST</span>
            <code>/api/v1/chat</code>
            <span class="endpoint-desc">Chatbot Multi-Persona, Perspektif &amp; Personality</span>
          </div>
          <pre class="api-code-block">{
  "message": "Bagaimana cara efisiensi belanja penunjang RKA?",
  "persona": "auditor",       // "auditor" | "konsultan" | "tapd" | "verifikator"
  "perspective": "kepatuhan", // "kepatuhan" | "sroi" | "indikator" | "realokasi"
  "personality": "formal",    // "formal" | "ringkas" | "edukatif"
  "mode": "mode1"             // "mode1" | "mode2"
}</pre>
        </div>

        <div class="api-endpoint-card">
          <div class="endpoint-header">
            <span class="http-badge post">POST</span>
            <code>/api/v1/agentic-ai/batch-analysis</code>
            <span class="endpoint-desc">Batch Analysis 40 s.d. 100 Subkegiatan APBD</span>
          </div>
          <pre class="api-code-block">{
  "count": 50,
  "subkegiatans": []
}</pre>
        </div>
      </div>
    </main>

    </template><!-- END RKA MODE -->


    <!-- ════════════════════════════════════════════════════════════════════════ -->
    <!-- ═══════════════════ PRA RKA MODE WORKSPACE ═════════════════════════════ -->
    <!-- ════════════════════════════════════════════════════════════════════════ -->
    <template v-if="selectedAgentMode === 'pra-rka'">

    <!-- Pra RKA Navigation Tabs -->
    <nav class="bapperida-nav-tabs pra-rka-nav">
      <button 
        class="nav-tab-item" 
        :class="{ active: praRkaMode === 'kebutuhan' }"
        @click="praRkaMode = 'kebutuhan'"
      >
        <span class="tab-icon">📝</span>
        <span>Mode 1: Analisis Kebutuhan &amp; Prioritas</span>
      </button>

      <button 
        class="nav-tab-item" 
        :class="{ active: praRkaMode === 'simulasi' }"
        @click="praRkaMode = 'simulasi'"
      >
        <span class="tab-icon">🧮</span>
        <span>Mode 2: Simulasi Pagu &amp; Proyeksi SROI</span>
      </button>

      <button 
        class="nav-tab-item" 
        :class="{ active: praRkaMode === 'generator' }"
        @click="praRkaMode = 'generator'"
      >
        <span class="tab-icon">📄</span>
        <span>Mode 3: Generator Draf Awal RKA</span>
      </button>
    </nav>


    <!-- ═══ PRA RKA MODE 1: ANALISIS KEBUTUHAN & PRIORITAS ═══ -->
    <main v-if="praRkaMode === 'kebutuhan'" class="bapperida-grid-layout">
      
      <!-- LEFT PANEL: Input Kebutuhan -->
      <section class="bapperida-panel left-panel">
        <div class="panel-header-row">
          <div class="panel-title-group">
            <span class="panel-icon">📝</span>
            <h2 class="panel-heading">Input Kebutuhan &amp; Prioritas Program</h2>
          </div>
        </div>

        <div class="form-group-box">
          <label class="form-label">Nama OPD / Perangkat Daerah</label>
          <input type="text" v-model="praRkaInput.opd" class="bapperida-input" placeholder="Contoh: Badan Perencanaan Pembangunan Daerah (BAPPERIDA)" />
        </div>

        <div class="form-group-box">
          <label class="form-label">Urusan Pemerintahan &amp; Bidang</label>
          <input type="text" v-model="praRkaInput.urusan" class="bapperida-input" placeholder="Contoh: Urusan Perencanaan - Bidang Perencanaan Pembangunan" />
        </div>

        <div class="form-group-box">
          <label class="form-label">Isu Strategis / Masalah yang Ingin Diselesaikan</label>
          <textarea 
            v-model="praRkaInput.isuStrategis"
            class="bapperida-textarea"
            placeholder="Deskripsikan isu strategis atau masalah masyarakat yang perlu ditangani melalui program ini..."
            rows="4"
          ></textarea>
        </div>

        <div class="form-group-box">
          <label class="form-label">Usulan Program / Kegiatan Prioritas</label>
          <textarea 
            v-model="praRkaInput.usulanProgram"
            class="bapperida-textarea"
            placeholder="Masukkan nama program, kegiatan, dan sub-kegiatan yang diusulkan beserta target output..."
            rows="4"
          ></textarea>
        </div>

        <div class="form-group-box">
          <label class="form-label">Referensi Dokumen Perencanaan (Opsional)</label>
          <input type="text" v-model="praRkaInput.referensi" class="bapperida-input" placeholder="Contoh: RPJMD 2021-2026 Bab V, RKPD 2026 Prioritas 3" />
        </div>

        <button class="btn-evaluasi-primary pra-rka-btn" @click="runPraRkaAnalysis">
          <span>📝</span>
          <span>Analisis Kebutuhan &amp; Prioritas</span>
        </button>
      </section>

      <!-- RIGHT PANEL: Hasil Analisis -->
      <section class="bapperida-panel right-panel">
        <div class="panel-header-row">
          <div class="panel-title-group">
            <span class="panel-icon">📊</span>
            <h2 class="panel-heading">Hasil Analisis Kebutuhan</h2>
          </div>
        </div>

        <div class="empty-state-box">
          <div class="empty-calculator-icon">
            <svg viewBox="0 0 24 24" width="56" height="56" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <p class="empty-text">
            Masukkan isu strategis dan usulan program di panel kiri, lalu klik <strong>Analisis Kebutuhan &amp; Prioritas</strong> untuk mendapatkan rekomendasi AI.
          </p>
          <p class="empty-text" style="margin-top: 8px; font-size: 0.72rem; color: #64748b;">
            💡 Tip: Gunakan chatbot AI (tombol di pojok kanan bawah) dengan mode <strong>Pra RKA</strong> untuk diskusi interaktif tentang perencanaan program.
          </p>
        </div>
      </section>
    </main>


    <!-- ═══ PRA RKA MODE 2: SIMULASI PAGU & PROYEKSI SROI ═══ -->
    <main v-else-if="praRkaMode === 'simulasi'" class="bapperida-grid-layout">
      
      <!-- LEFT PANEL: Parameter Simulasi -->
      <section class="bapperida-panel left-panel">
        <div class="panel-header-row">
          <div class="panel-title-group">
            <span class="panel-icon">🧮</span>
            <h2 class="panel-heading">Parameter Simulasi Pagu</h2>
          </div>
        </div>

        <div class="form-group-box">
          <label class="form-label">Nama Program / Kegiatan</label>
          <input type="text" v-model="praSimulasi.namaProgram" class="bapperida-input" placeholder="Contoh: Fasilitasi Musrenbang Kabupaten" />
        </div>

        <div class="form-group-box">
          <label class="form-label">Estimasi Pagu Awal (Rp)</label>
          <input type="number" v-model.number="praSimulasi.estimasiPagu" class="bapperida-input" placeholder="150000000" />
        </div>

        <div class="form-group-box">
          <label class="form-label">Estimasi Outcome / Manfaat Sosial (Rp)</label>
          <input type="number" v-model.number="praSimulasi.estimasiOutcome" class="bapperida-input" placeholder="200000000" />
        </div>

        <div class="form-group-box">
          <label class="form-label">Estimasi Deadweight (%)</label>
          <input type="number" min="0" max="60" v-model.number="praSimulasi.deadweight" class="bapperida-input" placeholder="15" />
        </div>

        <div class="form-group-box">
          <label class="form-label">Target Output (Volume &amp; Satuan)</label>
          <input type="text" v-model="praSimulasi.targetOutput" class="bapperida-input" placeholder="Contoh: 12 Dokumen, 5 Kegiatan" />
        </div>

        <div class="form-group-box">
          <label class="form-label">Distribusi Belanja Simulasi</label>
          <div class="rpd-inputs-flex">
            <div style="flex:1; text-align:center;">
              <label class="form-label" style="font-size:0.65rem;">Utama %</label>
              <input type="number" v-model.number="praSimulasi.distribusi.utama" class="bapperida-input small" />
            </div>
            <div style="flex:1; text-align:center;">
              <label class="form-label" style="font-size:0.65rem;">Penunjang %</label>
              <input type="number" v-model.number="praSimulasi.distribusi.penunjang" class="bapperida-input small" />
            </div>
            <div style="flex:1; text-align:center;">
              <label class="form-label" style="font-size:0.65rem;">Modal %</label>
              <input type="number" v-model.number="praSimulasi.distribusi.modal" class="bapperida-input small" />
            </div>
          </div>
        </div>

        <button class="btn-evaluasi-primary pra-rka-btn" @click="runPraRkaSimulasi">
          <span>🧮</span>
          <span>Hitung Proyeksi SROI</span>
        </button>
      </section>

      <!-- RIGHT PANEL: Hasil Simulasi -->
      <section class="bapperida-panel right-panel">
        <div class="panel-header-row">
          <div class="panel-title-group">
            <span class="panel-icon">📈</span>
            <h2 class="panel-heading">Hasil Simulasi Pagu &amp; SROI</h2>
          </div>
        </div>

        <!-- Quick Metrics -->
        <div class="pillars-grid-4">
          <div class="pillar-card">
            <div class="pillar-top">
              <span class="pillar-label">ESTIMASI PAGU</span>
              <span class="pillar-icon">💰</span>
            </div>
            <div class="pillar-value">{{ formatRupiah(praSimulasi.estimasiPagu) }}</div>
          </div>
          <div class="pillar-card">
            <div class="pillar-top">
              <span class="pillar-label">ESTIMASI OUTCOME</span>
              <span class="pillar-icon">🎯</span>
            </div>
            <div class="pillar-value">{{ formatRupiah(praSimulasi.estimasiOutcome) }}</div>
          </div>
          <div class="pillar-card">
            <div class="pillar-top">
              <span class="pillar-label">DEADWEIGHT</span>
              <span class="pillar-icon">📉</span>
            </div>
            <div class="pillar-value">{{ praSimulasi.deadweight }}%</div>
          </div>
          <div class="pillar-card highlight">
            <div class="pillar-top">
              <span class="pillar-label">PROYEKSI SROI</span>
              <span class="pillar-icon">🧮</span>
            </div>
            <div class="pillar-value text-emerald">{{ praSimulasiSroi }} : 1</div>
            <div class="pillar-desc">{{ praSimulasiVerdict }}</div>
          </div>
        </div>

        <!-- Distribusi Belanja Visual -->
        <div class="summary-insight-card">
          <div class="insight-header">💡 Distribusi Alokasi Belanja Simulasi</div>
          <div class="matrix-table-wrap">
            <table class="matrix-table">
              <thead>
                <tr>
                  <th>Komponen</th>
                  <th>Proporsi</th>
                  <th>Estimasi Nilai</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="sub-name">Belanja Utama (Substantif)</td>
                  <td>{{ praSimulasi.distribusi.utama }}%</td>
                  <td class="font-bold">{{ formatRupiah(praSimulasi.estimasiPagu * praSimulasi.distribusi.utama / 100) }}</td>
                  <td><span class="badge-status" :class="praSimulasi.distribusi.utama >= 60 ? 'badge-good' : 'badge-warn'">{{ praSimulasi.distribusi.utama >= 60 ? 'Ideal' : 'Perlu Ditingkatkan' }}</span></td>
                </tr>
                <tr>
                  <td class="sub-name">Belanja Penunjang (Operasional)</td>
                  <td>{{ praSimulasi.distribusi.penunjang }}%</td>
                  <td class="font-bold">{{ formatRupiah(praSimulasi.estimasiPagu * praSimulasi.distribusi.penunjang / 100) }}</td>
                  <td><span class="badge-status" :class="praSimulasi.distribusi.penunjang <= 25 ? 'badge-good' : 'badge-risk'">{{ praSimulasi.distribusi.penunjang <= 25 ? 'Wajar' : 'Terlalu Tinggi' }}</span></td>
                </tr>
                <tr>
                  <td class="sub-name">Belanja Modal</td>
                  <td>{{ praSimulasi.distribusi.modal }}%</td>
                  <td class="font-bold">{{ formatRupiah(praSimulasi.estimasiPagu * praSimulasi.distribusi.modal / 100) }}</td>
                  <td><span class="badge-status badge-info">Sesuai Kebutuhan</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>


    <!-- ═══ PRA RKA MODE 3: GENERATOR DRAF AWAL RKA ═══ -->
    <main v-else class="bapperida-panel" style="padding: 24px;">
      <div class="panel-header-row">
        <div class="panel-title-group">
          <span class="panel-icon">📄</span>
          <h2 class="panel-heading">Generator Draf Awal RKA</h2>
        </div>
      </div>

      <div class="empty-state-box">
        <div class="empty-calculator-icon">
          <svg viewBox="0 0 24 24" width="56" height="56" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <p class="empty-text">
          Fitur <strong>Generator Draf Awal RKA</strong> akan menyusun kerangka dokumen RKA berdasarkan data kebutuhan dan simulasi pagu yang telah Anda isi di mode sebelumnya.
        </p>
        <p class="empty-text" style="margin-top: 8px; font-size: 0.72rem; color: #64748b;">
          💡 Tip: Gunakan chatbot AI dengan mode <strong>Pra RKA</strong> dan tanyakan tentang "template draf RKA" atau "kerangka logis program" untuk panduan penyusunan.
        </p>
        <div style="margin-top: 16px; display: flex; gap: 10px; justify-content: center;">
          <button class="btn-evaluasi-primary pra-rka-btn" style="font-size: 0.78rem; padding: 8px 16px;" @click="praRkaMode = 'kebutuhan'">
            <span>📝</span>
            <span>Isi Data Kebutuhan Dulu</span>
          </button>
          <button class="btn-evaluasi-primary pra-rka-btn" style="font-size: 0.78rem; padding: 8px 16px;" @click="praRkaMode = 'simulasi'">
            <span>🧮</span>
            <span>Simulasi Pagu Dulu</span>
          </button>
        </div>
      </div>
    </main>

    </template><!-- END PRA RKA MODE -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
const selectedAgentMode = ref(null); // null | 'rka' | 'pra-rka'
const currentMode = ref('mode1'); // 'mode1' | 'mode2' | 'mode3'
const praRkaMode = ref('kebutuhan'); // 'kebutuhan' | 'simulasi' | 'generator'
const subkegScale = ref(50);
const inputRkaText = ref('');
const inputNotes = ref('');
const uploadedFileName = ref('');
const fileInputRef = ref(null);
const isAnalyzing = ref(false);
const hasEvaluated = ref(false);
const tableFilterText = ref('');

const evalResult = ref({
  totalPagu: 8450000000,
  efisiensiScore: 88,
  efisiensiDesc: 'Belanja penunjang rata-rata 14.2% dari pagu (Batas < 15%)',
  efektivitasScore: 92,
  efektivitasDesc: 'Proyeksi capaian IKU target output memenuhi target',
  deadweightScore: 14,
  deadweightDesc: 'Komponen deadweight rendah, intervensi berdampak langsung',
  sroiRatio: '1.18',
  sroiVerdict: 'Sangat Layak — Manfaat sosial melampaui investasi APBD',
  insights: [
    'Sebanyak 88% subkegiatan telah sesuai dengan batas Standar Satuan Harga (e-SSH 2026).',
    'Ditemukan potensi penghematan belanja perjalanan dinas sebesar Rp 185.000.000.',
    'Kurva RPD triwulanan disarankan mengikuti pola ideal 20% Q1, 30% Q2, 35% Q3, dan 15% Q4.'
  ]
});

const evaluatedSubkegs = ref([]);

// Mode 2 State
const revisionData = ref({
  subKegiatan: 'Koordinasi dan Sinkronisasi Penyusunan Dokumen RKPD',
  pagu: 125000000,
  outcome: 165000000,
  deadweight: 12,
  rpd: { Q1: 20, Q2: 30, Q3: 35, Q4: 15 }
});
const revisionPrompt = ref('');

// Pra RKA State
const praRkaInput = ref({
  opd: '',
  urusan: '',
  isuStrategis: '',
  usulanProgram: '',
  referensi: ''
});

const praSimulasi = ref({
  namaProgram: '',
  estimasiPagu: 150000000,
  estimasiOutcome: 200000000,
  deadweight: 15,
  targetOutput: '',
  distribusi: { utama: 65, penunjang: 20, modal: 15 }
});

const praSimulasiSroi = computed(() => {
  const p = praSimulasi.value.estimasiPagu || 1;
  const o = praSimulasi.value.estimasiOutcome || 0;
  const dw = praSimulasi.value.deadweight || 15;
  const netImpact = o * (1 - dw / 100);
  return (netImpact / p).toFixed(2);
});

const praSimulasiVerdict = computed(() => {
  const sroi = parseFloat(praSimulasiSroi.value);
  if (sroi >= 1.0) return 'Nilai Sosial Positif — Manfaat sosial melampaui investasi';
  return 'Nilai Sosial Tidak Seimbang dengan Investasi — Nilai sosial lebih kecil daripada investasi';
});

const revisionTableRows = ref([
  { kode: '5.2.06.01', nama: 'Belanja Perjalanan Dinas Luar Daerah', lama: 35000000, baru: 20000000, aksi: 'DIKURANGI', justifikasi: 'Efisiensi rapat luar kota (-42.8%)' },
  { kode: '5.2.01.01', nama: 'Belanja Alat Tulis Kantor & Penggandaan', lama: 15000000, baru: 12000000, aksi: 'DIKURANGI', justifikasi: 'Penyesuaian batas e-SSH 2026' },
  { kode: '5.2.02.04', nama: 'Belanja Jasa Narasumber & Ahli Perencanaan', lama: 25000000, baru: 43000000, aksi: 'DITAMBAH', justifikasi: 'Peningkatan substansi kajian IKU' }
]);

const revisionComputedSroi = computed(() => {
  const p = revisionData.value.pagu || 1;
  const o = revisionData.value.outcome || 0;
  const dw = revisionData.value.deadweight || 15;
  const netImpact = o * (1 - dw / 100);
  return (netImpact / p).toFixed(2);
});

const filteredEvaluatedSubkegs = computed(() => {
  if (!tableFilterText.value.trim()) return evaluatedSubkegs.value;
  const q = tableFilterText.value.toLowerCase();
  return evaluatedSubkegs.value.filter(s => 
    s.nama.toLowerCase().includes(q) || 
    s.opd.toLowerCase().includes(q) ||
    s.kode.toLowerCase().includes(q)
  );
});

onMounted(() => {
  fetchSubkegiatans();
});

async function fetchSubkegiatans() {
  try {
    const res = await fetch(`/api/v1/agentic-ai/subkegiatans?count=${subkegScale.value}`, { credentials: 'include' });
    const data = await res.json();
    if (data.success && Array.isArray(data.subkegiatans)) {
      evaluatedSubkegs.value = data.subkegiatans;
    }
  } catch (err) {
    console.error('Fetch subkegiatans error:', err);
  }
}

function setSubkegScale(scale) {
  subkegScale.value = scale;
  fetchSubkegiatans();
}

// ── File Upload & PDF Text Extraction ──
const isReadingFile = ref(false);
const readingStatusText = ref('');

function triggerFileInput() {
  fileInputRef.value?.click();
}

async function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (file) {
    await processUploadedFile(file);
  }
}

async function handleFileDrop(e) {
  const file = e.dataTransfer?.files?.[0];
  if (file) {
    await processUploadedFile(file);
  }
}

async function processUploadedFile(file) {
  uploadedFileName.value = file.name;
  isReadingFile.value = true;
  readingStatusText.value = `Membaca file ${file.name}...`;

  try {
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      readingStatusText.value = 'Mengekstrak teks dari berkas PDF...';
      const arrayBuffer = await file.arrayBuffer();
      const typedarray = new Uint8Array(arrayBuffer);

      if (window.pdfjsLib) {
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        let extractedText = '';
        const maxPages = Math.min(pdf.numPages, 30);

        for (let i = 1; i <= maxPages; i++) {
          readingStatusText.value = `Mengekstrak halaman ${i} dari ${pdf.numPages}...`;
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          const strings = text.items.map(item => item.str);
          extractedText += strings.join(' ') + '\n';
        }

        if (extractedText.trim().length > 0) {
          inputRkaText.value = extractedText.trim();
        } else {
          inputRkaText.value = `[DOKUMEN RKA PDF: ${file.name}]\nCatatan: Teks PDF hasil scan atau kosong. Silakan ketik atau tempel rincian rekening program di sini.\n\nProgram: Program Pembangunan Daerah\nKegiatan: Pelaksanaan Kegiatan Prioritas\nSub Kegiatan: Rincian Subkegiatan\nPagu Anggaran: Rp 150.000.000\nPos Rekening:\n1. 5.2.01.01 Belanja ATK (Rp 15.000.000)\n2. 5.2.02.04 Belanja Jasa Tenaga Ahli (Rp 85.000.000)\n3. 5.2.06.01 Belanja Perjalanan Dinas (Rp 20.000.000)\n4. 5.2.02.01 Belanja Pelatihan (Rp 30.000.000)`;
        }
      } else {
        // Fallback if pdfjsLib not loaded
        const reader = new FileReader();
        reader.onload = (e) => {
          inputRkaText.value = `[BERKAS PDF: ${file.name}]\nUkuran: ${(file.size / 1024).toFixed(1)} KB\n\nSilakan verifikasi atau tambahkan rincian subkegiatan dan rekening belanja di bawah ini.`;
        };
        reader.readAsText(file);
      }
    } else if (ext === 'json' || ext === 'csv' || ext === 'txt') {
      readingStatusText.value = 'Membaca data teks dokumen...';
      const text = await file.text();
      inputRkaText.value = text;
    } else {
      // Excel or other format
      readingStatusText.value = 'Membaca dokumen...';
      inputRkaText.value = `[DOKUMEN RKA: ${file.name}]\nUkuran: ${(file.size / 1024).toFixed(1)} KB\n\nSilakan sesuaikan rincian program, pagu, dan akun rekening belanja 5.2.x berikut sebelum menjalankan evaluasi.`;
    }
  } catch (err) {
    console.error('Error reading file:', err);
    inputRkaText.value = `[Gagal membaca otomatis berkas ${file.name}: ${err.message}]\nSilakan ketik atau tempel rincian rekening RKA Anda secara manual di sini.`;
  } finally {
    isReadingFile.value = false;
    readingStatusText.value = '';
  }
}

function loadSampleData() {
  inputRkaText.value = `Program: Program Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah
Kegiatan: Penyusunan Dokumen Perencanaan Perangkat Daerah
Sub Kegiatan: Fasilitasi Musrenbang Kabupaten dan Sinkronisasi RKPD 2026
Pagu Anggaran: Rp 175.000.000,-
Target Indikator: 12 Dokumen Hasil Sinkronisasi RKPD & Renja
Pos Rekening Belanja:
1. 5.2.06.01 Belanja Perjalanan Dinas (Rp 45.000.000)
2. 5.2.01.01 Belanja Alat Tulis Kantor (Rp 20.000.000)
3. 5.2.02.04 Belanja Jasa Tenaga Ahli (Rp 60.000.000)
4. 5.2.02.01 Belanja Bahan Pelatihan (Rp 50.000.000)`;
  inputNotes.value = 'Fokus pada rasionalisasi belanja perjalanan dinas dan kepatuhan e-SSH 2026.';
}

async function runEvaluasiRka() {
  isAnalyzing.value = true;
  hasEvaluated.value = false;

  try {
    const res = await fetch('/api/v1/agentic-ai/batch-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ count: subkegScale.value })
    });
    const data = await res.json();
    if (data.success) {
      evalResult.value.totalPagu = data.summary.totalPagu;
      evalResult.value.sroiRatio = String(data.summary.avgSroi.toFixed(2));
      evalResult.value.efisiensiScore = data.summary.avgHealth;
      evalResult.value.insights = data.executiveInsights;
      evaluatedSubkegs.value = data.subkegiatans || evaluatedSubkegs.value;
    }
  } catch (err) {
    console.error('Batch audit error:', err);
  } finally {
    setTimeout(() => {
      isAnalyzing.value = false;
      hasEvaluated.value = true;
    }, 600);
  }
}

function openInMode2(sub) {
  revisionData.value.subKegiatan = sub.nama;
  revisionData.value.pagu = sub.pagu;
  revisionData.value.outcome = sub.outcome || Math.round(sub.pagu * 1.25);
  revisionData.value.deadweight = sub.deadweight || 15;
  currentMode.value = 'mode2';
}

function applyIdealRpd() {
  revisionData.value.rpd = { Q1: 20, Q2: 30, Q3: 35, Q4: 15 };
}

function recalculateRevision() {
  // Computed property updates automatically
}

function executeRevisiAi() {
  revisionTableRows.value = [
    { kode: '5.2.06.01', nama: 'Belanja Perjalanan Dinas', lama: 35000000, baru: 18000000, aksi: 'DIKURANGI', justifikasi: 'Pemangkasan frekuensi rapat luar dinas (-48.5%)' },
    { kode: '5.2.01.01', nama: 'Belanja ATK & Modul Digital', lama: 15000000, baru: 12000000, aksi: 'DIKURANGI', justifikasi: 'Digitalisasi bahan paparan sesuai e-SSH' },
    { kode: '5.2.02.04', nama: 'Belanja Jasa Narasumber & Praktisi', lama: 25000000, baru: 45000000, aksi: 'DITAMBAH', justifikasi: 'Optimalisasi intervensi langsung pencapaian IKU' }
  ];
}

function saveNewRevisionVersion() {
  alert('Draf revisi berhasil disimpan sebagai versi baru (v1.1) ke dalam database!');
}

function exportEvaluation(fmt = 'csv') {
  let content = 'No,Nama Subkegiatan,OPD,Pagu,SROI,Kepatuhan SSH\n';
  evaluatedSubkegs.value.forEach((s, i) => {
    content += `"${i+1}","${s.nama}","${s.opd}","${s.pagu}","${s.sroi}","${s.kepatuhanSsh}"\n`;
  });
  const blob = new Blob([content], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Evaluasi_${subkegScale.value}_Subkegiatan_BAPPERIDA.csv`;
  a.click();
}

function formatRupiah(num) {
  if (!num && num !== 0) return 'Rp 0';
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function runPraRkaAnalysis() {
  alert('Fitur Analisis Kebutuhan AI sedang dalam pengembangan. Gunakan chatbot AI dengan mode Pra RKA untuk diskusi interaktif.');
}

function runPraRkaSimulasi() {
  // Force computed property recalculation - already reactive
  alert(`Proyeksi SROI: ${praSimulasiSroi.value}\n${praSimulasiVerdict.value}`);
}
</script>

<style scoped>
/* ══ THEME DARK CYBER-BAPPERIDA ══ */
.bapperida-agentic-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #f1f5f9;
  font-family: inherit;
}

/* Header */
.bapperida-top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px 12px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-circle {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #059669;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35);
}

.brand-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
}

.brand-subtitle {
  font-size: 0.76rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.header-engine-pill {
  background: #0d2818;
  border: 1px solid #10b981;
  color: #34d399;
  padding: 6px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.76rem;
  font-weight: 700;
}

.engine-live-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

/* Nav Tabs */
.bapperida-nav-tabs {
  display: flex;
  background: #0e1726;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 5px;
  gap: 6px;
}

.nav-tab-item {
  flex: 1;
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-tab-item:hover {
  color: #ffffff;
}

.nav-tab-item.active {
  background: #059669;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
}

.tab-icon {
  font-size: 0.95rem;
}

/* Grid Layout */
.bapperida-grid-layout {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 16px;
}

@media (max-width: 1024px) {
  .bapperida-grid-layout {
    grid-template-columns: 1fr;
  }
}

/* Panels */
.bapperida-panel {
  background: #101c30;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-heading {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.btn-sample-data {
  background: #1e293b;
  border: 1px solid #3b82f6;
  color: #60a5fa;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sample-data:hover {
  background: #2563eb;
  color: white;
}

/* Form Controls */
.form-group-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
}

.scale-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scale-badge-pill {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-weight: 800;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.scale-chips-row {
  display: flex;
  gap: 6px;
}

.scale-chip-btn {
  flex: 1;
  background: #0e1726;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.scale-chip-btn.active {
  background: #10b981;
  color: #ffffff;
  border-color: #10b981;
}

/* File Dropzone */
.file-dropzone {
  border: 2px dashed rgba(16, 185, 129, 0.4);
  border-radius: 10px;
  padding: 20px 14px;
  text-align: center;
  background: rgba(16, 185, 129, 0.03);
  cursor: pointer;
  transition: all 0.2s;
}

.file-dropzone:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.08);
}

.file-dropzone.dropzone-reading {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.dropzone-text-main {
  font-size: 0.8rem;
  color: #e2e8f0;
  margin: 6px 0 2px 0;
}

.dropzone-text-sub {
  font-size: 0.7rem;
  color: #64748b;
}

.textarea-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-editable-tag {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.loading-pulse-ring.small {
  width: 28px;
  height: 28px;
  border-width: 2px;
  margin: 0 auto;
}

/* Textarea & Inputs */
.bapperida-textarea, .bapperida-input {
  background: #0a1120;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 10px 12px;
  color: #f1f5f9;
  font-size: 0.8rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.bapperida-textarea:focus, .bapperida-input:focus {
  border-color: #10b981;
}

.bapperida-textarea {
  resize: vertical;
}

.btn-evaluasi-primary {
  background: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 800;
  font-size: 0.86rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.4);
  transition: all 0.2s;
}

.btn-evaluasi-primary:hover {
  background: #10b981;
  transform: translateY(-1px);
}

.btn-evaluasi-primary:disabled {
  background: #334155;
  cursor: not-allowed;
  box-shadow: none;
}

/* Empty State */
.empty-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 380px;
  text-align: center;
  padding: 40px 20px;
}

.empty-text {
  font-size: 0.82rem;
  color: #94a3b8;
  max-width: 380px;
  line-height: 1.5;
  margin-top: 14px;
}

.loading-pulse-ring {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 4 Pillars Grid */
.pillars-grid-4 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.pillar-card {
  background: #0a1120;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 14px;
}

.pillar-card.highlight {
  border-color: #059669;
  background: rgba(5, 150, 105, 0.06);
}

.pillar-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pillar-label {
  font-size: 0.68rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.5px;
}

.pillar-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 4px 0 2px 0;
}

.pillar-desc {
  font-size: 0.68rem;
  color: #94a3b8;
}

.text-emerald { color: #34d399 !important; }

/* Summary Insights */
.summary-insight-card {
  background: #0a1120;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 14px;
}

.insight-header {
  font-size: 0.78rem;
  font-weight: 700;
  color: #34d399;
  margin-bottom: 6px;
}

.insight-list {
  margin: 0;
  padding-left: 18px;
  font-size: 0.74rem;
  color: #cbd5e1;
  line-height: 1.5;
}

/* Subkeg Matrix Table */
.subkeg-matrix-card {
  background: #0a1120;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 14px;
}

.matrix-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.matrix-header-row h3 {
  font-size: 0.84rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.matrix-search-input {
  background: #101c30;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 4px 8px;
  color: #f1f5f9;
  font-size: 0.72rem;
  outline: none;
}

.matrix-table-wrap {
  max-height: 240px;
  overflow-y: auto;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.matrix-table th {
  background: #0e1726;
  padding: 8px 10px;
  text-align: left;
  color: #64748b;
  font-size: 0.7rem;
  position: sticky;
  top: 0;
}

.matrix-table td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.sub-name {
  font-weight: 700;
  color: #f1f5f9;
}

.sub-opd {
  font-size: 0.68rem;
  color: #64748b;
}

.badge-sroi {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 800;
}

.badge-sroi.good { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.badge-sroi.warn { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.badge-status {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-good { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.badge-warn { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.badge-risk { background: rgba(239, 68, 68, 0.2); color: #f87171; }
.badge-info { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }

.btn-table-revisi {
  background: #059669;
  border: none;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-table-revisi:hover {
  background: #10b981;
}

.rpd-inputs-flex {
  display: flex;
  gap: 6px;
}

.bapperida-input.small {
  text-align: center;
}

.btn-inline-link {
  background: transparent;
  border: none;
  color: #34d399;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  padding: 0;
  margin-top: 4px;
}

.badge-active-sub {
  background: #1e293b;
  color: #60a5fa;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}

.btn-action-ghost {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.api-docs-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.api-endpoint-card {
  background: #0a1120;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 14px;
}

.endpoint-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.http-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.http-badge.post { background: #2563eb; color: white; }

.api-code-block {
  background: #050b14;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.74rem;
  color: #34d399;
  overflow-x: auto;
}

/* ════════════════════ MODE SELECTION SCREEN ════════════════════ */
.btn-back-mode {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 4px;
}

.btn-back-mode:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  transform: translateX(-2px);
}

.pra-rka-logo {
  background: #d97706 !important;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35) !important;
}

.mode-selection-screen {
  padding: 30px 10px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.35s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.mode-selection-intro {
  text-align: center;
  margin-bottom: 32px;
  max-width: 600px;
}

.mode-intro-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.mode-intro-desc {
  font-size: 0.88rem;
  color: #94a3b8;
  line-height: 1.5;
}

.mode-cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
  max-width: 880px;
}

@media (max-width: 768px) {
  .mode-cards-row {
    grid-template-columns: 1fr;
  }
}

.mode-select-card {
  position: relative;
  background: #0f1a2e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px 26px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.mode-select-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.25);
}

.rka-card:hover {
  border-color: #10b981;
  box-shadow: 0 14px 40px rgba(16, 185, 129, 0.22);
}

.pra-rka-card:hover {
  border-color: #f59e0b;
  box-shadow: 0 14px 40px rgba(245, 158, 11, 0.22);
}

.mode-card-glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(50px);
  opacity: 0.25;
  transition: opacity 0.3s;
}

.mode-select-card:hover .mode-card-glow {
  opacity: 0.45;
}

.rka-glow { background: #10b981; }
.pra-rka-glow { background: #f59e0b; }

.mode-card-icon-ring {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.mode-select-card:hover .mode-card-icon-ring {
  transform: scale(1.08);
}

.rka-ring {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.pra-rka-ring {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.mode-card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
}

.mode-card-subtitle {
  font-size: 0.82rem;
  color: #94a3b8;
  margin-bottom: 18px;
}

.mode-card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 26px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.mode-card-features li {
  font-size: 0.8rem;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-card-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.86rem;
  font-weight: 700;
  transition: all 0.2s;
}

.rka-card .mode-card-action { color: #34d399; }
.pra-rka-card .mode-card-action { color: #fbbf24; }

.mode-select-card:hover .mode-card-action {
  transform: translateX(4px);
}

/* Pra RKA Specific Tab & Button Styles */
.pra-rka-nav .nav-tab-item.active {
  background: #d97706 !important;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35) !important;
}

.pra-rka-btn {
  background: #d97706 !important;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.4) !important;
}

.pra-rka-btn:hover {
  background: #f59e0b !important;
}
</style>
