import React, { useState } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { Product } from '../../../models/product';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Eye, 
  ShieldCheck, 
  MapPin, 
  Check,
  Sparkles
} from 'lucide-react';

export const CustomerMarketplace: React.FC = () => {
  const { 
    products, 
    addToCart, 
    setSelectedProduct, 
    wishlist, 
    toggleWishlist, 
    t 
  } = useWebApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  // Filter published products
  const publishedProducts = products.filter((p) => p.status === 'published');

  const filtered = publishedProducts.filter((p) => {
    const matchSearch =
      p.info.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.info.craftType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.info.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.info.originState.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCraft =
      selectedCraft === 'all' || p.info.craftType.toLowerCase().includes(selectedCraft.toLowerCase());
    return matchSearch && matchCraft;
  }).sort((a, b) => {
    const priceA = a.pricing?.finalListingPrice || a.pricing?.suggestedRetailPrice || 0;
    const priceB = b.pricing?.finalListingPrice || b.pricing?.suggestedRetailPrice || 0;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    return 0;
  });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedNoticeId(product.id);
    setTimeout(() => setAddedNoticeId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Clean Marketplace Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#F59E0B] text-white p-5 sm:p-7 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('Authentic Indian Crafts', 'प्रामाणिक भारतीय हस्तशिल्प')}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t('Discover Genuine Crafts Direct from Makers', 'सीधे कारीगरों से खरीदें प्रामाणिक कला')}
          </h1>

          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            {t(
              'Direct-to-maker marketplace with verified craft origins and transparent artisan earnings.',
              'बिचौलियों के बिना सीधे भारतीय शिल्पकारों का समर्थन करें।'
            )}
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('Search crafts, materials, states...', 'खोजें: कच्छ शॉल, ब्लू पॉटरी, रेशम...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">{t('Sort By:', 'क्रम:')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium cursor-pointer"
            >
              <option value="featured">{t('Featured', 'विशेष')}</option>
              <option value="price-asc">{t('Price: Low to High', 'मूल्य: कम से ज्यादा')}</option>
              <option value="price-desc">{t('Price: High to Low', 'मूल्य: ज्यादा से कम')}</option>
            </select>
          </div>
        </div>

        {/* Craft Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'all', label: t('All Crafts', 'सभी शिल्प') },
            { id: 'Weaving', label: t('Handloom Weaving', 'हथकरघा बुनाई') },
            { id: 'Pottery', label: t('Blue Pottery', 'ब्लू पॉटरी') },
            { id: 'Dhokra', label: t('Dhokra Metalcraft', 'ढोकरा धातुशिल्प') },
            { id: 'Home', label: t('Home & Living', 'गृह सज्जा') },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCraft(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCraft === cat.id
                  ? 'bg-[#EA580C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product) => {
          const isLiked = wishlist.includes(product.id);
          const price = product.pricing?.finalListingPrice || product.pricing?.suggestedRetailPrice || 2500;
          const imgUrl = product.images?.[0]?.processedUrl || product.images?.[0]?.originalUrl || 'https://images.unsplash.com/photo-1606744888344-493238955de0?w=800&q=80';

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Product Image */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={imgUrl}
                    alt={product.info.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* GI Provenance Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>GI Verified</span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isLiked ? 'bg-rose-50 text-[#FF4B6E]' : 'bg-white/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-[#EA580C]">{product.info.craftType}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{product.info.originState}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-[#EA580C] transition-colors">
                    {product.info.titleEn}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.info.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Price & Add to Cart Action */}
              <div className="p-3.5 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <span className="text-base font-extrabold text-slate-900">
                    ₹{price.toLocaleString()}
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-semibold">
                    Direct Maker Rate
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      addedNoticeId === product.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#EA580C] text-white hover:bg-amber-700'
                    }`}
                  >
                    {addedNoticeId === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t('Added!', 'जोड़ा गया!')}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t('Add to Cart', 'कार्ट में जोड़ें')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
