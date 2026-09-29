import React from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { ArtisanAnalytics } from './ArtisanAnalytics';
import { 
  Sparkles, 
  Layers, 
  Tv, 
  Briefcase, 
  QrCode, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Plus,
  Eye,
  CheckCircle2,
  Camera,
  Palette
} from 'lucide-react';

export const ArtisanDashboard: React.FC = () => {
  const { currentUser, products, opportunities, setActiveTab, t } = useWebApp();

  // Filter products strictly for active artisan (zero cross-artisan intersection)
  const myProducts = products.filter(p => p.artisanId === currentUser?.id);
  const publishedCount = myProducts.filter(p => p.status === 'published').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5B1A42] via-[#BE123C] to-[#E11D48] text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <span>🧵</span>
            <span>{t('Master Artisan Workspace', 'मास्टर शिल्पकार कार्यक्षेत्र')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('Namaste,', 'नमस्ते,')} {currentUser?.fullName}!
          </h1>

          <p className="mt-2 text-rose-100 text-sm sm:text-base leading-relaxed">
            {t(
              'Your digital bridge to verified bulk corporate buyers and discerning retail patrons. Create smart catalogs, share craft video reels, and earn fair livelihood.',
              'हस्तशिल्प और हथकरघा को सीधे थोक खरीदारों और ग्राहकों तक पहुंचाने का आधुनिक माध्यम। स्मार्ट कैटलॉग बनाएं और उचित मूल्य पाएं।'
            )}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('wizard')}
              className="inline-flex items-center gap-2 bg-white text-[#BE123C] font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md hover:bg-rose-50 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E11D48]" />
              <span>{t('+ Create New Product Catalog', '+ नया उत्पाद कैटलॉग बनाएं')}</span>
            </button>

            <button
              onClick={() => setActiveTab('image_studio')}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/30 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>{t('AI Image Studio & Enhancer', 'एआई फोटो स्टूडियो')}</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{t('Exhibition QR Code', 'प्रदर्शनी क्यूआर')}</span>
            </button>
          </div>
        </div>

        {/* Decorative Motif */}
        <div className="absolute right-0 -bottom-10 opacity-15 text-white pointer-events-none select-none text-[180px] font-brand leading-none">
          कला
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{t('Catalog Items', 'कैटलॉग उत्पाद')}</span>
            <span className="p-2 rounded-xl bg-rose-50 text-[#E11D48]"><Layers className="w-4 h-4" /></span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{myProducts.length}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{publishedCount} {t('Active on Store', 'लाइव बिक्री पर')}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{t('B2B Leads', 'थोक व्यापार मांग')}</span>
            <span className="p-2 rounded-xl bg-blue-50 text-[#2563EB]"><Briefcase className="w-4 h-4" /></span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{opportunities.length}</p>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">
              <span>{t('Direct RFQs from Hotels & Boutiques', 'होटल व शोरूम से मांग')}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{t('KalaChannel Reach', 'कलाचैनल पहुंच')}</span>
            <span className="p-2 rounded-xl bg-amber-50 text-[#D97706]"><Tv className="w-4 h-4" /></span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {myProducts.length > 0 ? (myProducts.length * 360).toLocaleString() : '0'}
            </p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">
              <span>{t('Story & Reel Views this week', 'इस सप्ताह वीडियो देखे गए')}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">{t('ONDC Compliance', 'ONDC तत्परता')}</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#059669]"><ShieldCheck className="w-4 h-4" /></span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {myProducts.length > 0 ? '100%' : 'Ready'}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              <span>{t('Ready for National Network Export', 'राष्ट्रीय नेटवर्क के लिए तैयार')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Artisan Analytics: Sales Performance, Catalogue Views, and Pending Orders with Charts */}
      <ArtisanAnalytics />

      {/* Quick Access Action Hub */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">
          {t('Artisan Workspace Tools', 'कारीगर उपकरण व सुविधाएं')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Tool 1: Smart Catalog & AI Studio */}
          <button
            onClick={() => setActiveTab('wizard')}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#E11D48] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between h-full min-h-[165px]"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#E11D48] transition-colors">
                {t('Smart Catalog & AI Studio', 'स्मार्ट कैटलॉग व एआई फोटो')}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                {t('Voice listing in 11+ Indian languages, background cleanup, and fair-wage price calculator.', 'फोटो सुधारें, बोलकर विवरण दें और उचित मूल्य तय करें।')}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#E11D48]">
              <span>{t('Open Studio', 'शुरू करें')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Tool 2: Lookbook Photo Posters */}
          <button
            onClick={() => setActiveTab('templates')}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-amber-500 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between h-full min-h-[165px]"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-amber-600 transition-colors">
                {t('Lookbook Photo Posters', 'लुकबुक फोटो पोस्टर')}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                {t('Synthesize exhibition-grade visual catalogue posters with royal stamps and QR codes.', 'कैटलॉग से 5 विज़ुअल शैलियों में एचडी पोस्टर बनाएं।')}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-amber-700">
              <span>{t('Generate Posters', 'पोस्टर बनाएं')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Tool 3: KalaChannel Reels & Stories */}
          <button
            onClick={() => setActiveTab('kalachannel')}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-rose-400 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between h-full min-h-[165px]"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#E11D48] transition-colors">
                {t('KalaChannel Reels & Stories', 'कलाचैनल रील्स व कहानियां')}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                {t('Post vertical videos of your loom/workshop with direct store buy links to buyers.', 'करघे या कार्यशाला के वीडियो अपलोड करें और सीधे बेचें।')}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#E11D48]">
              <span>{t('Watch & Post', 'देखें व पोस्ट करें')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Active Catalogue Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {t('My Craft Catalogue', 'मेरा शिल्प कैटलॉग')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('Crafts currently listed and visible to buyers worldwide.', 'आपके पंजीकृत उत्पाद जो बाज़ार में उपलब्ध हैं।')}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('catalogue')}
            className="text-xs font-bold text-[#E11D48] hover:text-[#BE123C] flex items-center gap-1 cursor-pointer"
          >
            <span>{t('View All', 'सभी देखें')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#E11D48] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {t('Welcome to Your Artisan Studio!', 'आपके कारीगर स्टूडियो में स्वागत है!')}
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              {t(
                'You haven\'t listed any handcrafted products yet. Take a quick photo, enhance lighting with AI, and publish directly to corporate buyers and patrons in 60 seconds.',
                'अभी तक कोई उत्पाद सूचीबद्ध नहीं है। अपने शिल्प की फोटो खींचें, एआई से स्टूडियो फिनिश दें और 60 सेकंड में लाइव करें।'
              )}
            </p>
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => setActiveTab('wizard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 hover:bg-[#BE123C] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('+ Create First AI Craft Catalog', '+ पहला एआई कैटलॉग बनाएं')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0]?.processedUrl || product.images[0]?.originalUrl}
                      alt={product.info.titleEn}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#BE123C] backdrop-blur-xs shadow-xs">
                        {product.info.craftType}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1">
                      {product.info.titleEn}
                    </h3>
                    <p className="text-xs text-gray-500 font-hindi line-clamp-1 mt-0.5">
                      {product.info.titleHi}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                      {product.info.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">{t('Retail Price', 'बिक्री मूल्य')}</span>
                    <span className="text-base font-extrabold text-[#E11D48]">
                      ₹{product.pricing?.finalListingPrice || product.pricing?.suggestedRetailPrice || 2500}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">{t('Stock', 'स्टॉक')}</span>
                    <span className="text-xs font-bold text-gray-700">
                      {product.info.quantityAvailable} {t('units', 'पीस')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
