import React, { useState } from 'react';
import { useWebApp, AppLanguage, SUPPORTED_LANGUAGES } from '../context/WebAppContext';
import { BrandLogo } from './common/BrandLogo';
import { 
  Globe, 
  Menu, 
  Bell, 
  Settings,
  LogOut,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  User,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    language, 
    setLanguage, 
    t, 
    setActiveTab, 
    setActiveModal,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsSidebarOpen,
    cart,
    setIsCartOpen
  } = useWebApp();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // User notifications
  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Dynamic Theme Colors based on user role to avoid harsh clashes
  const roleTheme =
    currentRole === 'artisan'
      ? {
          topBar: 'bg-gradient-to-r from-[#FF4B6E] via-[#FF6B6B] to-[#FFA07A]',
          accentText: 'text-[#FF4B6E]',
          menuBg: 'bg-rose-50 hover:bg-rose-100 text-[#FF4B6E] border-rose-200/80',
          badge: 'bg-white text-[#FF4B6E]',
          cartButton: 'text-slate-700 hover:text-[#FF4B6E] hover:bg-rose-50 border-slate-200/80',
          label: 'Artisan Maker',
        }
      : currentRole === 'business'
      ? {
          topBar: 'bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]',
          accentText: 'text-[#2563EB]',
          menuBg: 'bg-blue-50 hover:bg-blue-100 text-[#2563EB] border-blue-200/80',
          badge: 'bg-white text-[#1E3A8A]',
          cartButton: 'text-slate-700 hover:text-[#2563EB] hover:bg-blue-50 border-slate-200/80',
          label: 'B2B Buyer',
        }
      : {
          topBar: 'bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#F59E0B]',
          accentText: 'text-[#EA580C]',
          menuBg: 'bg-amber-50 hover:bg-amber-100 text-[#EA580C] border-amber-200/80',
          badge: 'bg-white text-[#C2410C]',
          cartButton: 'text-slate-700 hover:text-[#EA580C] hover:bg-amber-50 border-slate-200/80',
          label: 'Craft Patron',
        };

  // Clean initials without fake emojis
  const userInitials = (currentUser?.fullName || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Role-Specific Header Strip */}
      <div className={`${roleTheme.topBar} text-white px-4 py-1 text-xs transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30">
              KalaSetu
            </span>
            <span className="text-white/95 font-medium text-[11px]">
              Empowering artisans
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Active User Name & Initials */}
            <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded-lg text-[11px] text-white backdrop-blur-xs">
              <span className="w-4 h-4 rounded-full bg-white/25 text-[9px] font-bold flex items-center justify-center text-white">
                {userInitials}
              </span>
              <span className="font-semibold">{currentUser?.fullName}</span>
              <span className={`text-[10px] ${roleTheme.badge} font-bold px-1.5 py-0.2 rounded-md uppercase`}>
                {roleTheme.label}
              </span>
            </div>

            {/* 11-Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3 h-3 text-white/90" />
                <span>{currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-white/80" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800 animate-in fade-in duration-150 max-h-72 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Language / भाषा
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as AppLanguage);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer ${
                        language === lang.code ? `${roleTheme.accentText} font-bold bg-slate-50` : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Menu Drawer 3-Bars Button (No word Menu) & Official Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-xl ${roleTheme.menuBg} transition-all flex items-center justify-center cursor-pointer border shadow-xs active:scale-95`}
              aria-label="Toggle navigation drawer"
              title="Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Official KalaSetu Brand Logo */}
            <button 
              onClick={() => setActiveTab(currentRole === 'artisan' ? 'home' : currentRole === 'business' ? 'discover' : 'marketplace')} 
              className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Right Action Controls: Cart, Notifications & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button with Real-Time Counter (for Customer and B2B Buyer) */}
            {currentRole !== 'artisan' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 ${roleTheme.cartButton} rounded-xl transition-colors cursor-pointer border`}
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4B6E] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-slate-700 hover:text-[#FF4B6E] hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4B6E] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{t('Notifications', 'सूचनाएं')}</h4>
                      <p className="text-[10px] text-slate-500">{currentUser?.fullName}</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-[#FF4B6E] hover:underline font-semibold cursor-pointer"
                      >
                        {t('Mark all read', 'सब पढ़ा हुआ चिह्नित करें')}
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 px-2 py-1">
                    {userNotifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        {t('No notifications yet', 'कोई सूचना नहीं है')}
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 rounded-2xl text-xs transition-colors cursor-pointer ${
                            !notif.read ? 'bg-rose-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900">{notif.title}</span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setActiveModal('settings')}
              className="p-2 text-slate-700 hover:text-[#FF4B6E] hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
