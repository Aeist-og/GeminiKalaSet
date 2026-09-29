import React, { useState } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { ProductStatus } from '../../../models/product';
import { 
  Plus, 
  Trash2, 
  Eye, 
  Filter, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Archive, 
  Share2, 
  Layers
} from 'lucide-react';

export const ArtisanCatalog: React.FC = () => {
  const { 
    currentUser, 
    products, 
    deleteProduct, 
    changeProductStatus, 
    setSelectedProduct, 
    setActiveTab, 
    t 
  } = useWebApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Filter products strictly for active artisan (zero intersection)
  const myProducts = products.filter(p => p.artisanId === currentUser?.id);

  const filtered = myProducts.filter(p => {
    const matchSearch = p.info.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.info.craftType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Catalog Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E11D48]" />
            <span>{t('Craft Inventory & Catalogue', 'शिल्प सूची व कैटलॉग प्रबंधन')}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('Manage your live products, stock status, pricing, and national digital marketplace listings.', 'अपने उत्पादों की स्थिति, मूल्य और स्टॉक का प्रबंधन करें।')}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('wizard')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E11D48] text-white font-bold text-xs hover:bg-[#BE123C] shadow-md shadow-rose-200 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('+ Add New Product', '+ नया उत्पाद जोड़ें')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('Search by craft, title, or material...', 'खोजें: शिल्प, शीर्षक, सामग्री...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#E11D48]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
          {(['all', 'published', 'draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize cursor-pointer transition-colors ${
                statusFilter === s
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {s === 'all' ? t('All', 'सभी') : s === 'published' ? t('Published', 'लाइव') : t('Drafts', 'ड्राफ्ट')}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-gray-800">{t('No crafts match your filter', 'कोई उत्पाद नहीं मिला')}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {t('Try adjusting your search query or add your first handcrafted product with the Smart Catalog Wizard.', 'नया उत्पाद जोड़ने के लिए विज़ार्ड का उपयोग करें।')}
          </p>
          <button
            onClick={() => setActiveTab('wizard')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('Launch Wizard', 'विज़ार्ड शुरू करें')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  <img
                    src={product.images[0]?.processedUrl || product.images[0]?.originalUrl}
                    alt={product.info.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-[#BE123C] shadow-xs">
                      {product.info.craftType}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        product.status === 'published'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1">
                    {product.info.titleEn}
                  </h3>
                  <p className="text-xs text-gray-500 font-hindi line-clamp-1">
                    {product.info.titleHi}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {product.info.descriptionEn}
                  </p>

                  <div className="pt-2 text-[11px] text-gray-500 flex items-center justify-between border-t border-gray-100">
                    <span>{t('Stock Available:', 'स्टॉक उपलब्ध:')} <strong className="text-gray-800">{product.info.quantityAvailable}</strong></span>
                    <span>{product.info.originState}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/60">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">{t('Retail Price', 'बिक्री मूल्य')}</span>
                    <span className="text-base font-extrabold text-[#E11D48]">
                      ₹{product.pricing?.finalListingPrice || product.pricing?.suggestedRetailPrice || 2500}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">{t('Wholesale / Bulk', 'थोक दर')}</span>
                    <span className="text-xs font-bold text-[#2563EB]">
                      ₹{product.pricing?.suggestedBulkPrice || 2200}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200/60">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                    }}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Preview Product"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('Preview', 'देखें')}</span>
                  </button>

                  <button
                    onClick={() => {
                      const nextStatus: ProductStatus = product.status === 'published' ? 'draft' : 'published';
                      changeProductStatus(product.id, nextStatus);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      product.status === 'published'
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {product.status === 'published' ? t('Unpublish', 'ड्राफ्ट बनाएं') : t('Publish', 'लाइव करें')}
                  </button>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
