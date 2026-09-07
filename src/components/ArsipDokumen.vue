<template>
  <div class="arsip-container">

    <div class="page-header">
      <span class="page-kicker">Arsip Dokumen RKA</span>
      <h2 class="page-title-lg">Arsip Dokumen RKA</h2>
      <p class="page-desc">Kelola seluruh dokumen RKA yang telah diunggah dan dianalisis oleh layanan AI, lengkap dengan riwayat versi dan status.</p>
    </div>

    <!-- Header Card -->
    <div class="card arsip-header-card">
      <div class="card-header" style="flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 class="card-title">
            <i data-lucide="folder-archive" class="icon-inline" style="color: var(--primary-color);"></i>
            Arsip Dokumen RKA Kabupaten Cirebon
          </h2>
          <span class="card-subtitle">Manajemen seluruh dokumen RKA yang telah diunggah dan dianalisis oleh layanan AI</span>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <!-- Sementara disembunyikan: fitur backup/restore .html belum selesai -->
          <button class="btn btn-primary" id="btn-upload-new-arsip" @click="goToUpload">
            <i data-lucide="upload-cloud"></i> Unggah Dokumen Baru
          </button>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="arsip-filter-bar">
        <div style="position: relative; flex: 1; min-width: 200px;">
          <input
            type="text"
            id="arsip-search"
            class="form-input"
            v-model="searchQuery"
            placeholder="Cari nama dokumen, OPD, atau ID..."
            style="padding-left: 38px;"
          >
          <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
        </div>
        <div class="arsip-count-badge">
          <i data-lucide="file-text" style="width: 14px; height: 14px;"></i>
          {{ filteredRkis.length }} Dokumen
        </div>
      </div>

      <!-- Table -->
      <div class="card-body" style="padding: 0;">
        <div class="data-table-container">
          <table class="data-table arsip-table">
            <thead>
              <tr>
                <th>Nama Dokumen</th>
                <th>OPD / Satuan Kerja</th>
                <th style="text-align:center;">Tahun Berjalan</th>
                <th>Tanggal Unggah</th>
                <th style="text-align:center;">SROI</th>
                <th style="text-align:right;">Ukuran File</th>
                <th style="text-align:center;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <!-- Empty state -->
              <tr v-if="filteredRkis.length === 0">
                <td colspan="7" class="arsip-empty-state">
                  <div class="arsip-empty-content">
                    <i data-lucide="folder-open" style="width: 52px; height: 52px; opacity: 0.25; margin-bottom: 16px;"></i>
                    <p v-if="searchQuery">
                      Tidak ada dokumen yang cocok dengan kata kunci pencarian.
                    </p>
                    <p v-else>
                      Belum ada dokumen RKA yang tersimpan dalam arsip.<br>
                      Mulai dengan mengunggah dokumen RKA pertama Anda.
                    </p>
                    <button
                      v-if="!searchQuery"
                      class="btn btn-primary btn-sm"
                      style="margin-top: 16px;"
                      @click="goToUpload"
                    >
                      <i data-lucide="upload-cloud"></i> Unggah Dokumen Pertama
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Data rows -->
              <tr
                v-else
                v-for="item in filteredRkis"
                :key="item.id"
                class="arsip-row"
              >
                <!-- Nama Dokumen -->
                <td class="arsip-td-nama">
                  <div class="arsip-doc-name" style="cursor: pointer; color: var(--primary-color); font-weight: 700;" @click="viewItem(item)" title="Klik untuk membuka hasil analisis SROI">
                    {{ item.namaDokumen || item.program }}
                  </div>
                  <div class="arsip-doc-sub">
                    <span>{{ item.id }} · {{ item.program }}</span>
                    <span v-if="item.versions && item.versions.length > 1" class="badge-ver-count">
                      {{ item.versions.length }} Versi
                    </span>
                  </div>
                </td>

                <!-- OPD -->
                <td class="arsip-td-opd" :title="item.opd">{{ cleanOpdName(item.opd) }}</td>

                <!-- Tahun Berjalan (sesuai dokumen PDF) -->
                <td style="text-align:center; font-weight: 700; font-size: 0.88rem; color: var(--primary-color);">
                  {{ item.tahunRencana || item.tahun || '2026' }}
                </td>

                <!-- Tanggal Unggah -->
                <td class="arsip-td-date">{{ formatDate(item.tanggalUpload) }}</td>

                <!-- SROI Badge (Format Ringkas: [Angka] · [Status]) -->
                <td style="text-align:center;">
                  <span
                    :class="['sroi-badge-pill', getSroiInfo(item).badgeClass]"
                    style="cursor: pointer;"
                    @click="viewItem(item)"
                    :title="'SROI: ' + getSroiInfo(item).scoreText + ' · ' + getSroiInfo(item).fullLabel + ' (Klik untuk melihat detail)'"
                  >
                    <span class="sroi-badge-ratio">{{ getSroiInfo(item).scoreText }}</span>
                    <span class="sroi-badge-sep">·</span>
                    <span class="sroi-badge-label">{{ getSroiInfo(item).label }}</span>
                  </span>
                </td>

                <!-- Ukuran File -->
                <td style="text-align:right; font-size: 0.8rem; color: var(--text-secondary);">
                  {{ formatFileSize(item.ukuranFile) }}
                </td>

                <!-- Aksi -->
                <td style="text-align:center;">
                  <div class="arsip-actions" style="display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap;">
                    <button
                      class="btn btn-primary btn-sm"
                      @click="viewItem(item)"
                      title="Lihat Hasil Analisis SROI"
                      style="display: inline-flex; align-items: center; gap: 4px; font-weight: 600; font-size: 0.78rem; padding: 5px 10px;"
                    >
                      <i data-lucide="eye"></i>
                      <span>Lihat Analisis</span>
                    </button>
                    <button
                      class="btn btn-secondary btn-sm arsip-btn-icon arsip-btn-reupload"
                      @click="openReuploadModal(item)"
                      title="Unggah Ulang PDF & Analisis Ulang (Perbaiki Hasil Analisis)"
                    >
                      <i data-lucide="refresh-cw"></i>
                    </button>
                    <button
                      class="btn btn-secondary btn-sm arsip-btn-icon arsip-btn-agent"
                      @click="openInAgenticAi(item)"
                      title="Buka di Agentic AI Studio (Audit, Koreksi, Versioning)"
                    >
                      <i data-lucide="bot"></i>
                    </button>
                    <button
                      class="btn btn-secondary btn-sm arsip-btn-icon"
                      @click="downloadAnalysisHtmlReport(item)"
                      title="Unduh Hasil Analisis Lengkap"
                    >
                      <i data-lucide="download"></i>
                    </button>
                    <button
                      class="btn btn-secondary btn-sm arsip-btn-icon"
                      @click="openEditModal(item)"
                      title="Edit Metadata"
                    >
                      <i data-lucide="pencil"></i>
                    </button>
                    <button
                      class="arsip-btn-danger"
                      @click="openDeleteModal(item)"
                      title="Hapus Dokumen"
                    >
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===================== MODAL: Delete Confirmation ===================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
          <div class="modal-box">
            <div class="modal-icon-wrap danger">
              <i data-lucide="alert-triangle"></i>
            </div>
            <h3 class="modal-title">Hapus Dokumen?</h3>
            <p class="modal-desc">
              Dokumen
              <strong>{{ deleteTarget?.namaDokumen || deleteTarget?.program }}</strong>
              akan dihapus dari arsip secara permanen.
            </p>
            <p class="modal-warning">Data yang telah dihapus tidak dapat dikembalikan.</p>
            <div class="modal-actions">
              <button class="btn btn-secondary modal-btn" id="btn-cancel-delete" @click="showDeleteModal = false">
                Batal
              </button>
              <button
                class="btn modal-btn modal-btn-danger"
                id="btn-confirm-delete"
                @click="confirmDelete"
              >
                <i data-lucide="trash-2"></i> Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===================== MODAL: Edit Metadata ===================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
          <div class="modal-box modal-wide">
            <h3 class="modal-title" style="text-align:left; margin-bottom: 4px;">
              <i data-lucide="pencil" style="width:18px;height:18px; vertical-align:middle; margin-right:6px; color: var(--primary-color);"></i>
              Edit Metadata Dokumen
            </h3>
            <p class="modal-desc" style="text-align:left; margin-bottom: 20px;">
              Ubah informasi dokumen tanpa mengubah isi file atau hasil analisis AI.
            </p>

            <div class="form-group">
              <label class="form-label" for="modal-nama-dokumen">Nama Dokumen</label>
              <input
                type="text"
                id="modal-nama-dokumen"
                class="form-input"
                v-model="editForm.namaDokumen"
                placeholder="Nama file atau judul dokumen RKA"
              >
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="modal-tahun">Tahun Anggaran</label>
                <input
                  type="number"
                  id="modal-tahun"
                  class="form-input"
                  v-model.number="editForm.tahun"
                  min="2020"
                  max="2035"
                >
              </div>
              <div class="form-group">
                <label class="form-label" for="modal-opd">OPD / Satuan Kerja</label>
                <input
                  type="text"
                  id="modal-opd"
                  class="form-input"
                  v-model="editForm.opd"
                  placeholder="Nama OPD atau SKPD"
                >
              </div>
            </div>

            <div class="modal-actions" style="margin-top: 8px;">
              <button class="btn btn-secondary modal-btn" id="btn-cancel-edit" @click="showEditModal = false">
                Batal
              </button>
              <button class="btn btn-primary modal-btn" id="btn-proceed-save" @click="openSaveConfirmModal">
                <i data-lucide="save"></i> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===================== MODAL: Save Confirmation ===================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showSaveConfirmModal" class="modal-overlay" @click.self="showSaveConfirmModal = false">
          <div class="modal-box">
            <div class="modal-icon-wrap primary">
              <i data-lucide="save"></i>
            </div>
            <h3 class="modal-title">Simpan Perubahan?</h3>
            <p class="modal-desc">Perubahan metadata dokumen akan disimpan ke arsip.</p>
            <div class="modal-actions">
              <button class="btn btn-secondary modal-btn" id="btn-cancel-save" @click="cancelSave">
                Batal
              </button>
              <button class="btn btn-primary modal-btn" id="btn-confirm-save" @click="confirmEdit">
                <i data-lucide="check-circle-2"></i> Simpan
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===================== MODAL: Unggah Ulang & Re-analisis PDF ===================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showReuploadModal" class="modal-overlay" @click.self="handleCloseReuploadModal">
          <div class="modal-box modal-wide">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <div class="modal-icon-wrap primary" style="width: 38px; height: 38px; margin: 0; background: rgba(14, 107, 94, 0.12); color: var(--primary-color);">
                <i data-lucide="refresh-cw"></i>
              </div>
              <div style="text-align: left;">
                <h3 class="modal-title" style="text-align:left; margin: 0; font-size: 1.1rem; color: var(--text-primary);">
                  Unggah Ulang PDF & Analisis Ulang
                </h3>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">
                  Perbaiki analisis yang kurang tepat dengan mengevaluasi ulang berkas PDF dokumen ini
                </span>
              </div>
            </div>

            <!-- Target Doc Summary Box -->
            <div class="reupload-target-card" v-if="reuploadTarget">
              <div class="target-card-row">
                <span class="target-card-label">ID Dokumen:</span>
                <span class="target-card-val bold">{{ reuploadTarget.id }}</span>
              </div>
              <div class="target-card-row">
                <span class="target-card-label">Nama Dokumen:</span>
                <span class="target-card-val" :title="reuploadTarget.namaDokumen || reuploadTarget.program">{{ reuploadTarget.namaDokumen || reuploadTarget.program }}</span>
              </div>
              <div class="target-card-row">
                <span class="target-card-label">OPD / SKPD:</span>
                <span class="target-card-val" :title="reuploadTarget.opd">{{ cleanOpdName(reuploadTarget.opd) }}</span>
              </div>
              <div class="target-card-row">
                <span class="target-card-label">SROI Saat Ini:</span>
                <span class="target-card-val">
                  <span :class="['sroi-badge-pill', getSroiInfo(reuploadTarget).badgeClass]" style="padding: 2px 8px; font-size: 10.5px;">
                    {{ getSroiInfo(reuploadTarget).scoreText }} · {{ getSroiInfo(reuploadTarget).label }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Dropzone Area -->
            <div 
              v-if="!isReanalyzing"
              class="reupload-dropzone" 
              :class="{ 'drag-over': isReuploadDragOver }"
              @dragover.prevent="isReuploadDragOver = true"
              @dragleave.prevent="isReuploadDragOver = false"
              @drop.prevent="handleReuploadDrop"
              @click="triggerReuploadFileInput"
            >
              <input 
                type="file" 
                ref="reuploadFileInput" 
                accept=".pdf,application/pdf" 
                style="display: none;" 
                @change="handleReuploadFileSelect"
              />
              <div v-if="!selectedReuploadFile" class="dropzone-inner">
                <div class="dropzone-icon">
                  <i data-lucide="upload-cloud"></i>
                </div>
                <div class="dropzone-text">
                  <strong>Klik untuk memilih berkas PDF</strong> atau tarik dan lepas berkas di sini
                </div>
                <div class="dropzone-hint">Pilih berkas PDF RKA yang sesuai (Maksimal 25MB)</div>
              </div>
              <div v-else class="selected-file-box" @click.stop>
                <div class="selected-file-info">
                  <i data-lucide="file-text" style="width: 26px; height: 26px; color: var(--primary-color);"></i>
                  <div style="text-align: left;">
                    <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">{{ selectedReuploadFile.name }}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">{{ formatFileSize(selectedReuploadFile.size) }}</div>
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" @click="selectedReuploadFile = null" title="Ganti Berkas">
                  <i data-lucide="x"></i> Ganti
                </button>
              </div>
            </div>

            <!-- Re-analysis Progress Bar -->
            <div v-else class="reupload-progress-box">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="loader-2" class="spin-anim" style="width: 16px; height: 16px; color: var(--primary-color);"></i>
                  {{ reuploadProgressText }}
                </span>
                <span style="font-size: 0.85rem; font-weight: 800; color: var(--primary-color);">{{ reuploadProgress }}%</span>
              </div>
              <div class="progress-bar-bg" style="height: 8px; border-radius: 4px; background: rgba(0,0,0,0.06); overflow: hidden;">
                <div class="progress-bar-fill" :style="{ width: reuploadProgress + '%' }" style="height: 100%; background: var(--primary-color); transition: width 0.3s ease;"></div>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 8px; margin-bottom: 0;">
                Layanan AI sedang mengekstrak data dan mengkalkulasi ulang SROI berdasarkan dokumen PDF baru...
              </p>
            </div>

            <!-- Actions -->
            <div class="modal-actions" style="margin-top: 20px;">
              <button 
                class="btn btn-secondary modal-btn" 
                :disabled="isReanalyzing"
                @click="handleCloseReuploadModal"
              >
                Batal
              </button>
              <button 
                class="btn btn-primary modal-btn" 
                :disabled="!selectedReuploadFile || isReanalyzing"
                @click="executeReanalysis"
                style="display: inline-flex; align-items: center; gap: 6px;"
              >
                <i :data-lucide="isReanalyzing ? 'loader-2' : 'play-circle'" :class="{ 'spin-anim': isReanalyzing }"></i>
                <span>{{ isReanalyzing ? 'Menganalisis Ulang...' : 'Mulai Analisis Ulang' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===================== MODAL: Upload / Restore Backup .html ===================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showRestoreModal" class="modal-overlay" @click.self="handleCloseRestoreModal">
          <div class="modal-box modal-wide">

            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <div class="modal-icon-wrap primary" style="width: 38px; height: 38px; margin: 0; background: rgba(14, 107, 94, 0.12); color: var(--primary-color);">
                <i data-lucide="upload"></i>
              </div>
              <div style="text-align: left;">
                <h3 class="modal-title" style="text-align:left; margin: 0; font-size: 1.1rem; color: var(--text-primary);">
                  Upload Backup .html — Pulihkan Data
                </h3>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">
                  Pilih berkas cadangan <strong>.html</strong> yang sebelumnya diunduh dari sistem ini
                </span>
              </div>
            </div>

            <!-- Info box -->
            <div class="restore-info-box">
              <div style="display: flex; align-items: flex-start; gap: 10px;">
                <i data-lucide="info" style="width: 16px; height: 16px; flex-shrink: 0; color: #0284c7; margin-top: 1px;"></i>
                <div style="font-size: 0.8rem; color: #0369a1; line-height: 1.5;">
                  <strong>Format yang didukung:</strong> Berkas <code>.html</code> cadangan yang dihasilkan oleh tombol <em>"Unduh Data RKA"</em> pada sistem ini. Berkas HTML mengandung seluruh data JSON yang akan dipulihkan ke server.
                </div>
              </div>
            </div>

            <!-- Dropzone -->
            <div
              v-if="!isRestoring"
              class="reupload-dropzone"
              :class="{ 'drag-over': isRestoreDragOver }"
              @dragover.prevent="isRestoreDragOver = true"
              @dragleave.prevent="isRestoreDragOver = false"
              @drop.prevent="handleRestoreDrop"
              @click="triggerRestoreFileInput"
            >
              <input
                type="file"
                ref="restoreFileInput"
                accept=".html,text/html"
                style="display: none;"
                @change="handleRestoreFileSelect"
              />
              <div v-if="!selectedRestoreFile" class="dropzone-inner">
                <div class="dropzone-icon" style="background: rgba(2, 132, 199, 0.1); color: #0284c7;">
                  <i data-lucide="file-code"></i>
                </div>
                <div class="dropzone-text">
                  <strong>Klik untuk memilih berkas .html</strong> atau tarik dan lepas di sini
                </div>
                <div class="dropzone-hint">Hanya berkas cadangan .html dari sistem ini yang didukung</div>
              </div>
              <div v-else class="selected-file-box" @click.stop>
                <div class="selected-file-info">
                  <i data-lucide="file-code" style="width: 26px; height: 26px; color: #0284c7;"></i>
                  <div style="text-align: left;">
                    <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">{{ selectedRestoreFile.name }}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">{{ formatFileSize(selectedRestoreFile.size) }}</div>
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" @click="selectedRestoreFile = null" title="Ganti Berkas">
                  <i data-lucide="x"></i> Ganti
                </button>
              </div>
            </div>

            <!-- Progress saat restore -->
            <div v-if="isRestoring" class="reupload-progress-box" style="margin: 14px 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="loader-2" class="spin-anim" style="width: 16px; height: 16px; color: #0284c7;"></i>
                  Memulihkan data dari berkas cadangan...
                </span>
              </div>
              <div class="progress-bar-bg" style="height: 8px; border-radius: 4px; background: rgba(0,0,0,0.06); overflow: hidden;">
                <div class="progress-bar-fill" style="height: 100%; background: #0284c7; width: 100%; animation: progress-indeterminate 1.2s ease-in-out infinite;"></div>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 8px; margin-bottom: 0;">
                Mengekstrak data JSON dari berkas .html dan mengunggahnya ke server...
              </p>
            </div>

            <!-- Actions -->
            <div class="modal-actions" style="margin-top: 20px;">
              <button
                class="btn btn-secondary modal-btn"
                :disabled="isRestoring"
                @click="handleCloseRestoreModal"
              >
                Batal
              </button>
              <button
                class="btn modal-btn"
                style="background: #0284c7; color: #fff; border-color: #0284c7;"
                :disabled="!selectedRestoreFile || isRestoring"
                @click="executeRestore"
              >
                <i :data-lucide="isRestoring ? 'loader-2' : 'cloud-upload'" :class="{ 'spin-anim': isRestoring }"></i>
                <span>{{ isRestoring ? 'Memulihkan...' : 'Pulihkan Data' }}</span>
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useAnalysis, computeSroi16Rules, cleanOpdName } from '../composables/useAnalysis';
import { downloadAnalysisHtmlReport } from '@/utils/htmlReportGenerator';

const {
  rkis,
  currentTab,
  loadHistoricalDocIntoAnalyzer,
  deleteRki,
  updateRkiMetadata,
  reanalyzeDocWithPdf,
  formatRupiah,
  openInAgenticAi,
  downloadUserBackup,
  restoreDatabase
} = useAnalysis();

// ── Search & Filter ──────────────────────────────────────────────────
const searchQuery = ref('');
const filterStatus = ref('all');

const filteredRkis = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  return rkis.value.filter(item => {
    return !q ||
      (item.namaDokumen || '').toLowerCase().includes(q) ||
      (item.opd || '').toLowerCase().includes(q) ||
      (item.program || '').toLowerCase().includes(q) ||
      (item.id || '').toLowerCase().includes(q);
  });
});

// ── Modal State ───────────────────────────────────────────────────────
const showDeleteModal     = ref(false);
const showEditModal       = ref(false);
const showSaveConfirmModal = ref(false);
const showReuploadModal   = ref(false);
const deleteTarget        = ref(null);
const editTarget          = ref(null);
const editForm            = ref({ namaDokumen: '', tahun: new Date().getFullYear(), opd: '' });

// ── Re-upload & Re-analyze State ─────────────────────────────────────
const reuploadTarget        = ref(null);
const selectedReuploadFile  = ref(null);
const isReuploadDragOver    = ref(false);
const reuploadFileInput     = ref(null);
const isReanalyzing         = ref(false);
const reuploadProgress      = ref(0);
const reuploadProgressText  = ref('');

// ── Navigation ────────────────────────────────────────────────────────
const goToUpload = () => { currentTab.value = 'dashboard'; };
const viewItem   = (item) => { loadHistoricalDocIntoAnalyzer(item); };

// ── Re-upload Flow (Semua Role) ──────────────────────────────────────
const openReuploadModal = (item) => {
  reuploadTarget.value = item;
  selectedReuploadFile.value = null;
  reuploadProgress.value = 0;
  reuploadProgressText.value = '';
  isReanalyzing.value = false;
  showReuploadModal.value = true;
  nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
};

const handleCloseReuploadModal = () => {
  if (isReanalyzing.value) return;
  showReuploadModal.value = false;
  reuploadTarget.value = null;
  selectedReuploadFile.value = null;
};

const triggerReuploadFileInput = () => {
  if (reuploadFileInput.value) {
    reuploadFileInput.value.click();
  }
};

const handleReuploadFileSelect = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert("Hanya berkas PDF yang didukung.");
      return;
    }
    selectedReuploadFile.value = file;
    nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
  }
};

const handleReuploadDrop = (e) => {
  isReuploadDragOver.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert("Hanya berkas PDF yang didukung.");
      return;
    }
    selectedReuploadFile.value = file;
    nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
  }
};

const executeReanalysis = async () => {
  if (!reuploadTarget.value || !selectedReuploadFile.value || isReanalyzing.value) return;
  isReanalyzing.value = true;
  reuploadProgress.value = 10;
  reuploadProgressText.value = 'Mempersiapkan dokumen...';
  nextTick(() => { if (window.lucide) window.lucide.createIcons(); });

  try {
    const updated = await reanalyzeDocWithPdf(
      reuploadTarget.value.id,
      selectedReuploadFile.value,
      (prog, text) => {
        reuploadProgress.value = prog;
        reuploadProgressText.value = text;
        nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
      }
    );

    setTimeout(() => {
      isReanalyzing.value = false;
      showReuploadModal.value = false;
      reuploadTarget.value = null;
      selectedReuploadFile.value = null;
      // Otomatis buka dokumen yang telah diperbarui ke view analisis
      if (updated) {
        loadHistoricalDocIntoAnalyzer(updated);
      }
    }, 800);
  } catch (err) {
    console.error("Re-analysis failed:", err);
    isReanalyzing.value = false;
    alert("Gagal melakukan analisis ulang: " + (err.message || "Terjadi kesalahan"));
  }
};

// ── Restore / Upload Backup .html Flow ───────────────────────────────
const showRestoreModal    = ref(false);
const selectedRestoreFile = ref(null);
const isRestoreDragOver   = ref(false);
const isRestoring         = ref(false);
const restoreFileInput    = ref(null);

const openRestoreModal = () => {
  selectedRestoreFile.value = null;
  isRestoring.value = false;
  showRestoreModal.value = true;
  nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
};

const handleCloseRestoreModal = () => {
  if (isRestoring.value) return;
  showRestoreModal.value = false;
  selectedRestoreFile.value = null;
};

const triggerRestoreFileInput = () => {
  if (restoreFileInput.value) restoreFileInput.value.click();
};

const validateRestoreFile = (file) => {
  if (!file) return false;
  const name = file.name.toLowerCase();
  if (!name.endsWith('.html') && !name.endsWith('.htm')) {
    alert('Hanya berkas cadangan .html yang didukung.');
    return false;
  }
  return true;
};

const handleRestoreFileSelect = (e) => {
  const file = e.target.files?.[0];
  if (file && validateRestoreFile(file)) {
    selectedRestoreFile.value = file;
    nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
  }
};

const handleRestoreDrop = (e) => {
  isRestoreDragOver.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file && validateRestoreFile(file)) {
    selectedRestoreFile.value = file;
    nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
  }
};

const executeRestore = async () => {
  if (!selectedRestoreFile.value || isRestoring.value) return;
  isRestoring.value = true;
  nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
  try {
    const text = await selectedRestoreFile.value.text();
    const success = await restoreDatabase(text);
    if (success) {
      showRestoreModal.value = false;
      selectedRestoreFile.value = null;
    }
  } catch (err) {
    console.error('Restore failed:', err);
    alert('Gagal memulihkan data: ' + (err.message || 'Terjadi kesalahan'));
  } finally {
    isRestoring.value = false;
    nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
  }
};

// ── Delete Flow ───────────────────────────────────────────────────────
const openDeleteModal = (item) => {
  deleteTarget.value = item;
  showDeleteModal.value = true;
  nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
};

const confirmDelete = () => {
  if (deleteTarget.value) {
    deleteRki(deleteTarget.value.id);
    showDeleteModal.value = false;
    deleteTarget.value = null;
  }
};

// ── Edit Flow ─────────────────────────────────────────────────────────
const openEditModal = (item) => {
  editTarget.value = item;
  editForm.value = {
    namaDokumen: item.namaDokumen || item.program || '',
    tahun:       item.tahunRencana || item.tahun || new Date().getFullYear(),
    opd:         cleanOpdName(item.opd || '')
  };
  showEditModal.value = true;
  nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
};

const openSaveConfirmModal = () => {
  showEditModal.value = false;
  showSaveConfirmModal.value = true;
  nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
};

const cancelSave = () => {
  showSaveConfirmModal.value = false;
  showEditModal.value = true;
  nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
};

const confirmEdit = () => {
  if (editTarget.value) {
    updateRkiMetadata(editTarget.value.id, {
      namaDokumen: editForm.value.namaDokumen,
      tahun:       editForm.value.tahun,
      tahunRencana: editForm.value.tahun,
      opd:         cleanOpdName(editForm.value.opd)
    });
    showSaveConfirmModal.value = false;
    editTarget.value = null;
  }
};

// ── Formatting Helpers ────────────────────────────────────────────────
const formatDate = (isoStr) => {
  if (!isoStr) return '—';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day:    '2-digit',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit'
    }).format(new Date(isoStr));
  } catch {
    return isoStr;
  }
};

const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const getSroiInfo = (item) => {
  if (!item) {
    return {
      ratio: null,
      scoreText: '—',
      label: 'Belum Dinilai',
      fullLabel: 'Belum Dapat Dinilai',
      badgeClass: 'sroi-badge-gray',
      tone: 'tone-gray'
    };
  }

  // 1. Selalu utamakan kalkulasi 16 Aturan Baku SROI (identik 100% dengan halaman Analisis)
  const calc = computeSroi16Rules(item);
  if (calc.isValid) {
    return {
      ratio: calc.sroiRatio,
      scoreText: calc.sroiScore,
      label: calc.shortLabel,
      fullLabel: calc.sroiStatus,
      badgeClass: calc.tone === 'tone-green' ? 'sroi-badge-green' : (calc.tone === 'tone-yellow' ? 'sroi-badge-yellow' : 'sroi-badge-red'),
      tone: calc.tone
    };
  }

  // 2. Fallback jika pagu/outcome belum lengkap tetapi ada properti sroi langsung
  let ratio = null;
  if (typeof item.sroi === 'number' && !isNaN(item.sroi)) {
    ratio = item.sroi;
  } else if (typeof item.sroiRatio === 'number' && !isNaN(item.sroiRatio)) {
    ratio = item.sroiRatio;
  } else if (typeof item.sroi === 'string') {
    const m = item.sroi.match(/([\d.,]+)/);
    if (m) {
      ratio = parseFloat(m[1].replace(',', '.'));
    }
  }

  if (ratio === null || isNaN(ratio) || ratio <= 0) {
    return {
      ratio: null,
      scoreText: item.sroi ? String(item.sroi).replace(' : 1', '').trim() : '—',
      label: 'Belum Dinilai',
      fullLabel: 'Belum Dapat Dinilai',
      badgeClass: 'sroi-badge-gray',
      tone: 'tone-gray'
    };
  }

  const scoreText = ratio.toFixed(2);
  let label = 'Kurang';
  let fullLabel = 'Nilai Sosial Tidak Seimbang dengan Investasi';
  let badgeClass = 'sroi-badge-red';
  let tone = 'tone-red';

  if (ratio >= 1.0) {
    label = 'Layak';
    fullLabel = 'Nilai Sosial Positif (Layak)';
    badgeClass = 'sroi-badge-green';
    tone = 'tone-green';
  } else if (ratio >= 0.6) {
    label = 'Cukup';
    fullLabel = 'Nilai Sosial Cukup / Keringanan (Moderat)';
    badgeClass = 'sroi-badge-yellow';
    tone = 'tone-yellow';
  }

  return {
    ratio,
    scoreText,
    label,
    fullLabel,
    badgeClass,
    tone
  };
};

const getSroiBadgeClass = (sroi) => {
  const num = typeof sroi === 'number' ? sroi : parseFloat(String(sroi).replace(',', '.'));
  if (num >= 1.0) return 'sroi-badge-green';
  if (num >= 0.6) return 'sroi-badge-yellow';
  if (num > 0) return 'sroi-badge-red';
  return 'sroi-badge-gray';
};

const getSroiLabel = (sroi) => {
  const num = typeof sroi === 'number' ? sroi : parseFloat(String(sroi).replace(',', '.'));
  if (num >= 1.0) return 'Layak';
  if (num >= 0.6) return 'Cukup';
  if (num > 0) return 'Kurang';
  return 'Belum Dinilai';
};

const getStatusBadgeClass = (status) => {
  if (status === 'Approved') return 'badge-success';
  return 'badge-primary';
};

const getStatusText = (status) => {
  if (status === 'Approved') return 'DISAHKAN';
  return 'DRAF';
};

// ── Lucide refresh ────────────────────────────────────────────────────
onMounted(() => {
  if (window.lucide) nextTick(() => window.lucide.createIcons());
});

watch([showDeleteModal, showEditModal, showSaveConfirmModal, showReuploadModal, showRestoreModal, filteredRkis], () => {
  nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
});
</script>

<style scoped>
.badge-ver-count {
  background: var(--info-glow);
  color: var(--info-hover);
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 6px;
  border: 1px solid var(--info-glow);
  display: inline-block;
  margin-left: 6px;
}

.arsip-btn-agent {
  color: var(--accent-color);
  background: var(--success-glow);
  border-color: var(--success-glow);
}

.arsip-btn-agent:hover {
  background: var(--accent-color);
  color: #ffffff;
}

.arsip-btn-reupload {
  color: #0284c7;
  background: #f0f9ff;
  border-color: #bae6fd;
}

.arsip-btn-reupload:hover {
  background: #0284c7;
  color: #ffffff;
}

/* SROI Badge Pill Styling */
.sroi-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.sroi-badge-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.sroi-badge-ratio {
  font-family: 'JetBrains Mono', monospace, sans-serif;
  font-weight: 800;
  font-size: 11.5px;
}

.sroi-badge-sep {
  opacity: 0.5;
}

.sroi-badge-label {
  font-size: 10.5px;
}

/* 1. Hijau: SROI >= 1.0 (Layak) */
.sroi-badge-green {
  background: #ecfdf5 !important;
  color: #065f46 !important;
  border: 1px solid #6ee7b7 !important;
}

/* 2. Kuning: 0.6 <= SROI < 1.0 (Keringanan / Moderat) */
.sroi-badge-yellow {
  background: #fefce8 !important;
  color: #854d0e !important;
  border: 1px solid #fde047 !important;
}

/* 3. Merah: SROI < 0.6 (Tidak Seimbang) */
.sroi-badge-red {
  background: #fef2f2 !important;
  color: #991b1b !important;
  border: 1px solid #fca5a5 !important;
}

/* 4. Abu-abu: Belum Dapat Dinilai */
.sroi-badge-gray {
  background: #f8fafc !important;
  color: #475569 !important;
  border: 1px solid #cbd5e1 !important;
}

/* Reupload Modal Component Styling */
.reupload-target-card {
  background: var(--bg-main, #f8fafc);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 10px;
  padding: 12px 16px;
  margin: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.target-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
}

.target-card-label {
  color: var(--text-secondary, #64748b);
  font-weight: 500;
}

.target-card-val {
  color: var(--text-primary, #1e293b);
  max-width: 65%;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.target-card-val.bold {
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.reupload-dropzone {
  border: 2px dashed var(--border-color, #cbd5e1);
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  background: #fafafa;
  transition: all 0.2s ease;
}

.reupload-dropzone:hover, .reupload-dropzone.drag-over {
  border-color: var(--primary-color, #0e6b5e);
  background: rgba(14, 107, 94, 0.04);
}

.dropzone-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.dropzone-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(14, 107, 94, 0.1);
  color: var(--primary-color, #0e6b5e);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropzone-text {
  font-size: 0.88rem;
  color: var(--text-primary, #334155);
}

.dropzone-hint {
  font-size: 0.75rem;
  color: var(--text-muted, #94a3b8);
}

.selected-file-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
}

.selected-file-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reupload-progress-box {
  background: #ffffff;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 10px;
  padding: 16px;
  margin: 10px 0;
}

.spin-anim {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Restore Info Box */
.restore-info-box {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 10px 14px;
  margin: 12px 0;
}

.restore-info-box code {
  background: #e0f2fe;
  color: #0369a1;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: 'JetBrains Mono', monospace;
}

/* Indeterminate progress bar animation */
@keyframes progress-indeterminate {
  0%   { transform: translateX(-100%); width: 60%; }
  50%  { transform: translateX(60%);  width: 60%; }
  100% { transform: translateX(200%); width: 60%; }
}
</style>

