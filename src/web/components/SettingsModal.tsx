import React, { useState, useEffect } from 'react';
import { useWebApp } from '../context/WebAppContext';
import { 
  X, 
  User, 
  LogOut, 
  ShieldCheck, 
  Globe, 
  Database, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Sparkles, 
  Camera, 
  MapPin, 
  Briefcase, 
  Heart, 
  AlertTriangle, 
  Trash2, 
  Save, 
  Send,
  HelpCircle,
  ExternalLink,
  Crown
} from 'lucide-react';

const CRAFT_CURIOSITY_OPTIONS = [
  'Double Ikat Patan Patola',
  'Kutch Kala Cotton Weaving',
  'Jaipur Blue Pottery',
  'Bastar Dhokra Bell Metal',
  'Ajrakh Natural Block Print',
  'Chanderi Silk & Zari',
  'Kashmir Pashmina Shawls',
  'Toda Tribal Embroidery',
  'Bankura Terracotta Crafts',
  'Kondapalli Wooden Toys'
];

export const SettingsModal: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    activeModal, 
    setActiveModal, 
    language, 
    setLanguage, 
    logout, 
    updateUserProfile,
    deleteAccount,
    products,
    t 
  } = useWebApp();

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [state, setState] = useState(currentUser?.state || '');
  const [district, setDistrict] = useState(currentUser?.district || '');
  const [craftSpecialization, setCraftSpecialization] = useState(currentUser?.craftSpecialization || '');
  const [businessName, setBusinessName] = useState(currentUser?.businessName || '');
  const [curiosityInterests, setCuriosityInterests] = useState<string[]>(currentUser?.curiosityInterests || []);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  // UI state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [querySubject, setQuerySubject] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [querySent, setQuerySent] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'profile' | 'support' | 'security'>('profile');

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setLocation(currentUser.location || '');
      setState(currentUser.state || '');
      setDistrict(currentUser.district || '');
      setCraftSpecialization(currentUser.craftSpecialization || '');
      setBusinessName(currentUser.businessName || '');
      setCuriosityInterests(currentUser.curiosityInterests || []);
      setAvatarUrl(currentUser.avatarUrl || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  if (activeModal !== 'settings' && activeModal !== 'profile') return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      phone,
      email,
      location,
      state,
      district,
      craftSpecialization,
      businessName,
      curiosityInterests,
      avatarUrl: avatarUrl || null,
      address,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleCuriosity = (item: string) => {
    if (curiosityInterests.includes(item)) {
      setCuriosityInterests(curiosityInterests.filter(i => i !== item));
    } else {
      setCuriosityInterests([...curiosityInterests, item]);
    }
  };

  const handleSendEmailQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(querySubject || `KalaSetu User Inquiry from ${fullName}`);
    const body = encodeURIComponent(
      `From: ${fullName} (${email || phone})\nRole: ${currentRole}\nAccount ID: ${currentUser?.id}\n\nMessage:\n${queryMessage}`
    );
    window.open(`mailto:hhhworkk@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setQuerySent(true);
    setTimeout(() => {
      setQuerySent(false);
      setQuerySubject('');
      setQueryMessage('');
    }, 4000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto border border-gray-100">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header (Amazon/Flipkart Profile Style) */}
        <div className="pb-4 border-b border-gray-100 flex items-center gap-4 shrink-0">
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-rose-200 overflow-hidden border-2 border-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{fullName.charAt(0) || 'U'}</span>
              )}
            </div>
            <label className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-gray-900 hover:bg-[#E11D48] text-white flex items-center justify-center cursor-pointer shadow-md transition-colors" title="Upload Photo">
              <Camera className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-gray-900 truncate">
                {fullName || t('My Profile & Account', 'मेरी प्रोफ़ाइल व खाता')}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E11D48] text-white capitalize shrink-0">
                {currentRole === 'artisan' ? t('Master Artisan', 'शिल्पकार') : currentRole === 'business' ? t('Corporate Buyer', 'थोक खरीदार') : t('Craft Patron', 'शिल्प संरक्षक')}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {email || phone || 'KalaSetu Verified Account'} • ID: {currentUser?.id}
            </p>
          </div>
        </div>

        {/* Tab Switcher (Flipkart/Amazon Account Navigation) */}
        <div className="flex items-center gap-2 border-b border-gray-100 pt-3 pb-2 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTabSection('profile')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabSection === 'profile'
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t('Personal & Craft Info', 'व्यक्तिगत व शिल्प विवरण')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('support')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabSection === 'support'
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('Help & Email Query', 'सहायता व ईमेल प्रश्न')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('security')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabSection === 'security'
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('Account & Session', 'खाता व लॉगआउट')}</span>
          </button>
        </div>

        {/* Tab 1: Profile & Craft Details */}
        {activeTabSection === 'profile' && (
          <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('Profile information saved successfully!', 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई!')}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {t('Full Name / कार्यशाला नाम', 'पूरा नाम')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-gray-900 font-semibold"
                    placeholder="e.g. Hetvi Patel"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {t('Phone Number / मोबाइल नंबर', 'फ़ोन नंबर')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-gray-900 font-semibold"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {t('Email Address / ईमेल पता', 'ईमेल')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-gray-900 font-semibold"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {t('State / State & Region', 'राज्य व क्षेत्र')}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-gray-900 font-semibold"
                    placeholder="e.g. Patan, Gujarat"
                  />
                </div>
              </div>
            </div>

            {/* Role-Specific Customization */}
            {currentRole === 'artisan' && (
              <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-3">
                <div className="flex items-center gap-2 text-[#BE123C] font-bold">
                  <Crown className="w-4 h-4" />
                  <span>{t('Artisan Craft Specialization & Lineage', 'शिल्पकार विशेषता व जीआई विवरण')}</span>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {t('Primary Craft & Lineage (शिल्प प्रकार)', 'शिल्प कला')}
                  </label>
                  <input
                    type="text"
                    value={craftSpecialization}
                    onChange={(e) => setCraftSpecialization(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:border-[#E11D48] bg-white text-gray-900 font-semibold"
                    placeholder="e.g. Double Ikat Patan Patola & Pure Mulberry Silks (GI #232)"
                  />
                </div>
              </div>
            )}

            {currentRole === 'business' && (
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>{t('B2B Enterprise & Procurement Details', 'कंपनी व खरीद विवरण')}</span>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {t('Company / Brand Name', 'कंपनी / ब्रांड नाम')}
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 focus:border-blue-600 bg-white text-gray-900 font-semibold"
                    placeholder="e.g. FabCraft Home Collections Ltd."
                  />
                </div>
              </div>
            )}

            {currentRole === 'customer' && (
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Heart className="w-4 h-4 text-[#E11D48]" />
                  <span>{t('Craft Curiosity & Heritage Interests (आपकी पसंद)', 'शिल्प पसंद व अभिरुचि')}</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  {t('Select Indian crafts you are curious about to receive tailored artisan discoveries:', 'जिन शिल्पों में आपकी रुचि है उन्हें चुनें:')}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {CRAFT_CURIOSITY_OPTIONS.map((opt) => {
                    const isSelected = curiosityInterests.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleCuriosity(opt)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#E11D48] text-white border-[#E11D48]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                {t('Default Shipping / Delivery Address', 'डिलिवरी पता')}
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-gray-900 font-medium"
                placeholder="Workshop / Office / Home address for shipments"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t('Save Profile Changes', 'प्रोफ़ाइल सहेजें')}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Support & Query Email to hhhworkk@gmail.com */}
        {activeTabSection === 'support' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-[#BE123C] font-extrabold text-sm">
                <Mail className="w-4 h-4" />
                <span>{t('Official Helpdesk & Grievance Email', 'आधिकारिक सहायता ईमेल')}</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-xs">
                {t(
                  'Have questions about artisan onboarding, cataloguing, bulk orders, or technical queries? Send a direct mail to our core operations team at:',
                  'शिल्पकार जोड़ने, कैटलॉगिंग या ऑर्डर संबंधी किसी भी प्रश्न के लिए सीधे हमारी टीम को ईमेल करें:'
                )}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-rose-200 font-mono text-sm text-[#BE123C] font-bold flex items-center justify-between">
                <span>hhhworkk@gmail.com</span>
                <a
                  href="mailto:hhhworkk@gmail.com?subject=KalaSetu%20Support%20Query"
                  className="px-3 py-1 bg-[#E11D48] text-white text-xs rounded-lg hover:bg-[#BE123C] font-sans font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Open Mailbox</span>
                </a>
              </div>
            </div>

            {/* Quick Query Form */}
            <form onSubmit={handleSendEmailQuery} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
              <h4 className="font-bold text-gray-900 text-xs">
                {t('Send Query Directly from App', 'ऐप से सीधे प्रश्न भेजें')}
              </h4>

              {querySent && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('Draft sent to hhhworkk@gmail.com via your email client!', 'ड्राफ़्ट hhhworkk@gmail.com को भेजा गया!')}</span>
                </div>
              )}

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  {t('Subject / विषय', 'विषय')}
                </label>
                <input
                  type="text"
                  required
                  value={querySubject}
                  onChange={(e) => setQuerySubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 font-semibold"
                  placeholder="e.g. Catalog assistance / B2B bulk inquiry"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  {t('Your Message / विवरण', 'संदेश')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium"
                  placeholder="Describe your question or issue in detail..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4 text-rose-400" />
                <span>{t('Transmit Query to hhhworkk@gmail.com', 'hhhworkk@gmail.com पर भेजें')}</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Security, Session, Log Out & Delete Account */}
        {activeTabSection === 'security' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
            {/* Language Preference */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <label className="block font-bold text-gray-800">
                {t('Language Preference / भाषा चुनें', 'भाषा')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    language === 'en'
                      ? 'border-[#E11D48] bg-rose-50 text-[#BE123C]'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>English</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    language === 'hi'
                      ? 'border-[#E11D48] bg-rose-50 text-[#BE123C]'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>हिंदी (Hindi)</span>
                </button>
              </div>
            </div>

            {/* Session Log Out */}
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">{t('Log Out of Account', 'खाते से लॉग आउट करें')}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t('Return to the portal landing page to switch persona or sign in as another user.', 'लॉगिन पृष्ठ पर लौटें।')}
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-100 text-[#BE123C] font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('Log Out', 'लॉग आउट')}</span>
              </button>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200 space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>{t('Danger Zone: Delete Account', 'खाता हमेशा के लिए हटाएं')}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {t(
                  'Deleting your account will erase your local session credentials, saved catalogues, and isolated workshop workspace.',
                  'खाता हटाने से आपका व्यक्तिगत डेटा व सत्र हमेशा के लिए साफ़ हो जाएगा।'
                )}
              </p>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('Delete My Account (खाता हटाएं)', 'खाता हटाएं')}</span>
                </button>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-red-300 space-y-2">
                  <p className="font-bold text-red-700 text-xs">
                    {t('Are you completely sure? This action cannot be undone.', 'क्या आप निश्चित हैं? इसे वापस नहीं किया जा सकता।')}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={deleteAccount}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer"
                    >
                      {t('Yes, Permanently Delete', 'हाँ, खाता हटाएं')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 cursor-pointer"
                    >
                      {t('Cancel', 'रद्द करें')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
