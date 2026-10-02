import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { ArunaLogo } from '../ArunaLogo';
import { AuthService } from '../../services/supabase/authService';
import { isSupabaseConfigured } from '../../services/supabase/client';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { user, error } = await AuthService.signIn(email, password);
      if (error) {
        setErrorMessage(error.message || 'Gagal masuk. Periksa email dan password Anda.');
      } else if (user) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat mencoba masuk.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <ArunaLogo variant="horizontal" color="navy" size="lg" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#0B1F33]">
          Portal Administrator Editorial
        </h2>
        <p className="mt-2 text-center text-xs text-[#667085]">
          Kelola artikel Insights, media website, penulis, dan kategori secara mandiri.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#EAECF0] shadow-sm">
          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">Mode Pratinjau CMS Lokal</strong>
                  <span>
                    Kredensial Supabase produksi belum terpasang di environment. Masukkan password demo <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">aruna2026</code> untuk menguji seluruh fitur antarmuka CMS.
                  </span>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5 font-mono uppercase tracking-wider">
                Email Administrator
              </label>
              <div className="relative rounded-md shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aruna.id"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] text-[#0B1F33]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5 font-mono uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative rounded-md shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] text-[#0B1F33]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-xs text-xs sm:text-sm font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] focus:outline-hidden transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Masuk ke Panel CMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#EAECF0] flex items-center justify-between text-xs text-[#667085]">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 text-[#0B1F33] hover:text-[#B59A5A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Utama</span>
            </button>
            <div className="flex items-center gap-1 text-[11px] text-[#667085]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B59A5A]" />
              <span>Supabase Auth & RLS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
