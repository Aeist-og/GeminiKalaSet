import React, { useState, useRef, useEffect } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { PricingEngine } from '../../../services/pricing/pricingEngine';
import { Product } from '../../../models/product';
import { imageService, StudioPreset } from '../../../services/image/imageService';
import { speechService, SUPPORTED_INDIAN_LANGUAGES } from '../../../services/speech/speechService';
import { catalogAiService } from '../../../services/catalog-ai/catalogAiService';
import { CATALOGUE_TEMPLATES } from './ArtisanTemplatesView';
import { 
  Sparkles, 
  Camera, 
  Upload,
  Mic, 
  MicOff, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Eye, 
  CheckCircle2, 
  Image as ImageIcon,
  DollarSign,
  Palette,
  RefreshCw,
  Info,
  Maximize2,
  Volume2,
  Printer,
  Share2,
  Wifi,
  WifiOff,
  Plus,
  Wand2,
  X
} from 'lucide-react';

export const SmartCatalogWizard: React.FC = () => {
  const { currentUser, addProduct, setActiveTab, t } = useWebApp();

  const [step, setStep] = useState(1);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showEnhanced, setShowEnhanced] = useState(true);
  const [activeStudioPreset, setActiveStudioPreset] = useState<StudioPreset>('studio_white');
  const [customBackdropColor, setCustomBackdropColor] = useState<string>('#FAF5EF');
  const [customBackdropImage, setCustomBackdropImage] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [liveTranscriptInterim, setLiveTranscriptInterim] = useState('');
  const [activeRecognizer, setActiveRecognizer] = useState<{ stop: () => void } | null>(null);
  const [isAiExtracting, setIsAiExtracting] = useState(false);

  // Offline Caching & Sync Queue for Spotty Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [queuedSyncCount, setQueuedSyncCount] = useState<number>(() => {
    try {
      const q = localStorage.getItem('kalasetu_offline_queue');
      return q ? JSON.parse(q).length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync queued items when connection restores
      try {
        const q = localStorage.getItem('kalasetu_offline_queue');
        if (q) {
          const items: Product[] = JSON.parse(q);
          if (items.length > 0) {
            items.forEach(item => addProduct(item));
            localStorage.removeItem('kalasetu_offline_queue');
            setQueuedSyncCount(0);
          }
        }
      } catch {}
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addProduct]);

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backdropFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [imageUri, setImageUri] = useState<string>('');
  const [enhancedImageUri, setEnhancedImageUri] = useState<string>('');
  const [voiceText, setVoiceText] = useState<string>('');

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [craftType, setCraftType] = useState('Handloom Weaving');
  const [category, setCategory] = useState('Apparel & Textiles');
  const [material, setMaterial] = useState('Pure Organic Silk, Natural Botanical Dyes');
  const [technique, setTechnique] = useState('Traditional handloom weaving');
  const [originState, setOriginState] = useState('Gujarat');
  const [originDistrict, setOriginDistrict] = useState('Patan');
  const [productionTimeDays, setProductionTimeDays] = useState(7);
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [giTagVerified, setGiTagVerified] = useState(true);
  const [giRegistrationNo, setGiRegistrationNo] = useState('GI-232-GUJ');
  const [giClusterName, setGiClusterName] = useState('Salvi Wada Craft Cluster, Patan');

  // Missing Info & ONDC Compliance
  const [dimensions, setDimensions] = useState('200 cm x 70 cm');
  const [quantityAvailable, setQuantityAvailable] = useState(5);
  const [customizationAvailable, setCustomizationAvailable] = useState(true);
  const [careInstructions, setCareInstructions] = useState('Dry clean only. Preserve in unbleached muslin cloth with natural neem leaves.');

  // Pricing
  const [materialCost, setMaterialCost] = useState(3800);
  const [labourCostPerDay, setLabourCostPerDay] = useState(450);
  const [labourDays, setLabourDays] = useState(7);
  const [packagingCost, setPackagingCost] = useState(250);
  const [additionalCost, setAdditionalCost] = useState(150);
  const [marginPercent, setMarginPercent] = useState(25);

  // Template
  const [selectedTemplate, setSelectedTemplate] = useState<string>('heritage');

  // Compute pricing
  const pricingResult = PricingEngine.calculate({
    materialCost,
    labourCostPerDay,
    labourDays,
    packagingCost,
    additionalCost,
    marginPercent,
  });

  // Handle direct file upload from camera or gallery
  useEffect(() => {
    const passedImage = sessionStorage.getItem('kalasetu_wizard_image');
    const passedTitle = sessionStorage.getItem('kalasetu_wizard_title');
    if (passedImage) {
      setImageUri(passedImage);
      setEnhancedImageUri(passedImage);
      setShowEnhanced(true);
      sessionStorage.removeItem('kalasetu_wizard_image');
    }
    if (passedTitle) {
      setTitleEn(passedTitle);
      sessionStorage.removeItem('kalasetu_wizard_title');
    }
  }, []);

  // 5 Feature Enhancement Suite State
  const [featureRemoveBg, setFeatureRemoveBg] = useState(true);
  const [featureCorrectLighting, setFeatureCorrectLighting] = useState(true);
  const [featureAutoCrop, setFeatureAutoCrop] = useState(true);
  const [featureAngleCorrection, setFeatureAngleCorrection] = useState(true);
  const [featurePureCutout, setFeaturePureCutout] = useState(false);

  // Background Removal & AI Processed Badge State
  const [activeProvider, setActiveProvider] = useState<string>('KalaSetu AI Studio');
  const [isAiProcessed, setIsAiProcessed] = useState<boolean>(true);

  // Render enhanced image based on selected features and backdrops
  const applyEnhancementFeatures = async (
    baseUri: string,
    remBg: boolean,
    lighting: boolean,
    crop: boolean,
    angle: boolean,
    pureCutout: boolean,
    preset: StudioPreset = activeStudioPreset,
    customColor: string = customBackdropColor,
    customImage: string = customBackdropImage
  ) => {
    if (!baseUri) return;
    setIsEnhancing(true);

    try {
      const result = await imageService.enhanceImage(baseUri, {
        preset: pureCutout ? 'transparent_png' : preset,
        customBackdropColor: customColor,
        customBackdropImage: customImage,
        removeBackground: remBg || pureCutout,
        transparentBackground: pureCutout,
        brightness: lighting ? 12 : 0,
        contrast: lighting ? 15 : 0,
        saturation: lighting ? 18 : 0,
        autoCrop: crop,
        angleCorrection: angle ? 2 : 0,
        dropShadow: !pureCutout,
      });

      if (result.enhancedUri) {
        setEnhancedImageUri(result.enhancedUri);
        setActiveProvider(result.provider || 'KalaSetu AI Studio');
        setIsAiProcessed(true);
      } else {
        setEnhancedImageUri(baseUri);
      }
    } catch (err) {
      console.warn('Enhancement error:', err);
      setEnhancedImageUri(baseUri);
    } finally {
      setIsEnhancing(false);
      setShowEnhanced(true);
    }
  };

  useEffect(() => {
    if (imageUri) {
      applyEnhancementFeatures(
        imageUri,
        featureRemoveBg,
        featureCorrectLighting,
        featureAutoCrop,
        featureAngleCorrection,
        featurePureCutout,
        activeStudioPreset,
        customBackdropColor,
        customBackdropImage
      );
    }
  }, [imageUri, featureRemoveBg, featureCorrectLighting, featureAutoCrop, featureAngleCorrection, featurePureCutout, activeStudioPreset, customBackdropColor, customBackdropImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUri = event.target?.result as string;
      if (resultUri) {
        setImageUri(resultUri);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomBackdropUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUri = event.target?.result as string;
      if (resultUri) {
        setCustomBackdropImage(resultUri);
        setActiveStudioPreset('custom_image');
      }
    };
    reader.readAsDataURL(file);
  };


  // Live microphone transcription with real-time text streaming
  const toggleListening = async () => {
    if (isListening) {
      if (activeRecognizer) {
        try {
          await activeRecognizer.stop();
        } catch {}
        setActiveRecognizer(null);
      }
      setIsListening(false);
      if (liveTranscriptInterim.trim()) {
        setVoiceText(prev => {
          if (!prev.includes(liveTranscriptInterim.trim())) {
            return prev ? `${prev} ${liveTranscriptInterim.trim()}` : liveTranscriptInterim.trim();
          }
          return prev;
        });
      }
      setLiveTranscriptInterim('');
    } else {
      setIsListening(true);
      setLiveTranscriptInterim('');
      try {
        const recognizer = await speechService.startLiveTranscription(
          selectedLanguage,
          (text, _isFinal) => {
            if (text.trim()) {
              setVoiceText(text.trim());
              setLiveTranscriptInterim(text.trim());
            }
          },
          (error) => {
            console.warn('[Speech] Notice:', error);
            if (error.includes('denied') || error.includes('permission')) {
              setIsListening(false);
            }
          }
        );
        setActiveRecognizer(recognizer);
      } catch (err) {
        console.warn('Speech start error:', err);
        setIsListening(false);
      }
    }
  };

  // Trigger Multimodal AI Extraction when leaving step 3
  const handleRunAiExtraction = async () => {
    if (!voiceText.trim()) return;
    setIsAiExtracting(true);
    const res = await catalogAiService.extractCatalogInfo(voiceText, selectedLanguage);
    setIsAiExtracting(false);

    if (res.success && res.info) {
      if (res.info.titleEn) setTitleEn(res.info.titleEn);
      if (res.info.titleHi) setTitleHi(res.info.titleHi);
      if (res.info.craftType) setCraftType(res.info.craftType);
      if (res.info.category) setCategory(res.info.category);
      if (res.info.material) setMaterial(res.info.material);
      if (res.info.technique) setTechnique(res.info.technique);
      if (res.info.originState) setOriginState(res.info.originState);
      if (res.info.originDistrict) setOriginDistrict(res.info.originDistrict);
      if (res.info.productionTimeDays) {
        setProductionTimeDays(res.info.productionTimeDays);
        setLabourDays(res.info.productionTimeDays);
      }
      if (res.info.descriptionEn) setDescriptionEn(res.info.descriptionEn);
      if (res.info.descriptionHi) setDescriptionHi(res.info.descriptionHi);
      if (res.giTagEligible !== undefined) setGiTagVerified(res.giTagEligible);
      if (res.giRegistrationNo) setGiRegistrationNo(res.giRegistrationNo);
      if (res.giClusterName) setGiClusterName(res.giClusterName);
      if (res.suggestedRawMaterialCost) setMaterialCost(res.suggestedRawMaterialCost);
    }
  };

  const handlePublish = () => {
    const finalEnhanced = showEnhanced && enhancedImageUri ? enhancedImageUri : imageUri;
    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      artisanId: currentUser?.id || 'artisan-hetvi',
      status: 'published',
      catalogueTemplate: selectedTemplate,
      giTagVerified,
      giRegistrationNo,
      info: {
        titleEn: titleEn || 'Handcrafted Indian Artisan Item',
        titleHi: titleHi || 'पारंपरिक हस्तनिर्मित शिल्प',
        craftType,
        category,
        material,
        technique,
        originState,
        originDistrict,
        productionTimeDays,
        descriptionEn: descriptionEn || voiceText,
        descriptionHi: descriptionHi || voiceText,
        dimensions,
        quantityAvailable,
        customizationAvailable,
        careInstructions,
      },
      images: [
        {
          id: 'img-' + Date.now(),
          productId: 'prod-' + Date.now(),
          originalUrl: imageUri || finalEnhanced,
          processedUrl: finalEnhanced,
          isPrimary: true,
          createdAt: new Date().toISOString(),
        }
      ],
      pricing: pricingResult,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!navigator.onLine) {
      // Queue offline
      try {
        const q = localStorage.getItem('kalasetu_offline_queue');
        const list: Product[] = q ? JSON.parse(q) : [];
        list.push(newProduct);
        localStorage.setItem('kalasetu_offline_queue', JSON.stringify(list));
        setQueuedSyncCount(list.length);
      } catch {}
    }

    addProduct(newProduct);
    setActiveTab('catalogue');
  };

  const stepTitles = [
    t('Upload Craft Photo', 'शिल्प फोटो अपलोड करें'),
    t('AI Image Studio', 'एआई फोटो स्टूडियो'),
    t('Voice / Audio Story', 'आवाज़ से विवरण बताएं'),
    t('AI Attributes & GI Tag', 'स्मार्ट विशेषताएं व जीआई'),
    t('ONDC Compliance', 'ONDC मानक विवरण'),
    t('Cost-Plus Pricing', 'उचित लागत मूल्य निर्धारण'),
    t('Choose Template', 'कैटलॉग टेम्पलेट चुनें'),
    t('Review & Publish', 'समीक्षा व प्रकाशन'),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Offline Sync Banner */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3.5 mb-4 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">{t('Offline Caching Active', 'ऑफलाइन मोड सक्रिय')}</p>
              <p className="text-[11px] text-amber-800">
                {t('Craft listings and photo enhancements will be saved to your device database and synced once reconnected.', 'आपके विवरण डिवाइस पर सहेजे जाएंगे और इंटरनेट आने पर स्वतः सिंक होंगे।')}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full shrink-0">
            {t('Local Queue', 'लोकल कतार')}
          </span>
        </div>
      )}
      {/* Wizard Header & Progress Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-rose-50 text-[#E11D48]">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t('Multimodal AI Cataloging Assistant', 'मल्टीमॉडल एआई कैटलॉगिंग सहायक')}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('SIH 2026 Problem Statement SIH26090 — Empowering Traditional Artisans', 'पारंपरिक भारतीय कारीगरों के लिए स्मार्ट कैटलॉगिंग')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl">
              {t('Step', 'चरण')} {step} / 8: <span className="text-[#E11D48]">{stepTitles[step - 1]}</span>
            </span>
            <button
              onClick={() => setActiveTab('home')}
              className="text-xs text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-xl border border-gray-200 cursor-pointer"
            >
              {t('Cancel', 'रद्द करें')}
            </button>
          </div>
        </div>

        {/* 8-Segment Progress Track */}
        <div className="grid grid-cols-8 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <div key={s} className="flex flex-col gap-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  s < step
                    ? 'bg-[#E11D48]'
                    : s === step
                    ? 'bg-[#E11D48] ring-2 ring-rose-200'
                    : 'bg-gray-100'
                }`}
              />
              <span className="text-[9px] text-gray-400 font-medium text-center truncate">
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 min-h-[460px]">
        {/* STEP 1: Direct Photo Upload (NO URL REQUIRED) */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#E11D48] bg-rose-50 px-2.5 py-0.5 rounded-full">
                Step 1: Direct Image Capture
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                {t('Upload or Capture Your Handcrafted Product Photo', 'अपने हस्तशिल्प की फोटो अपलोड या कैप्चर करें')}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  'No URLs needed! Take a direct photo with your smartphone camera or select an image from your device gallery.',
                  'सीधे अपने फोन कैमरे से फोटो खींचें या गैलरी से चुनें। किसी यूआरएल की आवश्यकता नहीं है।'
                )}
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Photo Capture & Upload Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-square rounded-3xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  imageUri
                    ? 'border-[#E11D48] bg-rose-50/20'
                    : 'border-gray-300 hover:border-[#E11D48] bg-gray-50/70 hover:bg-rose-50/20'
                }`}
              >
                {imageUri ? (
                  <>
                    <img src={imageUri} alt="Craft photo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                      <span>{t('Tap to Change Photo', 'फोटो बदलने के लिए टैप करें')}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-rose-100 text-[#E11D48] flex items-center justify-center mx-auto shadow-xs">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">
                        {t('Tap to Take Photo or Browse', 'फोटो खींचने या चुनने के लिए टैप करें')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('Supports smartphone camera, PNG, JPG, WebP', 'स्मार्टफोन कैमरा, पीएनजी, जेपीजी समर्थित')}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-[#E11D48] text-white text-xs font-bold shadow-md shadow-rose-200"
                    >
                      {t('Select from Device', 'डिवाइस से चुनें')}
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Preset Picker if on desktop without camera */}
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    {t('Or Test with Authentic Artisan Craft Samples:', 'या प्रामाणिक शिल्प नमूनों से तुरंत परीक्षण करें:')}
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        name: 'Patan Patola Silk Saree',
                        craft: 'Double Ikat Weaving',
                        state: 'Gujarat',
                        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
                        desc: 'Authentic 900-year-old double ikat mulberry silk with natural dyes',
                      },
                      {
                        name: 'Kutch Kala Cotton Shawl',
                        craft: 'Handloom Pit Loom Weaving',
                        state: 'Gujarat',
                        url: 'https://images.unsplash.com/photo-1606744888344-493238955de0?w=800&q=80',
                        desc: 'Organic indigenous rain-fed cotton handspun and extra-weft woven',
                      },
                      {
                        name: 'Jaipur Blue Pottery Urn',
                        craft: 'Egyptian Faience Ceramic',
                        state: 'Rajasthan',
                        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',
                        desc: 'Hand-painted floral glazed pottery with cobalt and quartz paste',
                      },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={async () => {
                          setImageUri(preset.url);
                          setIsEnhancing(true);
                          const enhanced = await imageService.enhanceImage(preset.url, activeStudioPreset);
                          setEnhancedImageUri(enhanced.enhancedUri || preset.url);
                          setIsEnhancing(false);
                          setShowEnhanced(true);
                          setTitleEn(preset.name);
                          setCraftType(preset.craft);
                          setOriginState(preset.state);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                          imageUri === preset.url
                            ? 'border-[#E11D48] bg-rose-50 text-[#BE123C] font-semibold'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-gray-900">{preset.name}</p>
                            <p className="text-[10px] text-gray-500">{preset.craft} • {preset.state}</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 font-semibold">
                          {t('Use', 'चुनें')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: 4 Image Enhancement & Lighting Features */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#FF4B6E] bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Step 2: AI Craft Photo Studio
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  {t('Enhance Craft Photo & Studio Lighting', 'शिल्प फोटो परिष्करण व स्टूडियो बैकग्राउंड')}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {t(
                    'Transform raw artisan workshop photos into studio-grade e-commerce imagery with instant lighting and backdrops.',
                    'शिल्प फोटो को पेशेवर ई-कॉमर्स स्टूडियो लुक और बैकग्राउंड प्रदान करें।'
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-[#E11D48] border border-rose-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>{t('AI Studio Engine Active', 'एआई स्टूडियो सक्रिय')}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Studio Canvas Preview with AI Processed Badge */}
              <div className="space-y-3">
                <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-200 shadow-lg bg-gray-950 flex items-center justify-center">
                  <img
                    src={showEnhanced && enhancedImageUri ? enhancedImageUri : imageUri}
                    alt="Craft preview"
                    className={`w-full h-full object-cover transition-all ${isEnhancing ? 'opacity-50 blur-xs' : 'opacity-100'}`}
                  />

                  {/* PROMINENT AI PROCESSED BADGE */}
                  {showEnhanced && enhancedImageUri && !isEnhancing && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-600/95 text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-xl backdrop-blur-md border border-emerald-300/50 animate-in fade-in zoom-in-95 duration-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>{t('AI Processed', 'एआई प्रोसेस्ड')}</span>
                    </div>
                  )}

                  {isEnhancing && (
                    <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                      <RefreshCw className="w-8 h-8 text-[#FF4B6E] animate-spin mb-2" />
                      <p className="text-xs font-bold text-[#FF4B6E]">{t('AI Studio Isolating Background & Lighting...', 'एआई बैकग्राउंड व लाइटिंग सेट कर रहा है...')}</p>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/80 text-white px-3 py-1.5 rounded-xl text-[10px] font-semibold backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{showEnhanced ? t('Enhanced Preview', 'परिष्कृत फोटो') : t('Original Photo', 'मूल फोटो')}</span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-gray-300 px-2.5 py-1 rounded-lg text-[9px] font-medium backdrop-blur-md">
                    <span>{activeProvider}</span>
                  </div>
                </div>

                {/* Compare & Re-Enhance Controls */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEnhanced(!showEnhanced)}
                    className="flex-1 py-2 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
                  >
                    {showEnhanced ? t('Compare with Raw', 'मूल फोटो देखें') : t('Show Enhanced', 'परिष्कृत देखें')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      applyEnhancementFeatures(
                        imageUri,
                        featureRemoveBg,
                        featureCorrectLighting,
                        featureAutoCrop,
                        featureAngleCorrection,
                        activeStudioPreset,
                        customBackdropColor,
                        customBackdropImage
                      );
                    }}
                    className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('Re-Process', 'पुनः प्रोसेस')}</span>
                  </button>
                </div>
              </div>

              {/* Studio Backdrops with Color Wheel & Plus Offline Custom Backdrop */}
              <div className="space-y-3">
                {/* Studio Backdrop Presets + Color Wheel + Offline Storage Upload */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-[#E11D48]" />
                      <span>{t('Studio Backdrop & Background Selection:', 'स्टूडियो बैकग्राउंड परिवेश:')}</span>
                    </label>
                  </div>

                  {/* Hidden Backdrop File Input for Offline Storage / Device Photos */}
                  <input
                    type="file"
                    ref={backdropFileInputRef}
                    onChange={handleCustomBackdropUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Backdrop Selector Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                    {[
                      { id: 'studio_white', name: 'White', color: '#FFFFFF' },
                      { id: 'heritage_velvet', name: 'Velvet', color: '#580824' },
                      { id: 'warm_ambient', name: 'Warm', color: '#FEF3C7' },
                      { id: 'palace_arch', name: 'Marble', color: '#E6D5C3' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setActiveStudioPreset(preset.id as StudioPreset);
                        }}
                        className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          activeStudioPreset === preset.id
                            ? 'border-[#E11D48] bg-rose-50/70 text-[#BE123C] ring-1 ring-[#E11D48]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs" style={{ backgroundColor: preset.color }} />
                        <span className="truncate w-full">{preset.name}</span>
                      </button>
                    ))}

                    {/* COLOR WHEEL BUTTON / PICKER */}
                    <label
                      className={`relative p-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        activeStudioPreset === 'custom_color'
                          ? 'border-[#E11D48] bg-rose-50/70 text-[#BE123C] ring-1 ring-[#E11D48]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="color"
                        value={customBackdropColor}
                        onChange={(e) => {
                          setCustomBackdropColor(e.target.value);
                          setActiveStudioPreset('custom_color');
                        }}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        title="Pick custom studio backdrop color"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs relative overflow-hidden" 
                        style={{ backgroundColor: customBackdropColor }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-500 opacity-30" />
                      </div>
                      <span className="truncate w-full">{t('Color', 'रंग')}</span>
                    </label>

                    {/* PLUS (+) SIGN: UPLOAD FROM OFFLINE / DEVICE STORAGE */}
                    <button
                      type="button"
                      onClick={() => backdropFileInputRef.current?.click()}
                      className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        activeStudioPreset === 'custom_image'
                          ? 'border-[#E11D48] bg-rose-50/70 text-[#BE123C] ring-1 ring-[#E11D48]'
                          : 'border-dashed border-rose-300 bg-rose-50/40 text-[#E11D48] hover:bg-rose-50'
                      }`}
                      title="Upload custom background image from storage"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#E11D48] text-white flex items-center justify-center font-bold shadow-2xs">
                        <Plus className="w-3 h-3" />
                      </div>
                      <span className="truncate w-full">{t('+ Image', '+ फोटो')}</span>
                    </button>
                  </div>

                  {/* Active Custom Image Indicator */}
                  {customBackdropImage && activeStudioPreset === 'custom_image' && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-rose-200 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={customBackdropImage} alt="Custom Backdrop" className="w-7 h-7 rounded-lg object-cover border border-slate-200" />
                        <span className="text-[11px] font-bold text-slate-700">{t('Custom Backdrop Active', 'कस्टम बैकग्राउंड फोटो सक्रिय')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomBackdropImage('');
                          setActiveStudioPreset('studio_white');
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                        title="Remove custom backdrop"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider pt-1">
                  {t('Enhancement Modules (Multi-Select):', 'सुधार मॉड्यूल चुनें:')}
                </label>

                {/* Feature 1: Studio Background Isolation */}
                <button
                  type="button"
                  onClick={() => setFeatureRemoveBg(!featureRemoveBg)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    featureRemoveBg
                      ? 'border-[#FF4B6E] bg-rose-50/70 text-slate-900 ring-1 ring-[#FF4B6E]'
                      : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold">{t('1. Studio Background Isolation', '1. स्टूडियो बैकग्राउंड आइसोलेशन')}</p>
                      <span className="text-[9px] bg-rose-100 text-[#E11D48] px-1.5 py-0.2 rounded font-bold">AI Studio</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                      {t('Isolate handcrafted products cleanly on selected backdrops with realistic contact shadow.', 'कार्यशाला की पृष्ठभूमि हटाकर स्वच्छ स्टूडियो बैकग्राउंड व संपर्क छाया लगाएं।')}
                    </p>
                  </div>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-2 ${
                    featureRemoveBg ? 'bg-[#FF4B6E] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {featureRemoveBg ? '✓' : '+'}
                  </span>
                </button>

                {/* Feature 2: Correct Lighting */}
                <button
                  type="button"
                  onClick={() => setFeatureCorrectLighting(!featureCorrectLighting)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    featureCorrectLighting
                      ? 'border-[#FF4B6E] bg-rose-50/70 text-slate-900 ring-1 ring-[#FF4B6E]'
                      : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">{t('2. Correct Lighting & Tone', '2. लाइटिंग व टोन सही करें')}</p>
                    <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                      {t('Automated softbox illumination, contrast balancing, and product relighting without harsh glare.', 'कम रोशनी वाली फोटो में चमक और कंट्रास्ट को संतुलित करें।')}
                    </p>
                  </div>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-2 ${
                    featureCorrectLighting ? 'bg-[#FF4B6E] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {featureCorrectLighting ? '✓' : '+'}
                  </span>
                </button>

                {/* Feature 3: Auto-Cropping & Centering */}
                <button
                  type="button"
                  onClick={() => setFeatureAutoCrop(!featureAutoCrop)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    featureAutoCrop
                      ? 'border-[#FF4B6E] bg-rose-50/70 text-slate-900 ring-1 ring-[#FF4B6E]'
                      : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold">{t('3. Auto-Cropping & Centering', '3. ऑटो-क्रॉपिंग व सेंटरिंग')}</p>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">AI</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                      {t('Computer vision auto-centering and boundary cropping for modern catalog standards.', 'उत्पाद को फ्रेम के बीच में व्यवस्थित करें।')}
                    </p>
                  </div>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-2 ${
                    featureAutoCrop ? 'bg-[#FF4B6E] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {featureAutoCrop ? '✓' : '+'}
                  </span>
                </button>

                {/* Feature 4: Angle Correction & Tilt Straighten */}
                <button
                  type="button"
                  onClick={() => setFeatureAngleCorrection(!featureAngleCorrection)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    featureAngleCorrection
                      ? 'border-[#FF4B6E] bg-rose-50/70 text-slate-900 ring-1 ring-[#FF4B6E]'
                      : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold">{t('4. Angle Correction & Tilt Straighten', '4. कोण व झुकाव सुधार')}</p>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">AI</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                      {t('Camera tilt alignment and horizontal angle leveling for symmetrical catalog presentation.', 'तिरछी या झुकी हुई फोटो को सीधा करें।')}
                    </p>
                  </div>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-2 ${
                    featureAngleCorrection ? 'bg-[#FF4B6E] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {featureAngleCorrection ? '✓' : '+'}
                  </span>
                </button>

                {/* Feature 5: Remove Background (Pure Transparent PNG Cutout) */}
                <button
                  type="button"
                  onClick={() => setFeaturePureCutout(!featurePureCutout)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    featurePureCutout
                      ? 'border-[#FF4B6E] bg-rose-50/70 text-slate-900 ring-1 ring-[#FF4B6E]'
                      : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold">{t('5. Remove Background (Pure Cutout)', '5. बैकग्राउंड हटाएं (पारदर्शी कटआउट)')}</p>
                      <span className="text-[9px] bg-rose-100 text-[#E11D48] px-1.5 py-0.2 rounded font-bold">Remove.bg</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                      {t('Extract pure transparent PNG subject cutout without any background backdrop.', 'बिना किसी पृष्ठभूमि के पारदर्शी पीएनजी कटआउट निकालें।')}
                    </p>
                  </div>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-2 ${
                    featurePureCutout ? 'bg-[#FF4B6E] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {featurePureCutout ? '✓' : '+'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Voice / Audio Recording */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#FF4B6E] bg-rose-50 px-2.5 py-0.5 rounded-full">
                Step 3: Native Voice Story
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                {t('Describe Your Craft in Your Native Language', 'अपनी मातृभाषा में अपने शिल्प का वर्णन करें')}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  'Tap the microphone and speak freely. Your spoken words will be converted into structured catalog details.',
                  'माइक दबाएं और अपनी भाषा में बोलें। आपके शब्दों से पूरा विवरण स्वतः तैयार हो जाएगा।'
                )}
              </p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-gray-700 whitespace-nowrap">
                {t('Speaking Language:', 'बोलने की भाषा:')}
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white font-semibold text-gray-800 focus:outline-none focus:border-[#E11D48]"
              >
                {SUPPORTED_INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Microphone Button with Animated Soundwave */}
            <div className="p-8 rounded-3xl bg-amber-50/50 border border-amber-200 text-center space-y-4">
              <div className="relative inline-block">
                {isListening && (
                  <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40 scale-125" />
                )}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center text-white transition-all shadow-xl cursor-pointer ${
                    isListening ? 'bg-red-600 scale-110' : 'bg-[#E11D48] hover:bg-[#BE123C]'
                  }`}
                >
                  {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
                  <span className="text-[10px] font-bold mt-1">
                    {isListening ? t('Stop', 'रोकें') : t('Tap & Speak', 'बोलें')}
                  </span>
                </button>
              </div>

              {/* Live Soundwave Bars */}
              {isListening && (
                <div className="flex items-center justify-center gap-1.5 h-6">
                  {[20, 36, 16, 42, 28, 50, 24, 38, 18, 44].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-1.5 bg-[#E11D48] rounded-full animate-pulse"
                    />
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-600">
                {isListening
                  ? t('Listening live... speak naturally about materials, days taken, or craft style.', 'सुन रहे हैं... कृपया शिल्प के बारे में बोलें।')
                  : t('Tap button to record voice or click a quick sample phrase below.', 'बोलने के लिए बटन दबाएं या नीचे दिए गए नमूने चुनें।')}
              </p>

              {/* Interim Live Transcript */}
              {liveTranscriptInterim && (
                <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-gray-700 italic">
                  "{liveTranscriptInterim}..."
                </div>
              )}
            </div>

            {/* Transcript Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  {t('Spoken Story Transcript (Editable)', 'आवाज़ ट्रांसक्रिप्ट या लिखित विवरण')}
                </label>
                {voiceText && (
                  <button
                    onClick={handleRunAiExtraction}
                    disabled={isAiExtracting}
                    className="text-[11px] font-bold text-[#E11D48] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiExtracting ? t('Extracting...', 'निकाला जा रहा है...') : t('Auto-Extract with AI', 'एआई से विवरण निकालें')}</span>
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="Describe your handcrafted item, raw materials, loom technique, days taken to weave or carve..."
                className="w-full p-4 text-xs rounded-2xl border border-gray-200 focus:outline-none focus:border-[#E11D48] leading-relaxed"
              />
            </div>

            {/* Quick Sample Voice Presets in all 11 Indian Languages */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {t('11 Languages Native Voice Samples (1-Click to Test & Auto-Fill):', '11 भाषाओं में आवाज़ के नमूने:')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUPPORTED_INDIAN_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setVoiceText(lang.sampleText);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs cursor-pointer font-medium transition-all ${
                      selectedLanguage === lang.code
                        ? 'border-[#FF4B6E] bg-rose-50 text-[#FF4B6E] font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{lang.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: AI Extracted Attributes & GI Validation */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#E11D48] bg-rose-50 px-2.5 py-0.5 rounded-full">
                Step 4: Smart Extraction & GI Tag Verification
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                {t('Review AI-Generated Listing & GI Provenance', 'एआई द्वारा तैयार लिस्टिंग व जीआई सत्यापन')}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  'Extracted automatically by Multimodal AI from your voice description. Validate your official Geographical Indication (GI) provenance.',
                  'आपकी आवाज़ से अपने आप पहचानी गई विशेषताएं। जीआई प्रामाणिकता की पुष्टि करें।'
                )}
              </p>
            </div>

            {/* GI Tag Certificate Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{t('GI Tag Registry Verified', 'जीआई टैग रजिस्ट्री सत्यापित')}</h4>
                    <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded">
                      {giRegistrationNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{giClusterName}</p>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-emerald-600 px-3 py-1 rounded-lg text-white">
                Authentic Maker
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('English Title', 'अंग्रेज़ी शीर्षक')}</label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Hindi Title', 'हिंदी शीर्षक')}</label>
                <input
                  type="text"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Craft Type', 'शिल्प का प्रकार')}</label>
                <input
                  type="text"
                  value={craftType}
                  onChange={(e) => setCraftType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Category', 'श्रेणी')}</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Primary Materials', 'प्राथमिक सामग्री')}</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Craft Technique', 'निर्माण तकनीक')}</label>
                <input
                  type="text"
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Bilingual Craft Story (English)', 'शिल्प कथा (अंग्रेज़ी)')}</label>
                <textarea
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Bilingual Craft Story (Hindi)', 'शिल्प कथा (हिंदी)')}</label>
                <textarea
                  rows={3}
                  value={descriptionHi}
                  onChange={(e) => setDescriptionHi(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none leading-relaxed font-hindi"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: ONDC Compliance & Logistics */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#E11D48] bg-rose-50 px-2.5 py-0.5 rounded-full">
                Step 5: ONDC Digital Network Compliance
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                {t('Packaging Standards & Physical Specifications', 'पैकेजिंग मानक व शारीरिक माप')}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  'Specifications required by the Open Network for Digital Commerce (ONDC) to enable automated courier dispatch and national buyer delivery.',
                  'राष्ट्रीय ओपन नेटवर्क पर पार्सल कूरियर और थोक ऑर्डर हेतु आवश्यक विनिर्देश।'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Product Dimensions', 'माप (लंबाई x चौड़ाई)')}</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 5.5 meters x 1.15 meters"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Stock Available (Units)', 'उपलब्ध स्टॉक (नग)')}</label>
                <input
                  type="number"
                  min={1}
                  value={quantityAvailable}
                  onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Care Instructions', 'देखभाल निर्देश')}</label>
                <input
                  type="text"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#E11D48] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                <input
                  type="checkbox"
                  id="customization"
                  checked={customizationAvailable}
                  onChange={(e) => setCustomizationAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#E11D48] rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="customization" className="text-xs font-medium text-gray-800 cursor-pointer">
                  {t('Customization Available for Bulk Corporate Orders (Colors, Dimensions, Monograms)', 'थोक व्यापार के लिए कस्टमाइज़ेशन उपलब्ध है')}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Smart Cost-Plus Fair Pricing Engine */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#E11D48] bg-rose-50 px-2.5 py-0.5 rounded-full">
                Step 6: Mathematical Cost-Plus Fair Pricing
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                {t('Deterministic Cost-Plus Pricing Calculation', 'पारदर्शी लागत-आधारित उचित मूल्य निर्धारण')}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  'Guaranteed non-exploitative pricing formula. Ensure that your raw materials and artisan days of labor are fairly compensated.',
                  'कारीगर की मेहनत और कच्चे माल का उचित पारिश्रमिक सुनिश्चित करने वाला गणितीय सूत्र।'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase">{t('Cost Inputs', 'लागत घटक')}</h4>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('Raw Materials (₹)', 'कच्चा माल (₹)')}</label>
                  <input
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t('Daily Wage (₹)', 'दैनिक पारिश्रमिक')}</label>
                    <input
                      type="number"
                      value={labourCostPerDay}
                      onChange={(e) => setLabourCostPerDay(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t('Labor Days', 'कार्य दिवस')}</label>
                    <input
                      type="number"
                      value={labourDays}
                      onChange={(e) => setLabourDays(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t('Packaging (₹)', 'पैकेजिंग')}</label>
                    <input
                      type="number"
                      value={packagingCost}
                      onChange={(e) => setPackagingCost(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t('Margin %', 'लाभ मार्जिन %')}</label>
                    <input
                      type="number"
                      value={marginPercent}
                      onChange={(e) => setMarginPercent(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown Summary Card */}
              <div className="p-6 bg-gradient-to-br from-rose-50 to-white rounded-2xl border border-rose-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-rose-100">
                    <span className="text-xs text-gray-600">{t('Total Production Cost', 'कुल निर्माण लागत')}</span>
                    <span className="text-sm font-bold text-gray-900">₹{pricingResult.totalCalculatedCost}</span>
                  </div>

                  <div className="py-3 space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>{t('Artisan Wage Earned:', 'कारीगर पारिश्रमिक:')}</span>
                      <span className="font-bold text-gray-900">₹{pricingResult.totalLabourCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('Materials + Packaging:', 'सामग्री व पैकेजिंग:')}</span>
                      <span className="font-bold text-gray-900">₹{pricingResult.materialCost + pricingResult.packagingCost}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-xs">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">{t('Retail Patron Price', 'खुदरा बिक्री मूल्य')}</span>
                      <p className="text-2xl font-black text-[#E11D48] mt-0.5">₹{pricingResult.finalListingPrice}</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-xs">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">{t('B2B Bulk Unit Price', 'थोक दर')}</span>
                      <p className="text-xl font-bold text-blue-600 mt-0.5">₹{pricingResult.suggestedBulkPrice}</p>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-emerald-700 font-semibold mt-4 bg-emerald-50 p-2 rounded-lg">
                  ✓ {t('100% of proceeds go directly to you without middleman cuts.', '100% राशि सीधे आपके बैंक खाते में।')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Select Catalogue Template Aesthetic */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#E11D48] bg-rose-50 px-2.5 py-0.5 rounded-full">
                Step 7: Multiple Catalogue Template Studio
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                {t('Choose the Lookbook Aesthetic for Your Product', 'अपने उत्पाद के लिए लुकबुक टेम्पलेट चुनें')}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  'Select the presentation style that suits your craft best. This will format your digital brochure card and printable lookbook.',
                  'वह शैली चुनें जो आपके शिल्प के लिए सर्वोत्तम हो। यह आपके डिजिटल कैटलॉग को फॉर्मेट करेगी।'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATALOGUE_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#E11D48] bg-rose-50 shadow-md ring-2 ring-rose-200'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{tmpl.icon}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tmpl.badgeStyle}`}>
                          {tmpl.tag}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900">{tmpl.nameEn}</h4>
                      <p className="text-[11px] font-hindi text-gray-500">{tmpl.nameHi}</p>
                      <p className="text-[11px] text-gray-600 mt-1 leading-snug">{tmpl.taglineEn}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <span className="text-gray-400">{tmpl.recommendedFor.split(',')[0]}</span>
                      <span className={isSelected ? 'text-[#E11D48] font-bold' : 'text-gray-500'}>
                        {isSelected ? '✓ ' + t('Selected', 'चयनित') : t('Choose', 'चुनें')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 8: Review & Publish to Catalogue */}
        {step === 8 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#E11D48] bg-rose-50 px-2.5 py-0.5 rounded-full">
                Step 8: Final Review & Publication
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                {t('Ready to Publish to Your Personal Catalogue', 'आपकी व्यक्तिगत कैटलॉग में प्रकाशित करने हेतु तैयार')}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  `This product will be linked directly and strictly to ${currentUser?.fullName}'s maker account with zero data collision.`,
                  `यह उत्पाद सीधे और केवल ${currentUser?.fullName} के खाते में प्रकाशित होगा।`
                )}
              </p>
            </div>

            {/* Lookbook Card Preview */}
            <div className="p-6 rounded-3xl border-2 border-gray-200 bg-white shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                <img
                  src={showEnhanced && enhancedImageUri ? enhancedImageUri : imageUri}
                  alt={titleEn}
                  className="w-full h-full object-cover"
                />
                {isAiProcessed && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md backdrop-blur-xs">
                    <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>AI Processed</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-rose-100 text-[#E11D48] font-bold text-[10px] rounded-md uppercase">
                    Template: {selectedTemplate}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">
                    GI Tag Verified: {giRegistrationNo}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-gray-900">{titleEn || 'Handcrafted Artisan Item'}</h3>
                <p className="text-xs font-hindi text-gray-600 font-semibold">{titleHi}</p>

                <p className="text-gray-700 leading-relaxed text-xs line-clamp-3">
                  {descriptionEn || voiceText}
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">{t('Direct Price', 'सीधा मूल्य')}</span>
                    <p className="text-2xl font-black text-[#E11D48]">₹{pricingResult.finalListingPrice}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">{t('Stock Available', 'स्टॉक')}</span>
                    <p className="text-base font-bold text-gray-900">{quantityAvailable} Units</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handlePublish}
                    className="w-full py-3 px-6 rounded-xl bg-[#E11D48] text-white font-extrabold text-sm hover:bg-[#BE123C] shadow-lg shadow-rose-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t('Confirm & Publish to My Catalogue', 'पुष्टि करें और कैटलॉग में जोड़ें')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation */}
      <div className="flex items-center justify-between mt-6">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Previous', 'पिछला')}</span>
          </button>
        ) : <div />}

        {step < 8 ? (
          <button
            onClick={async () => {
              if (step === 3) {
                await handleRunAiExtraction();
              }
              setStep(step + 1);
            }}
            disabled={step === 1 && !imageUri}
            className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
              step === 1 && !imageUri
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#E11D48] text-white hover:bg-[#BE123C] shadow-rose-200'
            }`}
          >
            <span>{t('Next Step', 'अगला चरण')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

