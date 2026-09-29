import React from 'react';
import { useWebApp, SUPPORTED_LANGUAGES, AppLanguage } from '../context/WebAppContext';
import { UserRole } from '../../models/auth';
import {
  X,
  Home,
  Sparkles,
  Layers,
  Palette,
  Tv,
  Briefcase,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  MapPin,
  Globe,
  User,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Camera,
  Mail,
  LogOut,
  Trash2,
  Package,
  Heart,
  Crown,
  Building
} from 'lucide-react';

interface FlipkartSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlipkartSidebarDrawer: React.FC<FlipkartSidebarDrawerProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    currentRole,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    t,
    setActiveModal,
    logout,
    deleteAccount,
  } = useWebApp();

  if (!isOpen) return null;

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  const handleOpenProfile = () => {
    setActiveModal('profile');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel (Flipkart Style) */}
      <div className="absolute inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-in slide-in-from-left">
        {/* Header Banner - Flipkart Iconic Indigo/Crimson Gradient with Profile Focus */}
        <div className="bg-gradient-to-r from-[#5B1A42] via-[#881337] to-[#BE123C] text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Section: Photo + Namaste + Name + Designation + Profile Action */}
          <div className="flex items-center gap-3.5 pr-6">
            {/* User Profile Photo with camera overlay */}
            <div 
              onClick={handleOpenProfile}
              className="relative cursor-pointer group shrink-0"
              title={t('Edit Profile Photo & Details', 'प्रोफ़ाइल फोटो व विवरण बदलें')}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white shadow-md overflow-hidden font-bold text-xl group-hover:border-amber-300 transition-colors">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser?.fullName?.charAt(0) || '🌸'}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-amber-400 text-black flex items-center justify-center shadow-xs">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-rose-200 uppercase tracking-wider block">
                {t('Namaste', 'नमस्ते')}
              </span>
              <h2 className="text-base font-extrabold truncate text-white leading-tight">
                {currentUser?.fullName}
              </h2>
              <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white capitalize border border-white/25">
                {currentRole === 'artisan'
                  ? t('Master Artisan', 'मास्टर शिल्पकार')
                  : currentRole === 'business'
                  ? t('Corporate Buyer', 'थोक खरीदार')
                  : t('Craft Patron', 'शिल्प संरक्षक')}
              </span>

              {/* Profile Word & Icon link */}
              <button
                onClick={handleOpenProfile}
                className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-amber-300 hover:text-white transition-colors cursor-pointer group"
              >
                <User className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="underline decoration-amber-400/50 underline-offset-2">
                  {t('Profile & Account (प्रोफ़ाइल)', 'प्रोफ़ाइल व खाता')}
                </span>
                <ChevronRight className="w-3 h-3 text-amber-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Language Toggle Bar */}
        <div className="bg-rose-50/70 border-b border-rose-100 px-4 py-2.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-[#BE123C] font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {currentRole === 'artisan' ? t('Artisan Workspace', 'शिल्पकार कार्यक्षेत्र') : currentRole === 'business' ? t('B2B Sourcing Hub', 'थोक खरीद हब') : t('Handmade Marketplace', 'शिल्प बाज़ार')}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="text-[11px] font-bold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Role-Specific Navigation */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 text-xs">
          
          {/* ROLE 1: ARTISAN SPECIFIC FEATURES ONLY */}
          {currentRole === 'artisan' && (
            <>
              {/* Section: AI Studio & Creation */}
              <div className="p-3 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {t('AI Creative Studio & Tools', 'एआई क्रिएटिव स्टूडियो व उपकरण')}
                </div>

                <button
                  onClick={() => handleNav('wizard')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'wizard' || activeTab === 'image_studio'
                      ? 'bg-[#E11D48] text-white shadow-sm'
                      : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-rose-100 text-[#E11D48]">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <span>{t('Smart Catalog & AI Studio', 'स्मार्ट कैटलॉग व एआई फोटो')}</span>
                      <p className="text-[10px] text-gray-500 font-normal">
                        {t('Voice listing + background removal + fair pricing', 'बोलकर लिस्टिंग + बैकग्राउंड रिमूवर')}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => handleNav('templates')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'templates'
                      ? 'bg-[#E11D48] text-white shadow-sm'
                      : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                      <Palette className="w-4 h-4" />
                    </span>
                    <div>
                      <span>{t('Lookbook Photo Posters', 'लुकबुक फोटो पोस्टर')}</span>
                      <p className="text-[10px] text-gray-500 font-normal">
                        {t('Auto-generated visual posters from catalogue', 'कैटलॉग से स्वतः निर्मित पोस्टर')}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => handleNav('kalachannel')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                    activeTab === 'kalachannel'
                      ? 'bg-[#E11D48] text-white shadow-sm'
                      : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-rose-100 text-[#E11D48]">
                      <Tv className="w-4 h-4" />
                    </span>
                    <div>
                      <span>{t('KalaChannel Reels & Stories', 'कलाचैनल वीडियो रील्स')}</span>
                      <p className="text-[10px] text-gray-500 font-normal">
                        {t('Craft workshop process video sharing', 'कार्यशाला के वीडियो साझा करें')}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </div>

              {/* Section: Artisan Inventory & Operations */}
              <div className="p-3 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {t('Workshop Management', 'कारीगर कार्यशाला')}
                </div>

                <button
                  onClick={() => handleNav('home')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'home' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-gray-500" />
                    <span>{t('Workspace Dashboard', 'कारीगर डैशबोर्ड')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => handleNav('catalogue')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'catalogue' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span>{t('My Craft Catalogue', 'मेरा प्रकाशित कैटलॉग')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => handleNav('opportunities')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'opportunities' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span>{t('B2B Bulk Opportunities', 'थोक व्यापार मांग (RFQs)')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => handleNav('ondc')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'ondc' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t('ONDC Seller Readiness', 'ONDC तत्परता व मानक')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => handleNav('maps')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'maps' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>{t('Craft Clusters & GI Map', 'शिल्प क्लस्टर व जीआई मानचित्र')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>

                <button
                  onClick={() => handleNav('qr')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer text-left ${
                    activeTab === 'qr' ? 'bg-rose-50 text-[#E11D48] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>{t('Exhibition QR Standee', 'प्रदर्शनी मेला क्यूआर')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              </div>
            </>
          )}

          {/* ROLE 2: B2B CORPORATE BUYER SPECIFIC FEATURES ONLY */}
          {currentRole === 'business' && (
            <div className="p-3 space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {t('B2B Sourcing & Procurement', 'थोक खरीद व ऑर्डर')}
              </div>

              <button
                onClick={() => handleNav('home')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'home' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                    <Building className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold">{t('Direct Sourcing Overview', 'मास्टर शिल्पकार सीधा संपर्क')}</span>
                    <p className="text-[10px] text-gray-500 font-normal">
                      {t('Corporate dashboard & master artisan directory', 'कॉरपोरेट मुख्य पृष्ठ व शिल्पकार')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => handleNav('discover')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'discover' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <ShoppingBag className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold">{t('Wholesale Sourcing Hub', 'थोक शिल्प बाज़ार')}</span>
                    <p className="text-[10px] text-gray-500 font-normal">
                      {t('Verified artisan direct bulk prices & MOQs', 'कारीगरों से सीधे थोक ऑर्डर')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => handleNav('opportunities')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'opportunities' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold">{t('My Bulk RFQs & Quotes', 'मेरी थोक मांग व कोटेशन')}</span>
                    <p className="text-[10px] text-gray-500 font-normal">
                      {t('Manage corporate purchase requests', 'मांग प्रस्तावों का प्रबंधन')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => handleNav('maps')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'maps' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-rose-100 text-[#E11D48]">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold">{t('Craft Clusters & GI Registry', 'शिल्प क्लस्टर व जीआई रजिस्ट्री')}</span>
                    <p className="text-[10px] text-gray-500 font-normal">
                      {t('Map of authentic GI artisan cooperatives', 'प्रमाणित जीआई क्लस्टर मानचित्र')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => handleNav('kalachannel')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'kalachannel' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <Tv className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold">{t('Artisan Stories & Live Craft', 'कारीगर कहानियां व निर्माण रील्स')}</span>
                    <p className="text-[10px] text-gray-500 font-normal">
                      {t('Authenticity videos directly from looms', 'करघों से सीधे प्रमाणिक वीडियो')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          )}

          {/* ROLE 3: CUSTOMER / CRAFT PATRON SPECIFIC FEATURES ONLY */}
          {currentRole === 'customer' && (
            <div className="p-3 space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {t('Craft Marketplace & Heritage', 'शिल्प बाज़ार व विरासत')}
              </div>

              <button
                onClick={() => handleNav('marketplace')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'marketplace' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-rose-100 text-[#E11D48]">
                    <ShoppingBag className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold">{t('Discover Handmade Crafts', 'प्रामाणिक हस्तशिल्प खोजें')}</span>
                    <p className="text-[10px] text-gray-500 font-normal">
                      {t('100% Direct Fair Wage authentic crafts', 'सीधे कारीगरों से खरीदारी')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => handleNav('kalachannel')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'kalachannel' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <Tv className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold">{t('KalaChannel Reels & Stories', 'कलाचैनल वीडियो रील्स')}</span>
                    <p className="text-[10px] text-gray-500 font-normal">
                      {t('Short video stories behind Indian crafts', 'शिल्पों की लघु वीडियो कहानियां')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => handleNav('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'orders' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <Package className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold">{t('My Orders & Tracking', 'मेरे ऑर्डर व ट्रैकिंग')}</span>
                    <p className="text-[10px] text-gray-500 font-normal">
                      {t('View order status and dispatch updates', 'ऑर्डर स्थिति देखें')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => handleNav('maps')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'maps' ? 'bg-[#E11D48] text-white shadow-sm' : 'text-gray-800 hover:bg-rose-50 hover:text-[#E11D48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold">{t('Craft Clusters & Heritage Map', 'शिल्प क्लस्टर मानचित्र')}</span>
                    <p className="text-[10px] text-gray-500 font-normal">
                      {t('Explore origins of Patola, Dhokra, Blue Pottery', 'शिल्प उत्पत्ति स्थान जानें')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          )}

          {/* Section: Account, Email Query & Support for ALL Users */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {t('Profile & Assistance', 'प्रोफ़ाइल व सहायता')}
            </div>

            <button
              onClick={handleOpenProfile}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold transition-colors cursor-pointer text-left border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-gray-200 text-gray-800">
                  <User className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs">{t('Edit Profile & Curiosities', 'प्रोफ़ाइल व पसंद बदलें')}</span>
                  <p className="text-[10px] text-gray-500 font-normal">
                    {t('Name, photo, interests, address', 'नाम, फोटो, शिल्प रुचि')}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Direct Email Query to hhhworkk@gmail.com */}
            <a
              href="mailto:hhhworkk@gmail.com?subject=KalaSetu%20Query%20from%20App"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-50/60 hover:bg-rose-100 text-[#BE123C] font-bold transition-colors cursor-pointer text-left border border-rose-200 block"
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-rose-200 text-[#BE123C]">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs">{t('Email Query to Team', 'ईमेल द्वारा प्रश्न भेजें')}</span>
                  <p className="text-[10px] text-gray-600 font-mono">hhhworkk@gmail.com</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#BE123C]" />
            </a>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-semibold transition-colors cursor-pointer text-left mt-2"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-gray-500" />
                <span>{t('Log Out of Account', 'खाते से लॉग आउट करें')}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>
          </div>
        </div>

        {/* Footer info in drawer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400 flex items-center justify-between shrink-0">
          <span>KalaSetu v1.4</span>
          <span className="text-gray-500 font-mono">hhhworkk@gmail.com</span>
        </div>
      </div>
    </div>
  );
};
