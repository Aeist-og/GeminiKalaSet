import React, { useState } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  FileCheck,
  Check
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  status: 'passed' | 'pending';
  category: 'Legal' | 'Catalog' | 'Logistics';
}

export const OndcReadinessView: React.FC = () => {
  const { t } = useWebApp();

  const [items, setItems] = useState<ComplianceItem[]>([
    {
      id: 'gi_tag',
      titleEn: 'Geographical Indication (GI) Provenance Tag',
      titleHi: 'भौगोलिक उपदर्शन (GI टैग) प्रमाणन',
      descriptionEn: 'Certified geographical origin for Bhujodi Kala Cotton & Kutch Weaving cluster.',
      descriptionHi: 'भुजोड़ी काला कॉटन व कच्छ बुनाई क्लस्टर का प्रमाणित मूल उद्गम।',
      status: 'passed',
      category: 'Legal',
    },
    {
      id: 'pricing_engine',
      titleEn: 'Transparent Cost-Plus Fair Pricing Breakdown',
      titleHi: 'पारदर्शी लागत-आधारित उचित मूल्य निर्धारण',
      descriptionEn: 'Itemized material, labour wage, packaging, and margin values structured in catalog schema.',
      descriptionHi: 'सामग्री, मजदूरी, पैकेजिंग और लाभ का विधिवत विभाजन।',
      status: 'passed',
      category: 'Catalog',
    },
    {
      id: 'studio_imagery',
      titleEn: 'White Studio Isolated Photography (1080x1080 min)',
      titleHi: 'सफेद स्टूडियो बैकग्राउंड फोटो (1080x1080)',
      descriptionEn: 'All products feature enhanced neutral studio isolation without cluttered workshop background.',
      descriptionHi: 'सभी उत्पादों की पृष्ठभूमि स्वच्छ स्टूडियो शैली में सुधारी गई है।',
      status: 'passed',
      category: 'Catalog',
    },
    {
      id: 'bilingual_schema',
      titleEn: 'Bilingual Metadata (Hindi & English Schema)',
      titleHi: 'द्विभाषी मेटाडेटा (हिंदी व अंग्रेज़ी)',
      descriptionEn: 'Titles and craft lore descriptions structured for vernacular Bharat search indexing.',
      descriptionHi: 'भारतीय भाषाओं में खोज के लिए हिंदी व अंग्रेज़ी में संपूर्ण शीर्षक और विवरण।',
      status: 'passed',
      category: 'Catalog',
    },
    {
      id: 'gstin_msme',
      titleEn: 'Artisan UDYAM / MSME Pehchan Card Verification',
      titleHi: 'कारीगर उद्यम / पहचान पत्र सत्यापन',
      descriptionEn: 'National Handicraft Artisan identity card verified on government portal.',
      descriptionHi: 'सरकारी पोर्टल पर राष्ट्रीय हस्तशिल्प पहचान पत्र प्रमाणित।',
      status: 'passed',
      category: 'Legal',
    },
    {
      id: 'dimensions_weights',
      titleEn: 'Accurate Volumetric Dimensions & Weights',
      titleHi: 'सटीक माप और वजन (लॉजिस्टिक्स हेतु)',
      descriptionEn: 'Mandatory for automated 3PL logistics dispatch and shipping fee calculation.',
      descriptionHi: 'स्वचालित डाक/कोरियर प्रेषण शुल्क गणना के लिए अनिवार्य।',
      status: 'passed',
      category: 'Logistics',
    },
    {
      id: 'return_policy',
      titleEn: 'Standard 7-Day Craft Exchange & Transit Insurance',
      titleHi: '7-दिवसीय शिल्प विनिमय व पारगमन बीमा नीति',
      descriptionEn: 'Standard consumer protection terms agreed for damage during transit.',
      descriptionHi: 'पारगमन में क्षति होने पर मानक ग्राहक सुरक्षा नीति।',
      status: 'passed',
      category: 'Legal',
    },
    {
      id: 'barcode_ean',
      titleEn: 'ONDC-Compliant GTIN / Digital Barcode Allocation',
      titleHi: 'ONDC-अनुरूप डिजिटल बारकोड आवंटन',
      descriptionEn: 'Unique inventory SKU identifier for multi-seller network discovery.',
      descriptionHi: 'मल्टी-सेलर नेटवर्क पर खोज के लिए विशिष्ट उत्पाद SKU पहचानकर्ता।',
      status: 'pending',
      category: 'Logistics',
    },
  ]);

  const passedCount = items.filter(i => i.status === 'passed').length;
  const percentage = Math.round((passedCount / items.length) * 100);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'passed' ? 'pending' : 'passed',
        };
      }
      return item;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-[#2563EB]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-gray-900">
              {t('ONDC Network Readiness Scorecard', 'ONDC नेटवर्क तत्परता स्कोरकार्ड')}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('Automated compliance verification allowing instant export to the Open Network for Digital Commerce (ONDC) buyer apps.', 'ओपन नेटवर्क फॉर डिजिटल कॉमर्स पर सीधे सूचीबद्ध होने के लिए 8-बिंदु अनुपालन स्कोरकार्ड।')}
          </p>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-indigo-50 px-4 py-2.5 rounded-2xl border border-emerald-100">
          <div className="text-right">
            <span className="text-[10px] text-gray-500 uppercase font-bold block">{t('Network Score', 'नेटवर्क स्कोर')}</span>
            <span className="text-xl font-extrabold text-emerald-600">{percentage}%</span>
          </div>
          <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded-md shadow-xs">
            {passedCount} / {items.length} {t('Passed', 'सत्यापित')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-gray-700">{t('National Open Commerce Protocol Compliance', 'राष्ट्रीय ओपन कॉमर्स प्रोटोकॉल अनुपालन')}</span>
          <span className="text-emerald-600">{percentage}% {t('Ready', 'पूर्ण')}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E11D48] via-[#2563EB] to-[#059669] transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-gray-300 shadow-xs flex items-start justify-between gap-4 cursor-pointer transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  item.status === 'passed'
                    ? 'bg-emerald-500 text-white'
                    : 'border-2 border-gray-300 text-transparent'
                }`}
              >
                <Check className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-900">
                    {t(item.titleEn, item.titleHi)}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-gray-100 text-gray-600 uppercase">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {t(item.descriptionEn, item.descriptionHi)}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
                item.status === 'passed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {item.status === 'passed' ? t('Compliant', 'सत्यापित') : t('Action Needed', 'शेष')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
