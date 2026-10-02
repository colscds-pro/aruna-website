import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, ShieldAlert, AlertCircle, ArrowLeft, LogOut } from 'lucide-react';
import { ArunaLogo } from '../ArunaLogo';
import { AuthService } from '../../services/supabase/authService';
import { AdminCmsModal } from '../Insights/AdminCmsModal';
import { Article, Profile } from '../../types';

interface AdminPortalProps {
  onBackToWebsite: () => void;
  onPreviewArticle: (article: Article) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite, onPreviewArticle }) => {
  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'unauthorized' | 'authorized'>('loading');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verify auth session on load
  const verifySession = async () => {
    setAuthStatus('loading');
    try {
      const session = await AuthService.getSession();
      if (!session?.user) {
        setCurrentUser(null);
        setCurrentProfile(null);
        setAuthStatus('unauthenticated');
        return;
      }

      setCurrentUser(session.user);
      const profile = await AuthService.getUserProfile(session.user.id);
      setCurrentProfile(profile);

      // Verify RBAC role: only 'admin' and 'editor' may access CMS
      if (profile && (profile.role === 'admin' || profile.role === 'editor')) {
        setAuthStatus('authorized');
      } else {
        setAuthStatus('unauthorized');
      }
    } catch (err: any) {
      console.error('Session verification error:', err);
      setAuthStatus('unauthenticated');
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { user, profile, error } = await AuthService.signIn(email, password);
      if (error) {
        setErrorMessage(error.message || 'Kredensial tidak valid. Silakan periksa email dan kata sandi Anda.');
        setIsSubmitting(false);
        return;
      }

      if (!user) {
        setErrorMessage('Pengguna tidak ditemukan.');
        setIsSubmitting(false);
        return;
      }

      setCurrentUser(user);
      setCurrentProfile(profile);

      // Verify role from public.profiles
      if (profile && (profile.role === 'admin' || profile.role === 'editor')) {
        setAuthStatus('authorized');
      } else {
        setAuthStatus('unauthorized');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat mencoba masuk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await AuthService.signOut();
    setCurrentUser(null);
    setCurrentProfile(null);
    setAuthStatus('unauthenticated');
    setEmail('');
    setPassword('');
    setErrorMessage(null);
  };

  // State 1: Loading
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <ArunaLogo variant="horizontal" color="navy" size="md" />
        <div className="mt-8 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#667085]">
          <span className="w-2 h-2 rounded-full bg-[#B59A5A] animate-pulse" />
          <span>Memverifikasi Sesi Autentikasi...</span>
        </div>
      </div>
    );
  }

  // State 2: Authorized -> Render existing CMS interface
  if (authStatus === 'authorized') {
    return (
      <AdminCmsModal
        isOpen={true}
        onClose={onBackToWebsite}
        onPreviewArticle={onPreviewArticle}
      />
    );
  }

  // State 3: Unauthorized authenticated user -> Access Denied State
  if (authStatus === 'unauthorized') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8">
            <ArunaLogo variant="horizontal" color="navy" size="md" />
          </div>

          <div className="p-8 sm:p-10 rounded-2xl border border-[#EAECF0] shadow-sm bg-white text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-5">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-700 block mb-1">
              Akses Ditolak · 403
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F33] mb-3">
              Izin Administrator Diperlukan
            </h2>

            <p className="text-xs text-[#667085] leading-relaxed mb-6">
              Akun <strong className="font-semibold text-[#0B1F33]">{currentUser?.email}</strong> berhasil terautentikasi di Supabase, namun belum memiliki peran <code className="bg-[#F5F6F7] px-1.5 py-0.5 rounded font-mono text-[#0B1F33]">admin</code> atau <code className="bg-[#F5F6F7] px-1.5 py-0.5 rounded font-mono text-[#0B1F33]">editor</code> di tabel <code className="bg-[#F5F6F7] px-1.5 py-0.5 rounded font-mono text-[#0B1F33]">public.profiles</code>.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-semibold text-[#0B1F33] bg-[#F5F6F7] hover:bg-[#EAECF0] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#667085]" />
                <span>Keluar & Masuk dengan Akun Lain</span>
              </button>

              <button
                type="button"
                onClick={onBackToWebsite}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Website Utama</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Unauthenticated -> Clean ARUNA Admin Login screen
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBackToWebsite();
            }}
            className="hover:opacity-90 transition-opacity"
            title="Kembali ke Beranda"
          >
            <ArunaLogo variant="horizontal" color="navy" size="md" />
          </a>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#B59A5A] mb-2">
            <span>PORTAL EDITORIAL & CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F33]">
            Masuk ke Portal Admin
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#667085] leading-relaxed">
            Akses pengelolaan konten Insights, media aset, dan data editorial ARUNA.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-2xl border border-[#EAECF0] shadow-sm bg-white">
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5 font-mono uppercase tracking-wider">
                Email Terdaftar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#667085]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aruna.id"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] text-[#0B1F33] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0B1F33] font-mono uppercase tracking-wider">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#667085]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] text-[#0B1F33] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md shadow-xs text-xs sm:text-sm font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] focus:outline-hidden transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </span>
              ) : (
                <>
                  <span>Masuk ke Panel CMS</span>
                  <ArrowRight className="w-4 h-4 text-[#B59A5A]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#EAECF0] flex items-center justify-between text-xs text-[#667085]">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 text-[#0B1F33] hover:text-[#B59A5A] transition-colors cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website</span>
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-[#667085]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B59A5A]" />
              <span>Supabase RLS</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-[#667085]">
          ARUNA Consulting · Dilindungi oleh Supabase Auth & PostgreSQL Row Level Security
        </p>
      </div>
    </div>
  );
};
