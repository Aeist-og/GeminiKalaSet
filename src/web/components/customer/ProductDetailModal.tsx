import React, { useState, useEffect } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  MapPin, 
  Check, 
  Sparkles, 
  Info,
  ArrowLeft
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    setIsCartOpen, 
    wishlist, 
    toggleWishlist, 
    t 
  } = useWebApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProduct]);

  if (!selectedProduct) return null;

  const isLiked = wishlist.includes(selectedProduct.id);
  const price = selectedProduct.pricing?.finalListingPrice || selectedProduct.pricing?.suggestedRetailPrice || 2500;
  const images = selectedProduct.images.length > 0 ? selectedProduct.images : [
    { id: '1', productId: selectedProduct.id, originalUrl: 'https://images.unsplash.com/photo-1606744888344-493238955de0?w=800&q=80', processedUrl: null, isPrimary: true, createdAt: '' }
  ];

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={() => setSelectedProduct(null)}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 my-auto border border-slate-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Prominent Exit / Close Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/80">
          <button
            onClick={() => setSelectedProduct(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Close (ESC)</span>
          </button>

          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {selectedProduct.info.craftType}
          </span>

          <button
            onClick={() => setSelectedProduct(null)}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Section */}
          <div className="p-5 sm:p-6 bg-slate-50 flex flex-col justify-between space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-xs border border-slate-200">
              <img
                src={images[selectedImageIdx]?.processedUrl || images[selectedImageIdx]?.originalUrl}
                alt={selectedProduct.info.titleEn}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIdx === idx ? 'border-[#FF4B6E] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img.processedUrl || img.originalUrl} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Certified Craft Cluster Box */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">{t('Verified Master Craft Cluster', 'सत्यापित शिल्प क्लस्टर')}</p>
                <p className="text-slate-500">{selectedProduct.info.originDistrict}, {selectedProduct.info.originState}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-5 max-h-[75vh] overflow-y-auto">
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4B6E] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    {selectedProduct.info.craftType}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    <span>GI Certified Provenance</span>
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {selectedProduct.info.titleEn}
                </h2>
                {selectedProduct.info.titleHi && (
                  <p className="text-xs text-slate-500 font-hindi mt-0.5">
                    {selectedProduct.info.titleHi}
                  </p>
                )}
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-slate-100">
                <span className="text-2xl font-black text-slate-900">
                  ₹{price.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {t('Direct Maker Rate', 'सीधे कारीगर दर')}
                </span>
              </div>

              {/* Descriptions */}
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>{selectedProduct.info.descriptionEn}</p>
                {selectedProduct.info.descriptionHi && (
                  <p className="font-hindi text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                    {selectedProduct.info.descriptionHi}
                  </p>
                )}
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('Primary Materials', 'प्राथमिक सामग्री')}</span>
                  <span className="font-medium text-slate-800">{selectedProduct.info.material}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('Technique', 'निर्माण तकनीक')}</span>
                  <span className="font-medium text-slate-800">{selectedProduct.info.technique || 'Traditional Handcrafted'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('Dimensions', 'माप')}</span>
                  <span className="font-medium text-slate-800">{selectedProduct.info.dimensions || 'Standard size'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('Production Time', 'निर्माण समय')}</span>
                  <span className="font-medium text-slate-800">{selectedProduct.info.productionTimeDays} {t('Days', 'दिन')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-50 text-[#FF4B6E] hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t('Added to Cart', 'कार्ट में जोड़ा गया')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('Add to Cart', 'कार्ट में जोड़ें')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF4B6E] to-[#FF6B6B] text-white font-bold text-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-200"
                >
                  <span>{t('Instant Buy', 'तुरंत खरीदें')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
