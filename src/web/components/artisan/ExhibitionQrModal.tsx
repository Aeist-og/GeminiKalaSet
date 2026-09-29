import React, { useState } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { 
  QrCode, 
  Download, 
  Share2, 
  Check, 
  Printer, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export const ExhibitionQrModal: React.FC = () => {
  const { currentUser, setActiveTab, t } = useWebApp();
  const [copied, setCopied] = useState(false);

  const showcaseUrl = `https://kalasetu.in/showcase/${currentUser?.id || 'ramesh-vankar'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(showcaseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#059669]">
              <QrCode className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-gray-900">
              {t('Exhibition QR & Physical Stall Showcase', 'प्रदर्शनी क्यूआर व स्टॉल प्रमाणपत्र')}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('Display this QR code at craft exhibitions (Surajkund, Dastkar, Hunar Haat). Visitors scan to browse your digital catalogue, watch craft reels, and order online.', 'हस्तशिल्प मेलों में अपने स्टॉल पर लगाने के लिए डिजिटल क्यूआर प्रमाणपत्र।')}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? t('Link Copied!', 'लिंक कॉपी हो गया') : t('Copy Showcase Link', 'लिंक कॉपी करें')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('Print Exhibition Card', 'कार्ड प्रिंट करें')}</span>
          </button>
        </div>
      </div>

      {/* Printable Exhibition Card Preview */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-[#BE123C] shadow-xl max-w-xl mx-auto text-center space-y-6 relative overflow-hidden">
        {/* Heritage Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#BE123C] via-[#F59E0B] to-[#BE123C]" />
        
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="text-lg font-extrabold text-[#111827]">Kala<span className="text-[#E11D48]">Setu</span></span>
          <span className="font-hindi text-xs font-semibold text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded">कलासेतु</span>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#BE123C] text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('Certified Master Heritage Artisan', 'प्रमाणित मास्टर धरोहर शिल्पकार')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {currentUser?.fullName}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Bhujodi, Kutch, Gujarat • Handloom & Kala Cotton Weaving
          </p>
        </div>

        {/* QR Code Container */}
        <div className="inline-block p-5 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
          {/* Visual QR Code Generator */}
          <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="white" />
            {/* Corner position markers */}
            <rect x="5" y="5" width="25" height="25" fill="#111827" rx="3" />
            <rect x="9" y="9" width="17" height="17" fill="white" rx="1" />
            <rect x="13" y="13" width="9" height="9" fill="#E11D48" rx="1" />

            <rect x="70" y="5" width="25" height="25" fill="#111827" rx="3" />
            <rect x="74" y="9" width="17" height="17" fill="white" rx="1" />
            <rect x="78" y="13" width="9" height="9" fill="#E11D48" rx="1" />

            <rect x="5" y="70" width="25" height="25" fill="#111827" rx="3" />
            <rect x="9" y="74" width="17" height="17" fill="white" rx="1" />
            <rect x="13" y="78" width="9" height="9" fill="#E11D48" rx="1" />

            {/* Simulated Data Matrix dots */}
            <rect x="35" y="10" width="6" height="6" fill="#111827" />
            <rect x="45" y="10" width="6" height="6" fill="#111827" />
            <rect x="55" y="10" width="6" height="6" fill="#111827" />

            <rect x="35" y="20" width="6" height="6" fill="#111827" />
            <rect x="50" y="20" width="6" height="6" fill="#111827" />
            <rect x="60" y="20" width="6" height="6" fill="#111827" />

            <rect x="10" y="35" width="6" height="6" fill="#111827" />
            <rect x="20" y="45" width="6" height="6" fill="#111827" />
            <rect x="35" y="35" width="10" height="10" fill="#BE123C" rx="2" />
            <rect x="50" y="35" width="6" height="6" fill="#111827" />
            <rect x="65" y="35" width="6" height="6" fill="#111827" />
            <rect x="80" y="35" width="6" height="6" fill="#111827" />

            <rect x="35" y="50" width="6" height="6" fill="#111827" />
            <rect x="45" y="50" width="10" height="10" fill="#E11D48" rx="2" />
            <rect x="65" y="50" width="6" height="6" fill="#111827" />
            <rect x="80" y="50" width="6" height="6" fill="#111827" />

            <rect x="10" y="60" width="6" height="6" fill="#111827" />
            <rect x="35" y="65" width="6" height="6" fill="#111827" />
            <rect x="45" y="65" width="6" height="6" fill="#111827" />
            <rect x="60" y="65" width="6" height="6" fill="#111827" />
            <rect x="75" y="65" width="6" height="6" fill="#111827" />

            <rect x="35" y="80" width="6" height="6" fill="#111827" />
            <rect x="45" y="80" width="6" height="6" fill="#111827" />
            <rect x="55" y="80" width="6" height="6" fill="#111827" />
            <rect x="70" y="80" width="6" height="6" fill="#111827" />
            <rect x="85" y="80" width="6" height="6" fill="#111827" />
          </svg>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-2">
            {t('Scan to Explore Story & Buy', 'स्कैन करें: कला कहानी देखें व खरीदें')}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-800">
            {t('Fair Artisan Wage • 100% Genuine Handloom • Direct Shipping', 'उचित पारिश्रमिक • 100% प्रामाणिक हथकरघा • सीधा प्रेषण')}
          </p>
          <p className="text-[10px] text-gray-400 font-mono">
            {showcaseUrl}
          </p>
        </div>
      </div>
    </div>
  );
};
