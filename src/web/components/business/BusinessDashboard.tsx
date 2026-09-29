import React, { useState } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { DEMO_USERS } from '../../data/seedData';
import { Product } from '../../../models/product';
import { 
  Compass, 
  Briefcase, 
  FileText, 
  Plus, 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle, 
  Send, 
  X,
  Building,
  Check,
  ShoppingBag,
  ArrowRight,
  Eye
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { 
    currentUser, 
    products, 
    opportunities, 
    postOpportunity, 
    quotes, 
    activeTab, 
    setActiveTab, 
    setSelectedProduct,
    addToCart,
    setIsCartOpen,
    t 
  } = useWebApp();

  // Search & Filter state for Wholesale Sourcing Hub
  const [wholesaleSearch, setWholesaleSearch] = useState<string>('');
  const [wholesaleCraft, setWholesaleCraft] = useState<string>('all');
  const [artisanSearch, setArtisanSearch] = useState<string>('');
  const [rfqSubtab, setRfqSubtab] = useState<'requirements' | 'proposals'>('requirements');
  const [acceptedNotice, setAcceptedNotice] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // RFQ Creation Modal state
  const [isRfqModalOpen, setIsRfqModalOpen] = useState<boolean>(false);
  const [rfqTitle, setRfqTitle] = useState<string>('');
  const [rfqCraft, setRfqCraft] = useState<string>('Handloom Weaving');
  const [rfqQuantity, setRfqQuantity] = useState<number>(50);
  const [rfqBudget, setRfqBudget] = useState<number>(75000);
  const [rfqDeadline, setRfqDeadline] = useState<string>('Within 30 Days');
  const [rfqLocation, setRfqLocation] = useState<string>('Mumbai, Maharashtra');
  const [rfqDescription, setRfqDescription] = useState<string>('');

  // Artisans from seed data
  const artisans = DEMO_USERS.filter((u) => u.role === 'artisan');

  const filteredArtisans = artisans.filter((a) => {
    const matchSearch =
      (a.name || '').toLowerCase().includes(artisanSearch.toLowerCase()) ||
      (a.craftOrDomain || '').toLowerCase().includes(artisanSearch.toLowerCase()) ||
      (a.location || '').toLowerCase().includes(artisanSearch.toLowerCase());
    return matchSearch;
  });

  // Filter published products for Wholesale Catalog
  const publishedProducts = products.filter((p) => p.status === 'published');
  const filteredWholesaleProducts = publishedProducts.filter((p) => {
    const matchCraft =
      wholesaleCraft === 'all' ||
      (p.info?.craftType || '').toLowerCase().includes(wholesaleCraft.toLowerCase());
    const matchSearch =
      (p.info?.titleEn || '').toLowerCase().includes(wholesaleSearch.toLowerCase()) ||
      (p.info?.material || '').toLowerCase().includes(wholesaleSearch.toLowerCase()) ||
      (p.info?.originState || '').toLowerCase().includes(wholesaleSearch.toLowerCase());
    return matchCraft && matchSearch;
  });

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqTitle.trim()) return;

    postOpportunity({
      businessId: currentUser?.id || 'demo-business-1',
      businessName: currentUser?.fullName ? `${currentUser.fullName} Procurement` : 'Heritage Procurement',
      title: rfqTitle,
      craftType: rfqCraft,
      description: rfqDescription || `Procurement of ${rfqQuantity} units of authentic handcrafted ${rfqCraft}.`,
      quantity: rfqQuantity,
      budget: rfqBudget,
      deadline: rfqDeadline,
      location: rfqLocation,
      status: 'open',
    });

    setIsRfqModalOpen(false);
    setActiveTab('opportunities');
    setRfqSubtab('requirements');
  };

  const handleInquireWholesaleProduct = (p: Product) => {
    setRfqTitle(`Bulk Order: ${p.info?.titleEn || 'Handcrafted Craft'}`);
    setRfqCraft(p.info?.craftType || 'Handloom Weaving');
    setRfqQuantity(25);
    const bulkRate = p.pricing?.suggestedBulkPrice || 2000;
    setRfqBudget(bulkRate * 25);
    setRfqDescription(`Procurement inquiry for 25 units of ${p.info?.titleEn}. Inquiring on lead times and delivery.`);
    setIsRfqModalOpen(true);
  };

  const handleAddToCartWithFeedback = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  // Determine current B2B view
  const isMainHomePage = activeTab === 'home' || !activeTab;
  const isWholesaleHub = activeTab === 'discover' || activeTab === 'wholesale';
  const isRfqBoard = activeTab === 'opportunities' || activeTab === 'requirements' || activeTab === 'proposals';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ========================================================================= */}
      {/* 1. MAIN B2B OVERVIEW PAGE ONLY: COMPACT HERO BANNER                       */}
      {/* ========================================================================= */}
      {isMainHomePage && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Hero Poster - Shortened and Compact */}
          <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold">
                <Building className="w-3.5 h-3.5" />
                <span>{t('B2B Sourcing Hub', 'थोक व्यापार व सीधी खरीद')}</span>
              </div>

              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                {t('Welcome,', 'स्वागत है,')} {currentUser?.fullName || t('Partner', 'साझीदार')}
              </h1>

              <p className="text-blue-100 text-xs font-normal">
                {t(
                  'Source authentic verified crafts directly from certified makers across India.',
                  'सीधे प्रमाणित कारीगरों से संपर्क करें, कैटलॉग देखें व थोक मांग जारी करें।'
                )}
              </p>

              {/* Quick Action Buttons */}
              <div className="pt-1.5 flex flex-wrap gap-2">
                <button
                  onClick={() => setIsRfqModalOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-white text-[#2563EB] font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('Post Bulk RFQ', 'नई थोक मांग')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('discover')}
                  className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs border border-white/30 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('Browse Wholesale Catalog', 'थोक कैटलॉग')} ({publishedProducts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('opportunities')}
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('RFQs & Quotes', 'मांग व प्रस्ताव')} ({quotes.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('Available Craft Listings', 'उपलब्ध उत्पाद')}</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{publishedProducts.length}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Verified Authenticity</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('Active Sourcing RFQs', 'सक्रिय थोक मांग')}</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">{opportunities.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Open for artisan bidding</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('Artisan Proposals', 'प्राप्त बोलियां')}</span>
              <p className="text-2xl font-bold text-[#2563EB] mt-1">{quotes.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Direct artisan rates</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('Direct Savings', 'बचत')}</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">30% - 40%</p>
              <p className="text-[11px] text-slate-500 mt-1">Fair transparent pricing</p>
            </div>
          </div>

          {/* Verified Master Artisans Section */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#2563EB]" />
                  <span>{t('Verified Master Artisans Directory', 'सत्यापित मास्टर शिल्पकार')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('Direct access to craft clusters and master weavers across India.', 'पारंपरिक शिल्प क्लस्टर्स से सीधे संपर्क।')}
                </p>
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search artisans or crafts..."
                  value={artisanSearch}
                  onChange={(e) => setArtisanSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredArtisans.map((artisan) => {
                const artisanCrafts = products.filter((p) => p.artisanId === artisan.id);
                const initials = (artisan.name || 'Artisan')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={artisan.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        {/* Profile photo or clean initials (no fake emojis) */}
                        <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#1E3A8A] font-bold text-sm flex items-center justify-center shadow-xs border border-blue-200">
                          {initials}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span>GI Verified</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{artisan.name}</h4>
                        <p className="text-xs font-medium text-[#2563EB]">{artisan.title}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{artisan.location}</span>
                        </p>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('Specialization', 'विशेषज्ञता')}</span>
                        <p className="font-medium text-slate-800">{artisan.craftOrDomain}</p>
                      </div>

                      {/* Accessible & Viewable Catalogue Samples */}
                      {artisanCrafts.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('Catalogue Samples', 'कैटलॉग नमूने')}</span>
                            <span className="text-[10px] text-[#2563EB] font-semibold">{t('Click to View', 'देखें')}</span>
                          </div>
                          <div className="flex gap-2">
                            {artisanCrafts.slice(0, 3).map((p) => {
                              const img = p.images?.[0]?.processedUrl || p.images?.[0]?.originalUrl || 'https://images.unsplash.com/photo-1606744888344-493238955de0?w=800&q=80';
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => setSelectedProduct(p)}
                                  className="relative group cursor-pointer focus:outline-none"
                                  title={p.info?.titleEn}
                                >
                                  <img
                                    src={img}
                                    alt={p.info?.titleEn || 'Craft'}
                                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 group-hover:border-[#2563EB] group-hover:scale-105 transition-all shadow-xs"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => {
                          setRfqCraft(artisan.craftOrDomain || 'Handloom Weaving');
                          setRfqTitle(`Bulk Order: ${artisan.craftOrDomain}`);
                          setIsRfqModalOpen(true);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('Request Quotation', 'थोक भाव मांगें')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DEDICATED WHOLESALE SOURCING HUB PAGE (NO BIG POSTER)                 */}
      {/* ========================================================================= */}
      {isWholesaleHub && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Clean Wholesale Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB]">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {t('Wholesale Sourcing Hub', 'थोक शिल्प बाज़ार')}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    'Direct wholesale rates and sample ordering from verified artisan makers.',
                    'सीधे कारीगरों से थोक दरों और नमूनों पर खरीदारी करें।'
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRfqModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('Post Custom RFQ', 'कस्टम मांग बनाएं')}</span>
            </button>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {['all', 'Weaving', 'Pottery', 'Metal', 'Silk'].map((c) => (
                <button
                  key={c}
                  onClick={() => setWholesaleCraft(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer transition-colors ${
                    wholesaleCraft === c
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c === 'all' ? t('All Crafts', 'सभी शिल्प') : c}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('Search wholesale items...', 'उत्पाद, सामग्री खोजें...')}
                value={wholesaleSearch}
                onChange={(e) => setWholesaleSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Wholesale Products Grid with Sample Viewable Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredWholesaleProducts.map((product) => {
              const retailPrice = product.pricing?.finalListingPrice || product.pricing?.suggestedRetailPrice || 2500;
              const bulkPrice = product.pricing?.suggestedBulkPrice || Math.round(retailPrice * 0.8);
              const marginSaved = Math.round(((retailPrice - bulkPrice) / retailPrice) * 100);
              const imgUrl = product.images?.[0]?.processedUrl || product.images?.[0]?.originalUrl || 'https://images.unsplash.com/photo-1606744888344-493238955de0?w=800&q=80';

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image with GI Tag (Read-Only) */}
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer group"
                    >
                      <img
                        src={imgUrl}
                        alt={product.info?.titleEn || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 shadow-xs">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>GI Certified</span>
                      </div>

                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                        Save {marginSaved}%
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-[#2563EB]">{product.info?.craftType}</span>
                        <span>{product.info?.originState}</span>
                      </div>

                      <h3 
                        onClick={() => setSelectedProduct(product)}
                        className="font-bold text-xs text-slate-900 line-clamp-1 hover:text-[#2563EB] cursor-pointer"
                      >
                        {product.info?.titleEn}
                      </h3>

                      <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{t('Wholesale Unit Rate:', 'थोक दर:')}</span>
                          <span className="font-bold text-[#2563EB] text-sm">₹{bulkPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">{t('Retail Reference:', 'खुदरा मूल्य:')}</span>
                          <span className="text-slate-500 line-through">₹{retailPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Sample & Real-Time Cart */}
                  <div className="p-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('Inspect', 'देखें')}</span>
                    </button>

                    <button
                      onClick={(e) => handleAddToCartWithFeedback(product, e)}
                      className="flex-1 py-1.5 rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border border-blue-200"
                      title="Order Sample"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {justAddedId === product.id ? t('Added!', 'जोड़ा गया!') : t('Sample Unit', 'नमूना ऑर्डर')}
                      </span>
                    </button>

                    <button
                      onClick={() => handleInquireWholesaleProduct(product)}
                      className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>{t('RFQ', 'मांग')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RFQS & RECEIVED PROPOSALS BOARD                                       */}
      {/* ========================================================================= */}
      {isRfqBoard && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {acceptedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{acceptedNotice}</span>
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {t('Sourcing RFQs & Bids', 'थोक मांग व बोलियां')}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('Manage bulk requirements and review artisan proposals directly.', 'मांग और कारीगरों के प्रस्तावों का प्रबंधन करें।')}
              </p>
            </div>

            <button
              onClick={() => setIsRfqModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('Post New Requirement', 'नई मांग पोस्ट करें')}</span>
            </button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setRfqSubtab('requirements')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                rfqSubtab === 'requirements' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t('Active Requirements', 'सक्रिय मांग')} ({opportunities.length})
            </button>
            <button
              onClick={() => setRfqSubtab('proposals')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                rfqSubtab === 'proposals' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t('Received Quotes', 'प्राप्त प्रस्ताव')} ({quotes.length})
            </button>
          </div>

          {rfqSubtab === 'requirements' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {opp.craftType}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Open for Bidding
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{opp.title}</h3>
                  <p className="text-xs text-slate-600">{opp.description}</p>

                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Quantity</span>
                      <span className="font-bold text-slate-800">{opp.quantity} units</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Budget</span>
                      <span className="font-bold text-[#2563EB]">₹{opp.budget.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Timeline</span>
                      <span className="font-bold text-slate-800">{opp.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotes.map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{q.artisanName}</h4>
                      <p className="text-xs text-emerald-600 font-semibold">Direct Artisan Quote</p>
                    </div>
                    <span className="text-sm font-bold text-[#2563EB]">₹{q.totalQuotedPrice.toLocaleString()}</span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">{q.notes}</p>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Est. Production: <strong>{q.estimatedDays} Days</strong></span>
                    <button
                      onClick={() => setAcceptedNotice(`Proposal from ${q.artisanName} accepted! Artisan notified.`)}
                      className="px-3 py-1.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Accept Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RFQ Creation Modal */}
      {isRfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl relative animate-in zoom-in-95">
            <button
              onClick={() => setIsRfqModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900">{t('Post Bulk Sourcing Requirement', 'थोक मांग पोस्ट करें')}</h3>

            <form onSubmit={handleCreateRfq} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Requirement Title</label>
                <input
                  type="text"
                  value={rfqTitle}
                  onChange={(e) => setRfqTitle(e.target.value)}
                  placeholder="e.g. Sourcing 50 Handwoven Silk Sarees"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Craft Discipline</label>
                  <select
                    value={rfqCraft}
                    onChange={(e) => setRfqCraft(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Handloom Weaving">Handloom Weaving</option>
                    <option value="Blue Pottery">Blue Pottery</option>
                    <option value="Dhokra Metalcraft">Dhokra Metalcraft</option>
                    <option value="Terracotta">Terracotta Clay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quantity Needed</label>
                  <input
                    type="number"
                    value={rfqQuantity}
                    onChange={(e) => setRfqQuantity(Number(e.target.value))}
                    min={5}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    value={rfqBudget}
                    onChange={(e) => setRfqBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Timeline</label>
                  <input
                    type="text"
                    value={rfqDeadline}
                    onChange={(e) => setRfqDeadline(e.target.value)}
                    placeholder="e.g. Within 30 Days"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Details & Customizations</label>
                <textarea
                  rows={3}
                  value={rfqDescription}
                  onChange={(e) => setRfqDescription(e.target.value)}
                  placeholder="Describe your design specifications, packaging requirements, etc."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#2563EB] text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
              >
                Post Requirement to Artisan Network
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
