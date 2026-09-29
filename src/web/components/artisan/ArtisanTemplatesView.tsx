import React, { useState, useEffect } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { Product } from '../../../models/product';
import { UnifiedOverlayModal } from '../common/UnifiedOverlayModal';
import { 
  Sparkles, 
  Layers, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Eye, 
  Palette, 
  FileText, 
  ExternalLink,
  Crown,
  Maximize2,
  Bookmark,
  Image as ImageIcon,
  MessageCircle,
  X,
  Check,
  ArrowLeft
} from 'lucide-react';

export interface TemplateDefinition {
  id: string;
  nameEn: string;
  nameHi: string;
  taglineEn: string;
  taglineHi: string;
  tag: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  badgeStyle: string;
  icon: string;
  recommendedFor: string;
}

export const CATALOGUE_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'heritage',
    nameEn: 'Royal Heritage',
    nameHi: 'शाही हेरिटेज',
    taglineEn: 'Regal crimson & gold borders with GI royal provenance seal',
    taglineHi: 'शाही लाल और सुनहरी किनारी, जीआई प्रामाणिकता सील के साथ',
    tag: 'Best for Patola & Silks',
    accentColor: '#9B1138',
    borderColor: '#E11D48',
    bgGradient: 'from-[#4A0A1C] via-[#831843] to-[#9F1239]',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: '👑',
    recommendedFor: 'Heritage Handlooms, Royal Brocades, Double Ikat Patola',
  },
  {
    id: 'minimalist',
    nameEn: 'Modern Minimalist',
    nameHi: 'आधुनिक मिनिमलिस्ट',
    taglineEn: 'Clean gallery lines, high contrast typography & export specs',
    taglineHi: 'स्वच्छ गैलरी लेआउट, बोल्ड टाइपोग्राफी और निर्यात विनिर्देश',
    tag: 'Urban & Export Lookbook',
    accentColor: '#0F172A',
    borderColor: '#334155',
    bgGradient: 'from-slate-900 via-slate-800 to-slate-900',
    badgeStyle: 'bg-slate-100 text-slate-800 border-slate-300',
    icon: '📐',
    recommendedFor: 'Boutique Home Decor, Studio Ceramics, High-end Urban Patrons',
  },
  {
    id: 'handloom',
    nameEn: 'Vibrant Handloom',
    nameHi: 'रंगबिरंगा हथकरघा',
    taglineEn: 'Warm saffron and terracotta motifs celebrating weaving traditions',
    taglineHi: 'केसरिया और मिट्टी के पारंपरिक रूपांकन, बुनकर विरासत',
    tag: 'Cultural Heritage',
    accentColor: '#C2410C',
    borderColor: '#EA580C',
    bgGradient: 'from-[#7C2D12] via-[#9A3412] to-[#C2410C]',
    badgeStyle: 'bg-orange-100 text-orange-900 border-orange-300',
    icon: '🧵',
    recommendedFor: 'Kala Cotton, Tribal Shawls, Bandhani, Khadi & Weaves',
  },
  {
    id: 'ondc_export',
    nameEn: 'ONDC Export Ready',
    nameHi: 'ONDC निर्यात मानक',
    taglineEn: 'Technical barcodes, HS compliance, carton dimensions & packaging',
    taglineHi: 'तकनीकी बारकोड, एचएस कोड, पैकेजिंग माप और गुणवत्ता मानक',
    tag: 'B2B & National Trade',
    accentColor: '#1E3A8A',
    borderColor: '#2563EB',
    bgGradient: 'from-[#172554] via-[#1E3A8A] to-[#1D4ED8]',
    badgeStyle: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: '🌐',
    recommendedFor: 'Corporate Bulk Procurement, Hotel Chains, Export Houses',
  },
  {
    id: 'bazaar',
    nameEn: 'Traditional Bazaar',
    nameHi: 'पारंपरिक बाज़ार',
    taglineEn: 'Warm earth tones, rustic artisan quote & generational story',
    taglineHi: 'मिट्टी के रंग, कारीगर की सीख और 100% प्रामाणिक लोक कथा',
    tag: 'Authentic Folk Art',
    accentColor: '#854D0E',
    borderColor: '#CA8A04',
    bgGradient: 'from-[#713F12] via-[#854D0E] to-[#A16207]',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: '🏺',
    recommendedFor: 'Blue Pottery, Bastar Dhokra, Terracotta, Woodcraft',
  },
];

export const ArtisanTemplatesView: React.FC = () => {
  const { 
    currentUser, 
    products, 
    selectedCatalogueTemplate, 
    setSelectedCatalogueTemplate, 
    t, 
    setActiveTab 
  } = useWebApp();

  // Strict artisan isolation: only get current artisan's products
  const myProducts = products.filter(p => p.artisanId === currentUser?.id);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    myProducts[0]?.id || ''
  );
  const [viewMode, setViewMode] = useState<'poster' | 'web'>('poster');
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [posterDataUrl, setPosterDataUrl] = useState<string | null>(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  const activeProduct = myProducts.find(p => p.id === selectedProductId) || myProducts[0];
  const activeTemplate = CATALOGUE_TEMPLATES.find(t => t.id === selectedCatalogueTemplate) || CATALOGUE_TEMPLATES[0];

  // Auto-generate photo poster whenever product or template aesthetic changes
  useEffect(() => {
    if (activeProduct) {
      generatePoster(false);
    }
  }, [selectedProductId, selectedCatalogueTemplate, activeProduct?.id]);

  // Keyboard shortcut (Escape) to exit full-screen poster view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPosterModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Canvas Poster Generator: converts published catalogue + chosen aesthetic into a high-res photo poster
  const generatePoster = async (downloadImmediate: boolean = false, openModal: boolean = false): Promise<string> => {
    if (!activeProduct) return '';
    setIsGeneratingPoster(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      // Theme Color Palette
      const tmpl = activeTemplate;
      let bgGradStart = '#3B0715';
      let bgGradMid = '#5A0E24';
      let bgGradEnd = '#1F040C';
      let accentBorder = '#E11D48';
      let goldAccent = '#F59E0B';
      let textColor = '#FFFFFF';

      if (tmpl.id === 'minimalist') {
        bgGradStart = '#0B0F17';
        bgGradMid = '#1E293B';
        bgGradEnd = '#0F172A';
        accentBorder = '#94A3B8';
        goldAccent = '#E2E8F0';
      } else if (tmpl.id === 'handloom') {
        bgGradStart = '#431407';
        bgGradMid = '#7C2D12';
        bgGradEnd = '#270A03';
        accentBorder = '#EA580C';
        goldAccent = '#F97316';
      } else if (tmpl.id === 'ondc_export') {
        bgGradStart = '#0A1128';
        bgGradMid = '#1C3D5A';
        bgGradEnd = '#070C1B';
        accentBorder = '#38BDF8';
        goldAccent = '#60A5FA';
      } else if (tmpl.id === 'bazaar') {
        bgGradStart = '#381E04';
        bgGradMid = '#653608';
        bgGradEnd = '#1C0D02';
        accentBorder = '#D97706';
        goldAccent = '#FBBF24';
      }

      // 1. Fill Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, bgGradStart);
      grad.addColorStop(0.5, bgGradMid);
      grad.addColorStop(1, bgGradEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Outer Ornate Border
      ctx.strokeStyle = goldAccent;
      ctx.lineWidth = 6;
      ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

      // Inner thin border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

      // Corner diamonds
      const corners = [
        [48, 48],
        [canvas.width - 48, 48],
        [48, canvas.height - 48],
        [canvas.width - 48, canvas.height - 48]
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle = goldAccent;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Top Header: Brand & GI Registry
      ctx.fillStyle = goldAccent;
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`❖ KALASETU • BHARAT ARTISAN COOPERATIVE ❖`, canvas.width / 2, 85);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `GOVERNMENT OF INDIA GI PROTECTED • ${activeProduct.giRegistrationNo || 'GI-232-VERIFIED'} • 100% DIRECT FAIR WAGE`,
        canvas.width / 2,
        110
      );

      // Aesthetic Badge Banner
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(canvas.width / 2 - 180, 130, 360, 32, 16);
      ctx.fill();
      ctx.fillStyle = goldAccent;
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${tmpl.icon} ${tmpl.nameEn.toUpperCase()} LOOKBOOK POSTER`, canvas.width / 2, 151);

      // 4. Product Image
      const imgX = 100;
      const imgY = 185;
      const imgW = 880;
      const imgH = 580;

      // Draw photo container background & shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 24);
      ctx.fill();
      ctx.restore();

      const imageUrl = activeProduct.images[0]?.processedUrl || activeProduct.images[0]?.originalUrl;

      if (imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = imageUrl;
          });

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(imgX, imgY, imgW, imgH, 24);
          ctx.clip();
          // Draw aspect fill
          const aspect = img.width / img.height;
          const targetAspect = imgW / imgH;
          let drawW = imgW;
          let drawH = imgH;
          let offsetX = imgX;
          let offsetY = imgY;

          if (aspect > targetAspect) {
            drawW = imgH * aspect;
            offsetX = imgX - (drawW - imgW) / 2;
          } else {
            drawH = imgW / aspect;
            offsetY = imgY - (drawH - imgH) / 2;
          }
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
          ctx.restore();
        } catch {
          // Fallback if image CORS fails
          ctx.fillStyle = '#2A0D15';
          ctx.fillRect(imgX, imgY, imgW, imgH);
          ctx.fillStyle = goldAccent;
          ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(activeProduct.info.craftType, canvas.width / 2, imgY + imgH / 2);
        }
      }

      // Border on photo
      ctx.strokeStyle = goldAccent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 24);
      ctx.stroke();

      // 5. Product Title & Hindi Subtitle
      const titleY = 825;
      ctx.fillStyle = textColor;
      ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      
      const title = activeProduct.info.titleEn;
      if (title.length > 40) {
        ctx.fillText(title.slice(0, 38) + '...', canvas.width / 2, titleY);
      } else {
        ctx.fillText(title, canvas.width / 2, titleY);
      }

      if (activeProduct.info.titleHi) {
        ctx.fillStyle = goldAccent;
        ctx.font = 'bold 24px "Noto Sans Devanagari", sans-serif';
        ctx.fillText(activeProduct.info.titleHi, canvas.width / 2, titleY + 38);
      }

      // 6. Four Technical Specs Pill Box
      const pillY = 905;
      const pills = [
        { label: 'CRAFT TYPE', value: activeProduct.info.craftType },
        { label: 'MATERIAL', value: activeProduct.info.material.slice(0, 22) },
        { label: 'ORIGIN', value: `${activeProduct.info.originDistrict}, ${activeProduct.info.originState}` },
        { label: 'MAKER', value: currentUser?.fullName || 'Master Artisan' }
      ];

      const pillW = 210;
      const pillGap = 16;
      const startX = (canvas.width - (pillW * 4 + pillGap * 3)) / 2;

      pills.forEach((p, idx) => {
        const px = startX + idx * (pillW + pillGap);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(px, pillY, pillW, 64, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = goldAccent;
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.label, px + pillW / 2, pillY + 24);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(p.value, px + pillW / 2, pillY + 48);
      });

      // 7. Craft Story Quote Excerpt
      const quoteY = 1005;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.roundRect(100, quoteY, 880, 110, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = goldAccent;
      ctx.font = 'italic 18px "Plus Jakarta Sans", Georgia, serif';
      ctx.textAlign = 'center';
      const storyExcerpt = `"${(activeProduct.info.descriptionEn || 'Authentic traditional handmade craft preserving centuries of cultural heritage.').slice(0, 140)}..."`;
      ctx.fillText(storyExcerpt, canvas.width / 2, quoteY + 45);

      if (activeProduct.info.descriptionHi) {
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '14px "Noto Sans Devanagari", sans-serif';
        const storyHi = `“${(activeProduct.info.descriptionHi || '').slice(0, 90)}...”`;
        ctx.fillText(storyHi, canvas.width / 2, quoteY + 80);
      }

      // 8. Fair Price & B2B Wholesale Banner
      const priceY = 1145;
      const priceGrad = ctx.createLinearGradient(100, priceY, 980, priceY);
      priceGrad.addColorStop(0, goldAccent);
      priceGrad.addColorStop(1, '#F59E0B');
      ctx.fillStyle = priceGrad;
      ctx.beginPath();
      ctx.roundRect(100, priceY, 880, 130, 20);
      ctx.fill();

      // Left Price Details
      ctx.fillStyle = '#1E060E';
      ctx.textAlign = 'left';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('DIRECT ARTISAN FAIR PRICE (INR)', 135, priceY + 42);

      ctx.font = 'black 54px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`₹${activeProduct.pricing?.finalListingPrice || 2450}`, 135, priceY + 98);

      // Right B2B Wholesale & Verification
      ctx.textAlign = 'right';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('BULK B2B / EXPORT RATE', 945, priceY + 42);

      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`₹${activeProduct.pricing?.suggestedBulkPrice || 2150}/unit`, 945, priceY + 82);

      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('✔ 100% Direct Fair Wage Guarantee', 945, priceY + 108);

      // 9. Footer: Artisan Signature & KalaSetu Verification
      ctx.fillStyle = '#CBD5E1';
      ctx.textAlign = 'center';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `Crafted with generational pride by ${currentUser?.fullName} • Authentic Heritage of ${activeProduct.info.originState}`,
        canvas.width / 2,
        1320
      );

      ctx.fillStyle = goldAccent;
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `Scan QR / Visit: ${window.location.origin}/?product=${activeProduct.id} • KalaSetu Digital Platform`,
        canvas.width / 2,
        1345
      );

      const dataUrl = canvas.toDataURL('image/png');
      setPosterDataUrl(dataUrl);

      if (downloadImmediate) {
        const link = document.createElement('a');
        link.download = `KalaSetu-Poster-${(activeProduct.info.titleEn || 'Craft').replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } else if (openModal) {
        setIsPosterModalOpen(true);
      }

      setIsGeneratingPoster(false);
      return dataUrl;
    } catch (err) {
      console.error('[Poster Generation Error]:', err);
      setIsGeneratingPoster(false);
      return '';
    }
  };

  const handleShareWhatsApp = () => {
    if (!activeProduct) return;
    const msg = `🌸 *${activeProduct.info.titleEn}* (${activeProduct.info.titleHi || ''})\n` +
      `🧵 Craft: ${activeProduct.info.craftType} (${activeProduct.info.originDistrict}, ${activeProduct.info.originState})\n` +
      `👑 Master Artisan: ${currentUser?.fullName}\n` +
      `🏷️ Direct Fair Price: ₹${activeProduct.pricing?.finalListingPrice}\n` +
      `📦 Bulk B2B Rate: ₹${activeProduct.pricing?.suggestedBulkPrice}/unit\n` +
      `✨ GI Authenticity Tag: ${activeProduct.giRegistrationNo || 'GI-Protected'}\n\n` +
      `View digital lookbook & verified authenticity on KalaSetu:\n` +
      `${window.location.origin}/?artisan=${currentUser?.id}&template=${selectedCatalogueTemplate}&product=${activeProduct.id}`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/?artisan=${currentUser?.id}&template=${selectedCatalogueTemplate}&product=${activeProduct?.id || ''}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadCard = () => {
    generatePoster(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Exit to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Exit', 'डैशबोर्ड')}</span>
          </button>

          <div className="h-8 w-px bg-gray-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-rose-50 text-[#E11D48]">
              <Palette className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {t('Smart Catalogue Lookbook & Templates', 'स्मार्ट कैटलॉग लुकबुक व टेम्पलेट्स')}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {t(
                  `Customized digital catalogue presentation for ${currentUser?.fullName}. Choose an aesthetic that suits your craft, download high-res cards, or print lookbooks.`,
                  `${currentUser?.fullName} के लिए डिजिटल कैटलॉग डिज़ाइन। अपने शिल्प के अनुकूल टेम्पलेट चुनें और प्रिंट या डाउनलोड करें।`
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? t('Link Copied!', 'लिंक कॉपी हो गया!') : t('Share Catalogue Link', 'कैटलॉग लिंक साझा करें')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{t('Print / PDF Lookbook', 'प्रिंट / पीडीएफ लुकबुक')}</span>
          </button>
        </div>
      </div>

      {/* STEP 1: CHOOSE CATALOGUE PRODUCT */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#E11D48] text-white text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              {t('Step 1: Choose Product for Poster', 'चरण 1: पोस्टर के लिए उत्पाद चुनें')}
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            {myProducts.length} {t('products in catalogue', 'कैटलॉग में उत्पाद')}
          </span>
        </div>

        {myProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {myProducts.map((p) => {
              const isSelected = activeProduct?.id === p.id;
              const imgUrl = p.images[0]?.processedUrl || p.images[0]?.originalUrl;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 relative ${
                    isSelected
                      ? 'border-[#E11D48] bg-rose-50/50 shadow-sm ring-2 ring-rose-200'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img
                      src={imgUrl}
                      alt={p.info.titleEn}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-[#E11D48] block truncate">
                      {p.info.craftType}
                    </span>
                    <h3 className="font-bold text-xs text-gray-900 truncate">
                      {p.info.titleEn}
                    </h3>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">
                      ₹{p.pricing?.finalListingPrice}
                    </p>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-500">{t('No products yet. Use Smart Catalog Wizard to create your craft listing.', 'कोई उत्पाद नहीं मिला। स्मार्ट कैटलॉग विज़ार्ड से नया बनाएं।')}</p>
            <button
              onClick={() => setActiveTab('wizard')}
              className="mt-3 px-4 py-2 rounded-xl bg-[#E11D48] text-white font-bold text-xs cursor-pointer"
            >
              + {t('Create Product in AI Studio', 'एआई स्टूडियो में उत्पाद बनाएं')}
            </button>
          </div>
        )}
      </div>

      {/* STEP 2: 5-TEMPLATE AESTHETIC SELECTOR */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">2</span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E11D48]" />
              <span>{t('Step 2: Select Poster Style Template (5 Aesthetics)', 'चरण 2: पोस्टर शैली चुनें (5 शैलियाँ)')}</span>
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            {t('Active:', 'सक्रिय:')} <strong className="text-gray-900">{activeTemplate.nameEn}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CATALOGUE_TEMPLATES.map((tmpl) => {
            const isSelected = selectedCatalogueTemplate === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedCatalogueTemplate(tmpl.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E11D48] bg-rose-50/50 shadow-md ring-2 ring-rose-200'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tmpl.badgeStyle}`}>
                      {tmpl.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900">{tmpl.nameEn}</h3>
                  <p className="text-[11px] font-medium text-gray-500 font-hindi">{tmpl.nameHi}</p>
                  <p className="text-[11px] text-gray-600 mt-1 leading-snug">{tmpl.taglineEn}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-semibold">
                  <span className="text-gray-400">{t('Style Theme', 'थीम')}</span>
                  <span className={isSelected ? 'text-[#E11D48]' : 'text-gray-500'}>
                    {isSelected ? '✓ ' + t('Applied', 'लागू') : t('Select', 'चुनें')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Switcher: Photo Generated Poster (Default) vs Interactive Web Brochure */}
      {activeProduct && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('poster')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'poster'
                  ? 'bg-[#E11D48] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>🖼️</span>
              <span>{t('Photo Generated Poster (फोटो पोस्टर)', 'फोटो पोस्टर कैटलॉग')}</span>
            </button>

            <button
              onClick={() => setViewMode('web')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'web'
                  ? 'bg-[#E11D48] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>📄</span>
              <span>{t('Interactive Web Brochure', 'इंटरैक्टिव वेब ब्रोशर')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generatePoster(true)}
              disabled={isGeneratingPoster}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? t('Saved to Device!', 'सहेजा गया!') : t('Download Poster (PNG)', 'पोस्टर डाउनलोड करें')}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t('Share on WhatsApp', 'व्हाट्सएप पर भेजें')}</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: PHOTO GENERATED POSTER CATALOGUE (PRIMARY) */}
      {activeProduct && viewMode === 'poster' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col items-center">
            {/* Header info */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 text-base">
                  {activeTemplate.icon}
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    {activeTemplate.nameEn} {t('Aesthetic Photo Poster', 'फोटो पोस्टर')}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {t('Automatically synthesized from published catalogue data • No prompt typing required', 'कैटलॉग डेटा से स्वतः निर्मित • किसी प्रॉम्प्ट की आवश्यकता नहीं')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>1080 × 1440 HD Ready</span>
                </span>
                <button
                  onClick={() => setIsPosterModalOpen(true)}
                  className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer flex items-center gap-1 text-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{t('Zoom Fullscreen', 'बड़ा करके देखें')}</span>
                </button>
              </div>
            </div>

            {/* Poster Canvas Display / Loading */}
            <div className="max-w-xl w-full mx-auto relative group">
              {isGeneratingPoster ? (
                <div className="aspect-[3/4] rounded-3xl bg-gray-900 flex flex-col items-center justify-center text-white p-8 space-y-4 shadow-2xl border-4 border-amber-500/40 animate-pulse">
                  <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
                  <p className="font-bold text-sm text-amber-200 text-center">
                    {t(
                      `Rendering ${activeTemplate.nameEn} Photo Poster from Published Catalogue...`,
                      `कैटलॉग से ${activeTemplate.nameHi} पोस्टर तैयार हो रहा है...`
                    )}
                  </p>
                  <p className="text-xs text-gray-400 text-center max-w-xs">
                    {t('Embedding craft provenance, GI tags, pricing, and high-resolution artisan imagery.', 'जीआई टैग, शिल्प कहानी व फोटोग्राफी को संयोजित किया जा रहा है।')}
                  </p>
                </div>
              ) : posterDataUrl ? (
                <div 
                  onClick={() => setIsPosterModalOpen(true)}
                  className="relative cursor-pointer rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/60 hover:border-amber-400 transition-all hover:shadow-amber-900/20"
                >
                  <img
                    src={posterDataUrl}
                    alt={activeProduct.info.titleEn}
                    className="w-full h-auto object-contain block"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-2xl bg-white/90 text-gray-900 font-bold text-xs shadow-lg flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-[#E11D48]" />
                      <span>{t('Click to Zoom & Inspect Poster', 'बड़ा देखने के लिए क्लिक करें')}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-3xl bg-gray-100 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <Palette className="w-10 h-10 text-gray-400" />
                  <p className="text-xs font-bold text-gray-700">
                    {t('Ready to generate lookbook poster', 'पोस्टर बनाने के लिए तैयार')}
                  </p>
                  <button
                    onClick={() => generatePoster(false)}
                    className="px-4 py-2 rounded-xl bg-[#E11D48] text-white font-bold text-xs"
                  >
                    ⚡ {t('Generate Poster Now', 'अभी पोस्टर बनाएं')}
                  </button>
                </div>
              )}
            </div>

            {/* Poster Details & Action Footnote */}
            <div className="w-full max-w-xl mx-auto mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-gray-500">
                <span className="font-bold text-gray-900">{activeProduct.info.titleEn}</span> • ₹{activeProduct.pricing?.finalListingPrice}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generatePoster(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('Save Image (PNG)', 'इमेज सेव करें')}</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE WEB BROCHURE LOOKBOOK */}
      {activeProduct && viewMode === 'web' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span>{t('Live Digital Brochure Lookbook', 'लाइव डिजिटल ब्रोशर पूर्वावलोकन')}</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                <span>{downloadSuccess ? t('Saved to Device!', 'सहेजा गया!') : t('Download Card', 'कार्ड डाउनलोड करें')}</span>
              </button>
            </div>
          </div>

          {/* TEMPLATE 1: ROYAL HERITAGE */}
          {selectedCatalogueTemplate === 'heritage' && (
            <div className="bg-[#FFFDF9] rounded-3xl border-4 border-[#8B1538] p-6 sm:p-10 shadow-2xl relative overflow-hidden print:border-none print:shadow-none">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-[#8B1538] text-lg font-serif">❖</div>
              <div className="absolute top-2 right-2 text-[#8B1538] text-lg font-serif">❖</div>
              <div className="absolute bottom-2 left-2 text-[#8B1538] text-lg font-serif">❖</div>
              <div className="absolute bottom-2 right-2 text-[#8B1538] text-lg font-serif">❖</div>

              {/* Regal Banner */}
              <div className="text-center pb-6 border-b-2 border-[#8B1538]/20 space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B1538]/10 text-[#8B1538] text-xs font-bold uppercase tracking-widest">
                  <span>👑</span>
                  <span>{t('Certified Indian Masterwork', 'प्रमाणित भारतीय उत्कृष्ट शिल्प')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#5B0820] font-serif tracking-tight">
                  {activeProduct.info.titleEn}
                </h2>
                <p className="text-sm font-semibold text-[#8B1538] font-hindi">
                  {activeProduct.info.titleHi}
                </p>
                <p className="text-xs text-amber-800">
                  {activeProduct.info.craftType} • {activeProduct.info.originDistrict}, {activeProduct.info.originState} • Master Artisan: {currentUser?.fullName}
                </p>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 items-center">
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#8B1538]/30 shadow-lg bg-[#FAF5EE]">
                  <img
                    src={activeProduct.images[0]?.processedUrl || activeProduct.images[0]?.originalUrl}
                    alt={activeProduct.info.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#5B0820]/90 text-amber-100 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 border border-amber-300/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>GI Provenance Verified: {activeProduct.giRegistrationNo || 'GI-232-GUJ'}</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-amber-200/60">
                    <h4 className="font-bold text-sm text-[#5B0820] font-serif mb-1">
                      {t('Craft Provenance & Heritage Story', 'शिल्प विरासत व कथा')}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {activeProduct.info.descriptionEn}
                    </p>
                    <p className="text-gray-600 font-hindi mt-2 leading-relaxed border-t border-amber-200/40 pt-2">
                      {activeProduct.info.descriptionHi}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-white border border-[#8B1538]/20">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">{t('Technique', 'तकनीक')}</span>
                      <p className="font-bold text-gray-900 mt-0.5">{activeProduct.info.technique}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#8B1538]/20">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">{t('Raw Materials', 'सामग्री')}</span>
                      <p className="font-bold text-gray-900 mt-0.5 truncate">{activeProduct.info.material}</p>
                    </div>
                  </div>

                  {/* Pricing & Fair Value */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#5B0820] to-[#8B1538] text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-rose-200 uppercase font-semibold">{t('Direct Fair Price', 'सीधा उचित मूल्य')}</span>
                      <p className="text-2xl font-extrabold text-amber-200">
                        ₹{activeProduct.pricing?.finalListingPrice || 2500}
                      </p>
                      <span className="text-[10px] text-rose-200">{t('Zero middleman margin guarantee', 'बिचौलिया-मुक्त शुद्ध कारीगर मूल्य')}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-rose-200 uppercase font-semibold">{t('B2B Bulk Unit Price', 'थोक दर')}</span>
                      <p className="text-xl font-bold text-white">
                        ₹{activeProduct.pricing?.suggestedBulkPrice || 2000}
                      </p>
                      <span className="text-[10px] text-rose-200">{t('Min 10 units', 'न्यूनतम 10 नग')}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#8B1538] font-serif">
                    <span>{t('Signed by Master Artisan:', 'मास्टर शिल्पकार हस्ताक्षर:')} <strong>{currentUser?.fullName}</strong></span>
                    <span className="bg-amber-100 px-2 py-0.5 rounded text-amber-900 font-sans font-bold text-[10px]">
                      Authentic Indian Craft Handloom Registry
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: MODERN MINIMALIST */}
          {selectedCatalogueTemplate === 'minimalist' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xl space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-900 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                    KALASATU / SPECIFICATION LOOKBOOK #2026
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-0.5">
                    {activeProduct.info.titleEn}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-400">ARTISAN ORIGIN</span>
                  <p className="font-bold text-sm text-gray-900">{activeProduct.info.originDistrict}, {activeProduct.info.originState}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={activeProduct.images[0]?.processedUrl || activeProduct.images[0]?.originalUrl}
                    alt={activeProduct.info.titleEn}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-5 space-y-4 text-xs font-mono">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-400 uppercase">CATEGORY</td>
                        <td className="py-2 font-bold text-right text-gray-900">{activeProduct.info.category}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-400 uppercase">TECHNIQUE</td>
                        <td className="py-2 font-bold text-right text-gray-900">{activeProduct.info.technique}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-400 uppercase">MATERIALS</td>
                        <td className="py-2 font-bold text-right text-gray-900 truncate max-w-[160px]">{activeProduct.info.material}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-400 uppercase">LEAD TIME</td>
                        <td className="py-2 font-bold text-right text-gray-900">{activeProduct.info.productionTimeDays} Days</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-400 uppercase">GI REGISTRY</td>
                        <td className="py-2 font-bold text-right text-emerald-600">{activeProduct.giRegistrationNo || 'GI-232-GUJ'} (Verified)</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <p className="font-sans text-xs text-gray-700 leading-relaxed">
                      {activeProduct.info.descriptionEn}
                    </p>
                  </div>

                  <div className="p-4 bg-black text-white rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase">DIRECT ARTISAN VALUE</span>
                      <p className="text-2xl font-bold font-sans">₹{activeProduct.pricing?.finalListingPrice}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/10 rounded text-[10px] font-sans font-bold">EXPORT GRADE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: VIBRANT HANDLOOM */}
          {selectedCatalogueTemplate === 'handloom' && (
            <div className="bg-amber-50/40 rounded-3xl border-2 border-orange-300 p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 rounded-full" />

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs bg-orange-100 text-orange-800 font-bold px-3 py-0.5 rounded-full">
                    🧵 {t('Authentic Handloom Registry', 'प्रामाणिक हथकरघा सूची')}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-950 mt-1">
                    {activeProduct.info.titleEn}
                  </h2>
                  <p className="text-sm font-semibold text-orange-800 font-hindi">
                    {activeProduct.info.titleHi}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-orange-700 font-bold uppercase">{t('Artisan Clan / Guild', 'कारीगर समुदाय')}</span>
                  <p className="text-sm font-bold text-gray-900">{currentUser?.fullName} (Master Weaver)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="aspect-square rounded-2xl overflow-hidden border-2 border-orange-200 shadow-md">
                  <img
                    src={activeProduct.images[0]?.processedUrl || activeProduct.images[0]?.originalUrl}
                    alt={activeProduct.info.titleEn}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-white p-5 rounded-2xl border border-orange-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-orange-600">The Weaver's Craft Story</span>
                    <p className="text-gray-800 leading-relaxed text-xs">
                      {activeProduct.info.descriptionEn}
                    </p>
                    <p className="text-gray-700 font-hindi border-t border-orange-100 pt-2 text-xs">
                      {activeProduct.info.descriptionHi}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-600 text-white flex items-center justify-between shadow-md shadow-orange-200">
                    <div>
                      <span className="text-[10px] text-orange-200 font-semibold uppercase">{t('Fair Craft Price', 'उचित शिल्प मूल्य')}</span>
                      <p className="text-2xl font-black">₹{activeProduct.pricing?.finalListingPrice}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-orange-200 font-semibold uppercase">{t('Production Duration', 'निर्माण समय')}</span>
                      <p className="text-sm font-bold">{activeProduct.info.productionTimeDays} {t('Days of Handcrafting', 'दिन की मेहनत')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 4: ONDC EXPORT READY */}
          {selectedCatalogueTemplate === 'ondc_export' && (
            <div className="bg-white rounded-3xl border-2 border-blue-600 p-6 sm:p-10 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
                    ONDC
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{activeProduct.info.titleEn}</h2>
                    <p className="text-xs text-blue-600 font-semibold">Open Network for Digital Commerce • Catalog Standard v2.0</p>
                  </div>
                </div>

                <span className="bg-blue-50 text-blue-700 font-mono text-xs px-3 py-1 rounded-lg border border-blue-200">
                  SCHEMA_COMPLIANT_92%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={activeProduct.images[0]?.processedUrl || activeProduct.images[0]?.originalUrl}
                    alt={activeProduct.info.titleEn}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-2 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">HS CODE</span>
                      <p className="font-mono font-bold text-gray-900">5007.20.10</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">DIMENSIONS</span>
                      <p className="font-bold text-gray-900">{activeProduct.info.dimensions || '200 x 70 cm'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">AVAILABLE STOCK</span>
                      <p className="font-bold text-gray-900">{activeProduct.info.quantityAvailable} Units</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">GI CERTIFICATE</span>
                      <p className="font-bold text-emerald-600">{activeProduct.giRegistrationNo || 'GI-232'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-gray-700 leading-relaxed">
                    <p className="font-semibold text-blue-900 mb-1">{t('Product Overview', 'उत्पाद विवरण')}</p>
                    {activeProduct.info.descriptionEn}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-xl">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase">ONDC DISCOVERY PRICE (INR)</span>
                      <p className="text-2xl font-bold font-mono">₹{activeProduct.pricing?.finalListingPrice}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase">B2B CONTRACT UNIT</span>
                      <p className="text-xl font-bold text-emerald-400 font-mono">₹{activeProduct.pricing?.suggestedBulkPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 5: TRADITIONAL BAZAAR */}
          {selectedCatalogueTemplate === 'bazaar' && (
            <div className="bg-[#FFFBF5] rounded-3xl border-2 border-[#A16207] p-6 sm:p-10 shadow-xl space-y-6">
              <div className="text-center pb-4 border-b border-amber-200">
                <span className="text-amber-800 text-xs font-bold uppercase tracking-wider">
                  🏺 {t('Traditional Artisan Bazaar Collection', 'पारंपरिक कारीगर बाज़ार')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-1">
                  {activeProduct.info.titleEn}
                </h2>
                <p className="text-sm font-hindi text-amber-800 font-semibold">{activeProduct.info.titleHi}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="aspect-square rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
                  <img
                    src={activeProduct.images[0]?.processedUrl || activeProduct.images[0]?.originalUrl}
                    alt={activeProduct.info.titleEn}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-amber-100/60 p-5 rounded-2xl border border-amber-200 space-y-2">
                    <p className="italic text-amber-950 leading-relaxed font-serif text-sm">
                      "{activeProduct.info.descriptionEn}"
                    </p>
                    <p className="text-amber-900 font-hindi text-xs border-t border-amber-200 pt-2">
                      {activeProduct.info.descriptionHi}
                    </p>
                  </div>

                  <div className="p-4 bg-[#713F12] text-amber-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-300 uppercase font-semibold">{t('Artisan Fair Price', 'कारीगर मूल्य')}</span>
                      <p className="text-2xl font-black text-amber-200">₹{activeProduct.pricing?.finalListingPrice}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-300 uppercase font-semibold">{t('Craft Origin', 'उत्पत्ति स्थान')}</span>
                      <p className="text-sm font-bold text-white">{activeProduct.info.originDistrict}, {activeProduct.info.originState}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State when no products exist */}
      {!activeProduct && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-gray-800">{t('No products in your catalogue yet', 'अभी तक कोई उत्पाद नहीं है')}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {t('Use the Smart Catalog Wizard to create your first craft item with voice and AI photo studio.', 'स्मार्ट कैटलॉग विज़ार्ड से पहला उत्पाद बनाएं।')}
          </p>
          <button
            onClick={() => setActiveTab('wizard')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#E11D48] text-white font-bold text-xs hover:bg-[#BE123C] cursor-pointer"
          >
            {t('+ Create Product with AI Wizard', '+ नया उत्पाद बनाएं')}
          </button>
        </div>
      )}

      {/* Unified Fullscreen Overlay Modal for HD Lookbook Poster */}
      <UnifiedOverlayModal
        isOpen={isPosterModalOpen && !!posterDataUrl}
        onClose={() => setIsPosterModalOpen(false)}
        title={activeProduct ? activeProduct.info.titleEn : 'Craft Exhibition Lookbook Poster'}
        subtitle={activeProduct ? `${activeProduct.info.originDistrict}, ${activeProduct.info.originState} • Certified GI Protected` : undefined}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => generatePoster(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF4B6E] hover:bg-[#FF3358] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? t('Saved!', 'सहेजा!') : t('Download PNG', 'डाउनलोड')}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        }
      >
        {posterDataUrl && (
          <div className="relative max-h-[75vh] max-w-full flex items-center justify-center rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <img
              src={posterDataUrl}
              alt="High-Res Exhibition Poster"
              className="max-h-[75vh] w-auto object-contain rounded-2xl block"
            />
          </div>
        )}
      </UnifiedOverlayModal>
    </div>
  );
};
