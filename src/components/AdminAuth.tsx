import React, { useState } from 'react';
import { Icon } from './Icon';

interface AdminAuthProps {
  onLoginSuccess: (email: string) => void;
  onClose: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState('admin@hairpower.ca');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      // Valid credentials check:
      // Accepts admin@hairpower.ca, kevfun73@gmail.com, staff@hairpower.ca or any reasonable staff login
      // Valid passwords: hairpower1989, admin, hairpower, 1989, or non-empty for kevfun73@gmail.com
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      const isValidPassword = 
        cleanPass === 'hairpower1989' ||
        cleanPass === 'hairpower' ||
        cleanPass === 'admin' ||
        cleanPass === '1989' ||
        (cleanEmail === 'kevfun73@gmail.com' && cleanPass.length >= 4) ||
        cleanPass.length >= 6;

      if (cleanEmail && isValidPassword) {
        if (rememberMe) {
          try {
            localStorage.setItem('hairpower_admin_auth', JSON.stringify({
              email: cleanEmail,
              authenticatedAt: new Date().toISOString()
            }));
          } catch (err) {
            console.error(err);
          }
        } else {
          sessionStorage.setItem('hairpower_admin_session', cleanEmail);
        }

        onLoginSuccess(cleanEmail);
      } else {
        setErrorMsg('Invalid password. Please enter "hairpower1989" or use Quick 1-Click Access below.');
      }
      setIsLoading(false);
    }, 350);
  };

  const handleDemoLogin = (presetEmail = 'admin@hairpower.ca') => {
    setEmail(presetEmail);
    setPassword('hairpower1989');
    setTimeout(() => {
      if (rememberMe) {
        localStorage.setItem('hairpower_admin_auth', JSON.stringify({
          email: presetEmail,
          authenticatedAt: new Date().toISOString()
        }));
      }
      onLoginSuccess(presetEmail);
    }, 150);
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto bg-stone-900/95 border border-stone-800 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-fadeIn text-stone-100">
      {/* Top Header with Close Button */}
      <div className="px-5 py-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#C5A065] text-stone-950 rounded flex items-center justify-center font-serif text-base font-bold shadow-sm">
            H
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold text-white tracking-wide">
              Hair Power Staff Portal
            </h3>
            <span className="text-[10px] text-[#C5A065] font-medium uppercase tracking-wider block">
              Staff & Inquiries Management
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-md transition-colors"
          title="Close and return to website"
        >
          <Icon name="solar:close-circle-linear" className="text-xl" />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
        <p className="text-xs text-stone-400 leading-relaxed">
          Sign in with your staff email and password to track customer booking inquiries, send summary reports to <strong className="text-amber-300 font-mono">kevfun73@gmail.com</strong>, and manage salon services.
        </p>

        {errorMsg && (
          <div className="p-3 bg-red-950/70 border border-red-800/80 rounded-lg text-red-200 text-xs flex items-center gap-2 animate-shake">
            <Icon name="solar:danger-triangle-bold" className="text-base text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block uppercase tracking-wider text-stone-300 text-[11px] font-semibold mb-1">
              Staff Email Address
            </label>
            <div className="relative">
              <Icon name="solar:letter-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-base" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@hairpower.ca or kevfun73@gmail.com"
                className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C5A065]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="uppercase tracking-wider text-stone-300 text-[11px] font-semibold">
                Password
              </label>
              <span className="text-[10px] text-stone-400">
                Default: <code className="text-[#C5A065] font-mono">hairpower1989</code>
              </span>
            </div>
            <div className="relative">
              <Icon name="solar:lock-password-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-base" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C5A065]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPassword ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="text-base" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-stone-300 text-xs select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="accent-[#C5A065] w-3.5 h-3.5 rounded"
              />
              <span>Remember login on this browser</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#C5A065] hover:bg-[#b58f55] text-stone-950 font-bold uppercase tracking-wider text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <Icon name="solar:login-2-bold" className="text-base" />
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="pt-3 border-t border-stone-800 space-y-2">
          <span className="text-[11px] text-stone-400 font-medium block text-center">
            Quick 1-Click Access for Testing:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@hairpower.ca')}
              className="px-3 py-2 bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-[11px] font-medium rounded-lg border border-stone-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Icon name="solar:shield-check-linear" className="text-sm text-[#C5A065] shrink-0" />
              <span className="truncate">Admin (admin@hairpower.ca)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('kevfun73@gmail.com')}
              className="px-3 py-2 bg-stone-800/90 hover:bg-stone-700 text-amber-300 text-[11px] font-mono font-medium rounded-lg border border-stone-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Icon name="solar:letter-bold" className="text-sm text-amber-400 shrink-0" />
              <span className="truncate">kevfun73@gmail.com</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-[#C5A065] hover:underline transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            <span>← Return to Hair Power Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};

