import React, { useState } from 'react';
import { useWebApp, AppLanguage, SUPPORTED_LANGUAGES } from '../context/WebAppContext';
import { UserRole, UserProfile } from '../../models/auth';
import { DEMO_USERS } from '../data/seedData';
import { BrandLogo } from './common/BrandLogo';
import {
  ArrowRight,
  Globe,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  ShoppingBag,
  Briefcase,
  ChevronDown,
  Check,
  Award,
  AlertCircle
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { loginCustom, loginAsDemoUser, language, setLanguage, t } = useWebApp();

  const [authMode, setAuthMode] = useState<'demo' | 'login' | 'register'>('demo');
  const [demoRoleFilter, setDemoRoleFilter] = useState<UserRole>('artisan');
  
  // Custom Login & Registration state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [registerRole, setRegisterRole] = useState<UserRole>('artisan');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerLocation, setRegisterLocation] = useState('');
  const [registerCraftOrDomain, setRegisterCraftOrDomain] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Filtered demo users for the selected role tab
  const filteredDemoUsers = DEMO_USERS.filter((u) => u.role === demoRoleFilter);

  // Handle Standard Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailTrim = loginEmail.trim().toLowerCase();
    const passTrim = loginPassword.trim();

    if (!emailTrim || !passTrim) {
      setLoginError(t('Please enter both email and password.', 'कृपया ईमेल और पासवर्ड दोनों दर्ज करें।'));
      return;
    }

    // Check demo users
    const matchedDemo = DEMO_USERS.find(
      (u) => (u.email || '').toLowerCase() === emailTrim || u.id.toLowerCase() === emailTrim
    );

    let savedProfile: UserProfile | null = null;
    try {
      const p = localStorage.getItem('kalasetu_real_profile');
      if (p) savedProfile = JSON.parse(p);
    } catch {}

    if (matchedDemo) {
      loginAsDemoUser(matchedDemo);
      onEnterApp();
    } else if (savedProfile && savedProfile.email?.toLowerCase() === emailTrim) {
      loginCustom(savedProfile.fullName, savedProfile.email, savedProfile.role, {
        phone: savedProfile.phone,
        location: savedProfile.location,
        craftSpecialization: savedProfile.craftSpecialization,
        businessName: savedProfile.businessName,
      });
      onEnterApp();
    } else if (passTrim.length >= 4) {
      // Valid login with inferred name
      const userName = emailTrim.split('@')[0];
      const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);
      loginCustom(displayName, emailTrim, 'customer', {
        location: 'India',
      });
      onEnterApp();
    } else {
      setLoginError(t('Invalid credentials. Password must be at least 4 characters.', 'अमान्य क्रेडेंशियल्स। कृपया सही पासवर्ड दर्ज करें।'));
    }
  };

  // Handle New Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail.trim() || !registerName.trim() || !registerPassword.trim()) return;

    loginCustom(registerName.trim(), registerEmail.trim(), registerRole, {
      phone: registerPhone.trim() || '+91 98765 00000',
      location: registerLocation.trim() || 'India',
      craftSpecialization: registerRole === 'artisan' ? registerCraftOrDomain.trim() || 'Traditional Heritage Crafts' : undefined,
      businessName: registerRole === 'business' ? registerCraftOrDomain.trim() || `${registerName.trim()} Sourcing` : undefined,
    });
    onEnterApp();
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A0E17] via-[#881337] via-[#BE123C] to-[#C2410C] text-slate-900 flex flex-col justify-between selection:bg-[#FF4B6E] selection:text-white font-sans relative overflow-x-hidden">
      {/* Radiant Glowing Orbs Behind Glass Container for Distinct Frosted Depth */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-rose-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-orange-500/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between relative z-10">
        {/* Brand Logo inside Frosted Glass Pill */}
        <div className="backdrop-blur-xl bg-white/85 px-4 py-2 rounded-2xl shadow-xl border border-white/60 ring-1 ring-black/10">
          <BrandLogo size="md" textColor="text-slate-900" subtextColor="text-slate-600" />
        </div>

        {/* Right 11-Language Selector & Direct Browse */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl backdrop-blur-xl bg-white/85 text-slate-900 hover:bg-white text-xs font-bold transition-all shadow-xl border border-white/60 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#BE123C]" />
              <span className="font-semibold">{currentLangObj.native}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
            </button>

            {/* Dropdown with all 11 Indian Languages */}
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
                <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Language / भाषा चुनें (11)
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as AppLanguage);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors hover:bg-rose-50 cursor-pointer ${
                      language === lang.code ? 'text-[#BE123C] font-bold bg-rose-50' : 'text-slate-800'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[11px] text-slate-400">({lang.name})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onEnterApp}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-900 hover:text-[#BE123C] text-xs font-bold transition-all shadow-xl border border-white/60 cursor-pointer"
          >
            <span>{t('Browse Marketplace')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area with High Contrast & Ultra-Clear Glassmorphism */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-4 my-auto space-y-5 relative z-10">
        {/* High-Contrast Bold Hero Title (Bright White with Deep Drop Shadow on Rich Jewel Backdrop) */}
        <div className="text-center space-y-2 text-white">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-tight">
            {t('Connecting Indian Artisans to Global Buyers')}
          </h1>
          <p className="text-sm sm:text-base text-rose-100 font-semibold max-w-lg mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {t('Explore verified handcrafted treasures directly from artisans.')}
          </p>
        </div>

        {/* Central Authentic Ultra-Glassmorphic Container Card */}
        <div className="backdrop-blur-3xl bg-white/80 sm:bg-white/85 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border border-white/70 ring-1 ring-white/50 space-y-5">
          {/* Top Switcher Tabs with Frosted Glass Look */}
          <div className="flex bg-slate-900/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/40">
            <button
              onClick={() => {
                setAuthMode('demo');
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'demo'
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#BE123C]" />
              <span>{t('Demo Profiles')}</span>
            </button>

            <button
              onClick={() => {
                setAuthMode('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-[#BE123C]" />
              <span>{t('Sign In')}</span>
            </button>

            <button
              onClick={() => {
                setAuthMode('register');
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>{t('Register New')}</span>
            </button>
          </div>

          {/* TAB 1: DEMO ROLES WITH 3 CLEAR ROLE BUTTONS & MOCK PROFILES */}
          {authMode === 'demo' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* 3 Role Selection Buttons */}
              <div>
                <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  1. Select a Role:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setDemoRoleFilter('artisan')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                      demoRoleFilter === 'artisan'
                        ? 'bg-rose-50 text-[#BE123C] border-[#BE123C] shadow-sm ring-2 ring-rose-200'
                        : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {t('Artisan Maker')}
                  </button>

                  <button
                    onClick={() => setDemoRoleFilter('business')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                      demoRoleFilter === 'business'
                        ? 'bg-blue-50 text-blue-800 border-blue-600 shadow-sm ring-2 ring-blue-200'
                        : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {t('B2B Buyer')}
                  </button>

                  <button
                    onClick={() => setDemoRoleFilter('customer')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                      demoRoleFilter === 'customer'
                        ? 'bg-amber-50 text-amber-900 border-amber-600 shadow-sm ring-2 ring-amber-200'
                        : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {t('Craft Patron')}
                  </button>
                </div>
              </div>

              {/* Mock Profiles for Selected Role */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  2. 1-Click Instant Access:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredDemoUsers.map((demo) => {
                    const initials = demo.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    const colorStyle =
                      demo.role === 'artisan'
                        ? 'bg-rose-100 text-[#BE123C] border-rose-200'
                        : demo.role === 'business'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-amber-100 text-amber-900 border-amber-200';

                    return (
                      <button
                        key={demo.id}
                        onClick={() => {
                          loginAsDemoUser(demo);
                          onEnterApp();
                        }}
                        className="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200 text-left transition-all hover:shadow-lg cursor-pointer flex items-center gap-3 group"
                      >
                        <div
                          className={`w-11 h-11 rounded-xl ${colorStyle} font-extrabold text-sm flex items-center justify-center shrink-0 border`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-[#BE123C]">
                            {demo.name}
                          </h4>
                          <p className="text-[11px] text-slate-600 truncate font-medium">
                            {demo.craftOrDomain} • {demo.location}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#BE123C] group-hover:translate-x-0.5 transition-all" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLEAN SIGN IN */}
          {authMode === 'login' && (
            <form onSubmit={handleSignIn} className="space-y-4 animate-in fade-in duration-150">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#BE123C] shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    {t('Email Address', 'ईमेल पता')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. artisan@craft.in or demo email"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#BE123C] focus:bg-white text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    {t('Password', 'पासवर्ड')}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#BE123C] focus:bg-white text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#881337] to-[#BE123C] text-white font-bold text-xs shadow-lg shadow-rose-950/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t('Sign In')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER NEW USER */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 animate-in fade-in duration-150 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Select Role:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('artisan')}
                    className={`py-2 rounded-xl text-center text-xs font-bold cursor-pointer border ${
                      registerRole === 'artisan'
                        ? 'bg-rose-50 text-[#BE123C] border-[#BE123C] ring-2 ring-rose-200'
                        : 'bg-white/80 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t('Artisan Maker')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterRole('business')}
                    className={`py-2 rounded-xl text-center text-xs font-bold cursor-pointer border ${
                      registerRole === 'business'
                        ? 'bg-blue-50 text-blue-800 border-blue-600 ring-2 ring-blue-200'
                        : 'bg-white/80 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t('B2B Buyer')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterRole('customer')}
                    className={`py-2 rounded-xl text-center text-xs font-bold cursor-pointer border ${
                      registerRole === 'customer'
                        ? 'bg-amber-50 text-amber-900 border-amber-600 ring-2 ring-amber-200'
                        : 'bg-white/80 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t('Craft Patron')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="e.g. Ramesh Vankar"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#BE123C] focus:bg-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="user@example.in"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#BE123C] focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#BE123C] focus:bg-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={registerLocation}
                    onChange={(e) => setRegisterLocation(e.target.value)}
                    placeholder="e.g. Bhujodi, Gujarat"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#BE123C] focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  {registerRole === 'artisan'
                    ? 'Craft Specialization'
                    : registerRole === 'business'
                    ? 'Business / Organization Name'
                    : 'Craft Interests'}
                </label>
                <input
                  type="text"
                  value={registerCraftOrDomain}
                  onChange={(e) => setRegisterCraftOrDomain(e.target.value)}
                  placeholder={
                    registerRole === 'artisan'
                      ? 'e.g. Handloom Weaving'
                      : registerRole === 'business'
                      ? 'e.g. Heritage Exports Ltd'
                      : 'e.g. Silk, Pottery'
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#BE123C] focus:bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#BE123C] focus:bg-white text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#881337] to-[#BE123C] text-white font-bold text-xs shadow-lg shadow-rose-950/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t('Register New')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between text-xs text-rose-100/90 border-t border-white/20 relative z-10">
        <p className="font-semibold">© 2026 KalaSetu • {t('Empowering artisans')}</p>
        <p className="flex items-center gap-2 font-semibold">
          <span>11 Indian Languages</span>
          <span>•</span>
          <span>Verified Craft Heritage</span>
        </p>
      </footer>
    </div>
  );
};
