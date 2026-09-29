import React, { useState } from 'react';
import { useWebApp } from '../context/WebAppContext';
import { DEMO_USERS } from '../data/seedData';
import { UserRole } from '../../models/auth';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal, loginAsDemoUser, loginCustom, t } = useWebApp();

  const hasRealAccountOnDevice = localStorage.getItem('kalasetu_has_real_account') === 'true' || !!localStorage.getItem('kalasetu_real_profile');

  const [authMethod, setAuthMethod] = useState<'demo' | 'email' | 'phone'>('email');
  const [role, setRole] = useState<UserRole>('artisan');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (activeModal !== 'auth') return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    const name = fullName.trim() || (email.includes('@') ? email.split('@')[0] : 'User');
    loginCustom(name, email, role);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (!phone.trim()) return;
      setOtpSent(true);
    } else {
      if (!otp.trim()) return;
      const name = fullName.trim() || 'Artisan User';
      loginCustom(name, `${phone}@mobile.kalasetu.in`, role, { phone });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#BE123C] text-white flex items-center justify-center mx-auto text-2xl shadow-md shadow-rose-200">
            🌸
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">
            {t('Sign in to KalaSetu', 'कलासेतु में लॉगिन करें')}
          </h2>
          <p className="text-xs text-gray-500">
            {t('Real entities: Strictly isolated accounts & data privacy', 'वास्तविक खाते: व्यक्तिगत डेटा सुरक्षा')}
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl my-4 text-xs font-semibold">
          {!hasRealAccountOnDevice && (
            <button
              onClick={() => setAuthMethod('demo')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                authMethod === 'demo' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              ⚡ {t('1-Click Demo', 'डेमो खाते')}
            </button>
          )}
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              authMethod === 'email' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            ✉️ {t('Email / Real Account', 'ईमेल लॉगिन')}
          </button>
          <button
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              authMethod === 'phone' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            📱 {t('Phone OTP', 'फ़ोन ओटीपी')}
          </button>
        </div>

        {/* 1-Click Demo Accounts List - ONLY for initial demo testing before any real account */}
        {authMethod === 'demo' && !hasRealAccountOnDevice && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              {t('Select an evaluation persona with preloaded profiles and craft stories:', 'परीक्षण हेतु तैयार डेमो खाता चुनें:')}
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => loginAsDemoUser(demo)}
                  className="w-full text-left p-3 rounded-2xl border border-gray-200 hover:border-[#E11D48] hover:bg-rose-50/40 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl p-1.5 bg-gray-100 rounded-xl group-hover:bg-rose-100 transition-colors">
                      {demo.avatarEmoji}
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-xs text-gray-900 group-hover:text-[#E11D48] transition-colors">{demo.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{demo.craftOrDomain}</p>
                      <p className="text-[9px] text-gray-400">{demo.location}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-[#E11D48] px-2 py-1 bg-gray-100 group-hover:bg-rose-100 rounded-lg shrink-0">
                    {demo.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Email Login / Signup */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Select Workspace Role', 'वर्कस्पेस भूमिका')}</label>
              <div className="grid grid-cols-3 gap-2">
                {(['artisan', 'business', 'customer'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-1 text-center rounded-xl border text-[11px] font-bold capitalize cursor-pointer ${
                      role === r ? 'border-[#E11D48] bg-rose-50 text-[#BE123C]' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {r === 'artisan' ? '🧵 Artisan' : r === 'business' ? '🏢 Buyer' : '🛍️ Patron'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Full Name / Enterprise Name', 'पूरा नाम / संस्था')}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. abc / Your Name"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E11D48]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Email Address', 'ईमेल पता')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="weaver@kalasetu.in"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E11D48]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Password', 'पासवर्ड')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E11D48]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#E11D48] text-white font-bold text-xs hover:bg-[#BE123C] cursor-pointer shadow-md shadow-rose-200 mt-2"
            >
              {t('Continue to Workspace', 'वर्कस्पेस में प्रवेश करें')}
            </button>
          </form>
        )}

        {/* Phone OTP */}
        {authMethod === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Mobile Number', 'मोबाइल नंबर')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile (e.g. 9876543210)"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E11D48]"
                required
              />
            </div>

            {otpSent && (
              <div className="space-y-2 animate-in fade-in">
                <label className="block text-gray-700 font-semibold">{t('Enter 6-Digit OTP', '6-अंकीय ओटीपी दर्ज करें')}</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E11D48] text-center tracking-widest text-base font-bold font-mono"
                  required
                />
                <p className="text-[10px] text-gray-400 text-center">
                  {t('Demo code: Enter any 6 digits to verify', 'डेमो कोड: कोई भी 6 अंक दर्ज करें')}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#E11D48] text-white font-bold text-xs hover:bg-[#BE123C] cursor-pointer shadow-md shadow-rose-200"
            >
              {otpSent ? t('Verify & Sign In', 'सत्यापित करें') : t('Get SMS Verification Code', 'ओटीपी प्राप्त करें')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
