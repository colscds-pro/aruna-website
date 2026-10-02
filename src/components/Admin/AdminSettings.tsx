import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Database,
  Key,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Layers,
  FileCode
} from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_CONFIG_INFO } from '../../services/supabase/client';
import { MigrationService, MigrationResult } from '../../services/supabase/migrationService';

export const AdminSettings: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [dataCount, setDataCount] = useState<{ articles: number; authors: number; categories: number; media: number }>({
    articles: 0,
    authors: 0,
    categories: 0,
    media: 0,
  });
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);

  useEffect(() => {
    async function checkCount() {
      const counts = await MigrationService.checkSupabaseDataCount();
      setDataCount(counts);
    }
    checkCount();
  }, []);

  const handleCopySql = async () => {
    try {
      const res = await fetch('/supabase/schema.sql');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRunMigration = async () => {
    if (!confirm('Jalankan migrasi data awal (artikel, penulis, kategori, dan media) ke Supabase?')) return;
    setIsMigrating(true);
    setMigrationResult(null);

    try {
      const res = await MigrationService.runMigration();
      setMigrationResult(res);
      const counts = await MigrationService.checkSupabaseDataCount();
      setDataCount(counts);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
          Pengaturan Sistem & Koneksi Supabase
        </h2>
        <p className="text-xs text-[#667085] mt-0.5">
          Status database PostgreSQL, kredensial API, dan migrasi konten produksi.
        </p>
      </div>

      {/* Supabase Connection Status Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#EAECF0] shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAECF0]">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-500 ring-4 ring-amber-100'}`} />
            <div>
              <h3 className="text-sm font-bold text-[#0B1F33]">Status Koneksi Supabase</h3>
              <p className="text-xs text-[#667085]">
                {isSupabaseConfigured
                  ? 'Terkoneksi ke instance Supabase Cloud'
                  : 'Mode Pratinjau Lokal (Kredensial belum dipasang)'}
              </p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded font-mono font-semibold ${
            isSupabaseConfigured
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL PREVIEW'}
          </span>
        </div>

        {/* Configuration Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-6">
          <div className="p-3.5 rounded-lg bg-[#F5F6F7] border border-[#EAECF0]">
            <span className="text-[#667085] block mb-1 uppercase text-[10px]">VITE_SUPABASE_URL</span>
            <span className="font-bold text-[#0B1F33] truncate block">
              {SUPABASE_CONFIG_INFO.url || '(Belum disetel di environment)'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F5F6F7] border border-[#EAECF0]">
            <span className="text-[#667085] block mb-1 uppercase text-[10px]">STORAGE BUCKET</span>
            <span className="font-bold text-[#0B1F33] block">
              {SUPABASE_CONFIG_INFO.bucketName} (Public Read, Staff Write RLS)
            </span>
          </div>
        </div>

        {/* Live Records in Supabase */}
        {isSupabaseConfigured && (
          <div className="p-4 rounded-lg bg-[#F5F6F7] border border-[#EAECF0] mb-6">
            <span className="text-xs font-bold text-[#0B1F33] block mb-2 font-mono uppercase">
              Jumlah Data di Database Supabase:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-white rounded border border-[#EAECF0]">
                <span className="text-lg font-bold text-[#0B1F33] block">{dataCount.articles}</span>
                <span className="text-[10px] text-[#667085]">Artikel</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-[#EAECF0]">
                <span className="text-lg font-bold text-[#0B1F33] block">{dataCount.authors}</span>
                <span className="text-[10px] text-[#667085]">Penulis</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-[#EAECF0]">
                <span className="text-lg font-bold text-[#0B1F33] block">{dataCount.categories}</span>
                <span className="text-[10px] text-[#667085]">Kategori</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-[#EAECF0]">
                <span className="text-lg font-bold text-[#0B1F33] block">{dataCount.media}</span>
                <span className="text-[10px] text-[#667085]">Media</span>
              </div>
            </div>
          </div>
        )}

        {/* Migration / Seed Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#EAECF0]">
          <div>
            <h4 className="text-xs font-bold text-[#0B1F33]">Sinkronisasi / Migrasi Data Awal</h4>
            <p className="text-[11px] text-[#667085]">
              Salin artikel, penulis, kategori, dan media registry ke database Supabase.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunMigration}
            disabled={isMigrating || !isSupabaseConfigured}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1F33] hover:bg-[#132D47] text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isMigrating ? 'animate-spin' : ''}`} />
            <span>{isMigrating ? 'Memigrasikan...' : 'Jalankan Migrasi ke Supabase'}</span>
          </button>
        </div>

        {migrationResult && (
          <div className={`mt-4 p-3.5 rounded-lg text-xs ${
            migrationResult.success
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border border-amber-200 text-amber-900'
          }`}>
            <p className="font-semibold">{migrationResult.message}</p>
            {migrationResult.errors.length > 0 && (
              <ul className="list-disc pl-4 mt-2 space-y-0.5 text-[11px]">
                {migrationResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* SQL Migration & RLS Schema Viewer */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#EAECF0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#EAECF0]">
          <div>
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#B59A5A]" />
              <h3 className="text-sm font-bold text-[#0B1F33]">Skrip SQL Schema & RLS Hardened</h3>
            </div>
            <p className="text-xs text-[#667085] mt-0.5">
              Jalankan skrip ini sekali di <strong>Supabase Dashboard → SQL Editor</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F6F7] hover:bg-white border border-[#EAECF0] rounded text-xs font-semibold text-[#0B1F33] cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin SQL Schema'}</span>
          </button>
        </div>

        <div className="p-4 rounded-lg bg-[#0B1F33] text-white/90 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-56">
          <pre>{`-- File: /supabase/schema.sql
-- Termasuk tabel: profiles, authors, categories, articles, site_media
-- Proteksi RLS penuh: Zero role escalation, Draft visibility guard, Staff storage write
-- Buka Supabase SQL Editor dan jalankan isi lengkap dari /supabase/schema.sql`}</pre>
        </div>

        {/* 3 Step Setup Guide */}
        <div className="mt-6 pt-5 border-t border-[#EAECF0] space-y-3">
          <h4 className="text-xs font-bold text-[#0B1F33] uppercase font-mono tracking-wider">
            3 Langkah Setup di Supabase Dashboard:
          </h4>
          <ol className="list-decimal pl-4 space-y-2 text-xs text-[#667085]">
            <li>
              <strong>Buka SQL Editor:</strong> Buat New Query di Supabase Dashboard Anda, tempel isi dari <code className="bg-[#F5F6F7] px-1 py-0.5 rounded font-mono text-[#0B1F33]">supabase/schema.sql</code>, dan tekan Run.
            </li>
            <li>
              <strong>Dapatkan API Keys:</strong> Masuk ke <em>Project Settings → API</em>. Salin <strong>Project URL</strong> dan <strong>anon/publishable key</strong>, lalu masukkan ke environment variable:
              <br />
              <code className="text-[#0B1F33] font-mono text-[11px] block mt-1">VITE_SUPABASE_URL=...</code>
              <code className="text-[#0B1F33] font-mono text-[11px] block">VITE_SUPABASE_PUBLISHABLE_KEY=...</code>
            </li>
            <li>
              <strong>Promosikan Akun Admin Pertama:</strong> Daftarkan email admin di Authentication, lalu jalankan query bootstrap di SQL Editor:
              <br />
              <code className="bg-[#F5F6F7] px-1.5 py-0.5 rounded font-mono text-[11px] text-[#0B1F33] block mt-1">
                UPDATE public.profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@aruna.id');
              </code>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
