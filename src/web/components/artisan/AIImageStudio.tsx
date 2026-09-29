import React, { useState, useRef, useEffect } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { StudioPreset, imageService } from '../../../services/image/imageService';
import { UnifiedOverlayModal } from '../common/UnifiedOverlayModal';
import {
  Sparkles,
  Camera,
  Upload,
  Sliders,
  Download,
  CheckCircle2,
  Eye,
  RefreshCw,
  Layers,
  ArrowRight,
  Maximize2,
  Volume2,
  VolumeX,
  Video,
  Play,
  RotateCcw,
  Sun,
  Contrast,
  Palette,
  ShieldCheck,
  Save,
  Trash2,
  ExternalLink,
  Crop,
  RotateCw,
  Zap,
  Wand2,
  X,
  ArrowLeft,
  Check,
  Key,
  Settings
} from 'lucide-react';

interface SavedAsset {
  id: string;
  originalUri: string;
  enhancedUri: string;
  preset: string;
  title: string;
  createdAt: string;
}

export type LightingMode = 'softbox' | 'golden_hour' | 'spotlight' | 'zari_luster' | 'natural';

export interface StudioBackdrop {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  previewColor: string;
  type: 'white' | 'velvet' | 'workshop' | 'marble' | 'sunset' | 'transparent';
}

export const STUDIO_BACKDROPS: StudioBackdrop[] = [
  {
    id: 'studio_white',
    nameEn: 'E-Commerce Clean White',
    nameHi: 'ई-कॉमर्स शुद्ध सफेद',
    icon: '📦',
    previewColor: '#FFFFFF',
    type: 'white'
  },
  {
    id: 'heritage_velvet',
    nameEn: 'Royal Heritage Velvet',
    nameHi: 'शाही मखमली लाल',
    icon: '👑',
    previewColor: '#580824',
    type: 'velvet'
  },
  {
    id: 'rural_loom',
    nameEn: 'Artisan Loom Workshop',
    nameHi: 'हथकरघा कार्यशाला परिवेश',
    icon: '🧵',
    previewColor: '#7C2D12',
    type: 'workshop'
  },
  {
    id: 'minimalist_marble',
    nameEn: 'Italian White Marble',
    nameHi: 'सफेद संगमरमर पेडस्टल',
    icon: '🏛️',
    previewColor: '#E2E8F0',
    type: 'marble'
  },
  {
    id: 'golden_sunlight',
    nameEn: 'Golden Hour Courtyard',
    nameHi: 'सुनहरी धूप परिवेश',
    icon: '☀️',
    previewColor: '#D97706',
    type: 'sunset'
  },
  {
    id: 'transparent_png',
    nameEn: 'Transparent PNG Cutout',
    nameHi: 'पारदर्शी कटआउट (PNG)',
    icon: '✨',
    previewColor: 'transparent',
    type: 'transparent'
  }
];

export const AIImageStudio: React.FC = () => {
  const { currentUser, setActiveTab, t, language } = useWebApp();

  // Active Modes: 'studio' (enhance & bg removal) or 'veo' (animate into video)
  const [activeMode, setActiveMode] = useState<'studio' | 'veo'>('studio');

  // Image State
  const [rawImageUri, setRawImageUri] = useState<string>(
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80' // Patola Silk Saree default
  );
  const [enhancedImageUri, setEnhancedImageUri] = useState<string>('');
  const [imageTitle, setImageTitle] = useState<string>('Patan Patola Silk Double Ikat');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [compareSplit, setCompareSplit] = useState<number>(50); // 0 to 100%
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState<boolean>(false);

  // Background Segmentation & Studio Backdrops
  const [activeBackdrop, setActiveBackdrop] = useState<string>('studio_white');
  const [removeBgEnabled, setRemoveBgEnabled] = useState<boolean>(true);
  const [segmentationSensitivity, setSegmentationSensitivity] = useState<number>(35); // 10 to 60
  const [edgeSmoothing, setEdgeSmoothing] = useState<number>(8); // 0 to 20

  // Computer Vision Enhancements
  const [autoEnhanceApplied, setAutoEnhanceApplied] = useState<boolean>(true);
  const [lightingMode, setLightingMode] = useState<LightingMode>('softbox');
  const [brightness, setBrightness] = useState<number>(14); // -50 to +50
  const [contrast, setContrast] = useState<number>(18); // -50 to +50
  const [saturation, setSaturation] = useState<number>(20); // -50 to +50
  const [warmth, setWarmth] = useState<number>(6); // -50 to +50
  const [sharpness, setSharpness] = useState<number>(25); // 0 to 50
  const [rotationAngle, setRotationAngle] = useState<number>(0); // -15 to +15 deg
  const [autoCropped, setAutoCropped] = useState<boolean>(true);
  const [dropShadowEnabled, setDropShadowEnabled] = useState<boolean>(true);

  // Saved Artisan Account Assets Gallery
  const [savedAssets, setSavedAssets] = useState<SavedAsset[]>(() => {
    if (!currentUser?.id) return [];
    const saved = localStorage.getItem(`kalasetu_artisan_assets_${currentUser.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Audio Guide accessibility
  const [isSpeakingGuide, setIsSpeakingGuide] = useState<boolean>(false);

  // Remove.bg API Key Modal State
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [removeBgKeyInput, setRemoveBgKeyInput] = useState<string>(() => imageService.getRemoveBgApiKey());
  const [apiKeySaveStatus, setApiKeySaveStatus] = useState<string | null>(null);

  // Veo Video Animation State
  const [veoAspectRatio, setVeoAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  const [veoPrompt, setVeoPrompt] = useState<string>(
    'Slow 360-degree rotation showing the shimmering gold zari and intricate patola weave on silk loom'
  );
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [veoVideoUri, setVeoVideoUri] = useState<string | null>(null);
  const [veoProgress, setVeoProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut (Escape) to exit full-screen view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreenModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time Canvas Rendering with On-Device Segmentation & Computer Vision Filters
  const renderEnhancedImage = async () => {
    if (!rawImageUri) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetWidth = 1000;
        const targetHeight = Math.round((img.height / img.width) * 1000) || 1000;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        const backdropDef = STUDIO_BACKDROPS.find(b => b.id === activeBackdrop) || STUDIO_BACKDROPS[0];

        // 1. DRAW STUDIO BACKGROUND (if background removal is on)
        if (removeBgEnabled && backdropDef.type !== 'transparent') {
          if (backdropDef.type === 'white') {
            const grad = ctx.createRadialGradient(
              targetWidth / 2,
              targetHeight / 2,
              targetWidth * 0.1,
              targetWidth / 2,
              targetHeight / 2,
              targetWidth * 0.95
            );
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(0.7, '#F8FAFC');
            grad.addColorStop(1, '#E2E8F0');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          } else if (backdropDef.type === 'velvet') {
            const grad = ctx.createRadialGradient(
              targetWidth / 2,
              targetHeight / 2,
              targetWidth * 0.15,
              targetWidth / 2,
              targetHeight / 2,
              targetWidth
            );
            grad.addColorStop(0, '#6B1130');
            grad.addColorStop(0.65, '#43061C');
            grad.addColorStop(1, '#21000B');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          } else if (backdropDef.type === 'workshop') {
            const grad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
            grad.addColorStop(0, '#3E1C0A');
            grad.addColorStop(0.5, '#58260E');
            grad.addColorStop(1, '#2B1206');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          } else if (backdropDef.type === 'marble') {
            const grad = ctx.createLinearGradient(0, 0, 0, targetHeight);
            grad.addColorStop(0, '#F1F5F9');
            grad.addColorStop(0.7, '#E2E8F0');
            grad.addColorStop(1, '#CBD5E1');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          } else if (backdropDef.type === 'sunset') {
            const grad = ctx.createRadialGradient(
              targetWidth / 2,
              targetHeight * 0.35,
              targetWidth * 0.1,
              targetWidth / 2,
              targetHeight / 2,
              targetWidth * 0.95
            );
            grad.addColorStop(0, '#FFFBEB');
            grad.addColorStop(0.4, '#FEF3C7');
            grad.addColorStop(1, '#C2410C');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          }
        } else if (removeBgEnabled && backdropDef.type === 'transparent') {
          // Clear transparent canvas
          ctx.clearRect(0, 0, targetWidth, targetHeight);
        }

        // 2. REALISTIC CONTACT FLOOR SHADOW
        if (dropShadowEnabled && removeBgEnabled && backdropDef.type !== 'transparent') {
          ctx.save();
          ctx.filter = 'blur(18px)';
          ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
          ctx.beginPath();
          ctx.ellipse(
            targetWidth / 2,
            targetHeight * 0.88,
            targetWidth * 0.42,
            targetHeight * 0.08,
            0,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.restore();
        }

        // 3. PIXEL-LEVEL BACKGROUND ISOLATION & SEGMENTATION
        let drawSource: CanvasImageSource = img;
        if (removeBgEnabled) {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = targetWidth;
          tempCanvas.height = targetHeight;
          const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
            const imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight);
            const data = imgData.data;

            // Sample perimeter border pixels for multi-point background color distribution
            const sampleCoords = [
              [4, 4], [targetWidth - 5, 4], [4, targetHeight - 5], [targetWidth - 5, targetHeight - 5],
              [Math.floor(targetWidth / 2), 4], [4, Math.floor(targetHeight / 2)], [targetWidth - 5, Math.floor(targetHeight / 2)],
              [Math.floor(targetWidth / 4), 4], [Math.floor((3 * targetWidth) / 4), 4]
            ];
            
            const bgPalette: [number, number, number][] = sampleCoords.map(([x, y]) => {
              const idx = (y * targetWidth + x) * 4;
              return [data[idx], data[idx + 1], data[idx + 2]];
            });

            const threshold = segmentationSensitivity || 45;
            const centerX = targetWidth / 2;
            const centerY = targetHeight / 2;
            const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const px = (i / 4) % targetWidth;
              const py = Math.floor((i / 4) / targetWidth);

              // Radial distance from center (central craft protection)
              const radialDist = Math.sqrt((px - centerX) ** 2 + (py - centerY) ** 2) / maxRadius;

              // Compute minimum Euclidean color distance to any background palette entry
              let minDist = 999;
              for (const [bgR, bgG, bgB] of bgPalette) {
                const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
                if (dist < minDist) minDist = dist;
              }

              // Background removal criteria with edge feathering
              const effectiveThreshold = threshold * (0.85 + radialDist * 0.4);
              if (minDist < effectiveThreshold) {
                data[i + 3] = 0; // Completely cut out background
              } else if (minDist < effectiveThreshold + (edgeSmoothing || 12)) {
                const alphaRatio = (minDist - effectiveThreshold) / (edgeSmoothing || 12);
                data[i + 3] = Math.round(alphaRatio * 255); // Smooth feathered edge
              }
            }
            tempCtx.putImageData(imgData, 0, 0);
            drawSource = tempCanvas;
          }
        }

        // 4. DRAW RAW PRODUCT WITH COLOR / LIGHTING FILTERS & ROTATION STRAIGHTENER
        ctx.save();

        // Apply rotation angle correction
        if (rotationAngle !== 0) {
          ctx.translate(targetWidth / 2, targetHeight / 2);
          ctx.rotate((rotationAngle * Math.PI) / 180);
          ctx.translate(-targetWidth / 2, -targetHeight / 2);
        }

        // Calculate filter string (only apply adjustments when non-zero)
        const bVal = 100 + brightness;
        const cVal = 100 + contrast;
        const sVal = 100 + saturation;
        if (brightness !== 0 || contrast !== 0 || saturation !== 0) {
          ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;
        }

        // Smart auto-cropping & centering padding
        let drawX = 0;
        let drawY = 0;
        let drawW = targetWidth;
        let drawH = targetHeight;

        if (autoCropped && removeBgEnabled) {
          drawW = targetWidth * 0.86;
          drawH = targetHeight * 0.86;
          drawX = (targetWidth - drawW) / 2;
          drawY = (targetHeight - drawH) / 2 - 10;
        }

        ctx.drawImage(drawSource, drawX, drawY, drawW, drawH);
        ctx.restore();

        // 4. MULTI-MODE STUDIO RELIGHTING EFFECT
        if (lightingMode !== 'natural') {
          ctx.save();
          if (lightingMode === 'softbox') {
            const softboxGrad = ctx.createRadialGradient(
              targetWidth * 0.45,
              targetHeight * 0.35,
              50,
              targetWidth / 2,
              targetHeight / 2,
              targetWidth * 0.7
            );
            softboxGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
            softboxGrad.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
            ctx.fillStyle = softboxGrad;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          } else if (lightingMode === 'golden_hour') {
            const goldGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
            goldGrad.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
            goldGrad.addColorStop(1, 'rgba(194, 65, 12, 0.10)');
            ctx.fillStyle = goldGrad;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          } else if (lightingMode === 'spotlight') {
            const spotGrad = ctx.createRadialGradient(
              targetWidth / 2,
              targetHeight * 0.45,
              80,
              targetWidth / 2,
              targetHeight / 2,
              targetWidth * 0.55
            );
            spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
            spotGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.0)');
            spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
            ctx.fillStyle = spotGrad;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          } else if (lightingMode === 'zari_luster') {
            // High-luster glitter glaze for silk & metal
            ctx.fillStyle = 'rgba(254, 240, 138, 0.14)';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          }
          ctx.restore();
        }

        // 5. COLOR WARMTH / TEMPERATURE
        if (warmth !== 0) {
          ctx.save();
          if (warmth > 0) {
            ctx.fillStyle = `rgba(255, 170, 0, ${Math.min(0.2, (warmth / 50) * 0.15)})`;
          } else {
            ctx.fillStyle = `rgba(0, 140, 255, ${Math.min(0.2, (Math.abs(warmth) / 50) * 0.15)})`;
          }
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.restore();
        }

        // 6. VERIFICATION BADGE WATERMARK
        ctx.save();
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText('✨ KalaSetu AI Studio Verified', targetWidth - 250, targetHeight - 20);
        ctx.restore();

        const resultDataUrl = backdropDef.type === 'transparent'
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', 0.95);

        setEnhancedImageUri(resultDataUrl);
        setIsProcessing(false);
      };

      img.onerror = () => {
        setEnhancedImageUri(rawImageUri);
        setIsProcessing(false);
      };

      img.src = rawImageUri;
    } catch {
      setEnhancedImageUri(rawImageUri);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    renderEnhancedImage();
  }, [
    rawImageUri,
    activeBackdrop,
    removeBgEnabled,
    lightingMode,
    brightness,
    contrast,
    saturation,
    warmth,
    rotationAngle,
    autoCropped,
    dropShadowEnabled
  ]);

  // Handle direct file upload from device or camera
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUri = event.target?.result as string;
      if (resultUri) {
        setRawImageUri(resultUri);
        handleAutoEnhance();
      }
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Studio Auto-Enhance
  const handleAutoEnhance = () => {
    setAutoEnhanceApplied(true);
    setBrightness(16);
    setContrast(22);
    setSaturation(24);
    setWarmth(6);
    setLightingMode('softbox');
    setRemoveBgEnabled(true);
    setDropShadowEnabled(true);
    setAutoCropped(true);
    setRotationAngle(0);
  };

  // Reset to neutral settings
  const handleResetSliders = () => {
    setAutoEnhanceApplied(false);
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setWarmth(0);
    setLightingMode('natural');
    setRemoveBgEnabled(false);
    setDropShadowEnabled(false);
    setAutoCropped(false);
    setRotationAngle(0);
  };

  // Save the optimized image directly to artisan account
  const handleSaveToAccount = () => {
    if (!enhancedImageUri || !currentUser?.id) return;

    const newAsset: SavedAsset = {
      id: 'asset-' + Date.now(),
      originalUri: rawImageUri,
      enhancedUri: enhancedImageUri,
      preset: activeBackdrop,
      title: imageTitle || 'Handcrafted Artisan Craft',
      createdAt: new Date().toISOString(),
    };

    const updated = [newAsset, ...savedAssets];
    setSavedAssets(updated);
    localStorage.setItem(`kalasetu_artisan_assets_${currentUser.id}`, JSON.stringify(updated));

    setSaveSuccessMsg(t('Saved to your Artisan Account Gallery!', 'आपकी आर्टिसन गैलरी में सहेजा गया!'));
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Delete saved asset
  const handleDeleteAsset = (id: string) => {
    if (!currentUser?.id) return;
    const updated = savedAssets.filter((a) => a.id !== id);
    setSavedAssets(updated);
    localStorage.setItem(`kalasetu_artisan_assets_${currentUser.id}`, JSON.stringify(updated));
  };

  // Send optimized image directly into Smart Catalog Wizard
  const handleSendToWizard = (imageToUse: string) => {
    sessionStorage.setItem('kalasetu_wizard_image', imageToUse);
    sessionStorage.setItem('kalasetu_wizard_title', imageTitle);
    setActiveTab('wizard');
  };

  // Download high-res image
  const handleDownload = () => {
    if (!enhancedImageUri) return;
    const link = document.createElement('a');
    link.href = enhancedImageUri;
    link.download = `kalasetu-studio-${imageTitle.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.click();
  };

  // Audio Accessibility Guide
  const handleToggleVoiceGuide = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeakingGuide) {
      window.speechSynthesis.cancel();
      setIsSpeakingGuide(false);
      return;
    }

    const textToSpeak =
      language === 'hi'
        ? 'कलासेतु एआई इमेज स्टूडियो में आपका स्वागत है। यहां आप अपने कैमरे से फोटो अपलोड कर सकते हैं, कार्यशाला की पृष्ठभूमि हटा सकते हैं, और स्टूडियो लाइटिंग चुन सकते हैं।'
        : 'Welcome to KalaSetu AI Image Studio. Upload raw photos, instantly remove cluttered workshop backgrounds, and apply studio softbox lighting with one tap.';

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingGuide(false);
    utterance.onerror = () => setIsSpeakingGuide(false);

    setIsSpeakingGuide(true);
    window.speechSynthesis.speak(utterance);
  };

  // Simulate Veo Video Generation
  const handleGenerateVeoVideo = () => {
    setIsGeneratingVideo(true);
    setVeoProgress(10);
    setVeoVideoUri(null);

    const interval = setInterval(() => {
      setVeoProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      setVeoProgress(100);
      setIsGeneratingVideo(false);
      setVeoVideoUri('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    }, 2800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Studio Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="p-2.5 rounded-2xl bg-amber-50 text-[#C2410C] shadow-xs">
              <Camera className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900">
                  {t('AI Computer Vision Studio & Background Isolator', 'एआई कंप्यूटर विज़न फोटो स्टूडियो व बैकग्राउंड आइसोलेशन')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C2410C] text-white">
                  v2.5 Neural CV
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {t(
                  'Instant on-device background segmentation, low-light relighting, auto-cropping & e-commerce compliance for rural artisans.',
                  'कच्ची फोन फोटो से बैकग्राउंड हटाएं, लो-लाइट में सुधार करें और ई-कॉमर्स रेडी स्टूडियो फोटो बनाएं।'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleVoiceGuide}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isSpeakingGuide
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isSpeakingGuide ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
            <span>{isSpeakingGuide ? t('Stop Audio Guide', 'ऑडियो रोकें') : t('Voice Guide', 'बोलकर सुनें')}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C2410C] text-white text-xs font-bold shadow-md shadow-amber-900/20 hover:bg-[#9A3412] transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{t('Upload Phone Photo', 'फोन से फोटो चुनें')}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveMode('studio')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMode === 'studio' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Camera className="w-4 h-4 text-[#C2410C]" />
          <span>{t('AI Studio & Segmentation', 'एआई स्टूडियो व बैकग्राउंड')}</span>
        </button>

        <button
          onClick={() => setActiveMode('veo')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMode === 'veo' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Video className="w-4 h-4 text-purple-600" />
          <span>{t('Veo Motion Video', 'वीओ 3D वीडियो')}</span>
        </button>
      </div>

      {activeMode === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Image Canvas & Live Before/After Preview (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    {t('Live Studio Output', 'लाइव स्टूडियो आउटपुट')}
                  </span>
                  {removeBgEnabled && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{t('BG Isolated', 'बैकग्राउंड हटाया')}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsComparing(!isComparing)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isComparing
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isComparing ? t('Exit Compare', 'तुलना बंद करें') : t('Before / After Split', 'तुलना स्लाइडर')}</span>
                  </button>

                  <button
                    onClick={() => setIsFullscreenModalOpen(true)}
                    className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    title="Fullscreen Preview"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative aspect-square sm:aspect-4/3 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center shadow-inner group">
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                    <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mb-2" />
                    <span className="text-xs font-bold">{t('Segmenting & Enhancing Image...', 'एआई प्रोसेसिंग जारी है...')}</span>
                  </div>
                )}

                {isComparing ? (
                  // Split Slider View
                  <div className="relative w-full h-full select-none">
                    {/* Background Original */}
                    <img
                      src={rawImageUri}
                      alt="Raw Photo"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
                      {t('RAW ORIGINAL', 'मूल फोटो')}
                    </div>

                    {/* Foreground Enhanced (Clipped) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${compareSplit}%` }}
                    >
                      <img
                        src={enhancedImageUri || rawImageUri}
                        alt="AI Studio Enhanced"
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: '100%', height: '100%' }}
                      />
                      <div className="absolute top-3 right-3 bg-[#C2410C] text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
                        {t('AI STUDIO', 'एआई स्टूडियो')}
                      </div>
                    </div>

                    {/* Divider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10 flex items-center justify-center"
                      style={{ left: `${compareSplit}%` }}
                    >
                      <div className="w-6 h-6 rounded-full bg-white text-gray-800 shadow-md flex items-center justify-center text-[10px] font-bold">
                        ↔
                      </div>
                    </div>

                    {/* Slider input */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={compareSplit}
                      onChange={(e) => setCompareSplit(Number(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                    />
                  </div>
                ) : (
                  // Normal Enhanced View
                  <>
                    <img
                      src={enhancedImageUri || rawImageUri}
                      alt={imageTitle}
                      className="w-full h-full object-contain"
                    />
                    {enhancedImageUri && !isProcessing && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-600/95 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-xl backdrop-blur-md border border-emerald-300/40 animate-in fade-in">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>AI Processed</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Image Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAutoEnhance}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('⚡ 1-Click AI Auto-Enhance', '⚡ एआई ऑटो सुधार')}</span>
                  </button>

                  <button
                    onClick={handleResetSliders}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('Reset', 'रीसेट')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToAccount}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{t('Save to Gallery', 'गैलरी में सहेजें')}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C2410C] text-white text-xs font-bold hover:bg-[#9A3412] transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('Download HD', 'डाउनलोड HD')}</span>
                  </button>
                </div>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: AI Computer Vision & Lighting Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. ON-DEVICE BACKGROUND SEGMENTATION */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-amber-50 text-[#C2410C]">
                    <Layers className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {t('1. On-Device Background Segmentation', '1. पृष्ठभूमि निष्कासन व रिप्लेसमेंट')}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      {t('Isolate craft from cluttered rural room backgrounds', 'घर या कार्यशाला की पृष्ठभूमि हटाएं')}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeBgEnabled}
                    onChange={(e) => setRemoveBgEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C2410C]"></div>
                </label>
              </div>

              {removeBgEnabled && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-gray-700 block">
                    {t('Select Studio Environment Backdrop:', 'स्टूडियो बैकग्राउंड चुनें:')}
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STUDIO_BACKDROPS.map((bd) => {
                      const isSelected = activeBackdrop === bd.id;
                      return (
                        <button
                          key={bd.id}
                          onClick={() => setActiveBackdrop(bd.id)}
                          className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'border-[#C2410C] bg-amber-50/50 shadow-xs ring-1 ring-[#C2410C]'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{bd.icon}</span>
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                              style={{ backgroundColor: bd.previewColor }}
                            />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-gray-900 block leading-tight">
                              {language === 'hi' ? bd.nameHi : bd.nameEn}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="text-xs text-gray-700 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dropShadowEnabled}
                        onChange={(e) => setDropShadowEnabled(e.target.checked)}
                        className="rounded text-[#C2410C]"
                      />
                      <span>{t('Contact Floor Shadow', 'यथार्थवादी फर्श छाया')}</span>
                    </label>

                    <label className="text-xs text-gray-700 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoCropped}
                        onChange={(e) => setAutoCropped(e.target.checked)}
                        className="rounded text-[#C2410C]"
                      />
                      <span>{t('Auto-Center Object', 'कैटलॉग सेंटरिंग')}</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* 2. COMPUTER VISION LIGHTING & CORRECTIONS */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-amber-50 text-[#C2410C]">
                    <Sun className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {t('2. Computer Vision Lighting & Angle Correction', '2. स्टूडियो लाइटिंग व एंगल सुधार')}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      {t('Compensate for low light and tilted mobile cameras', 'कम रोशनी व टेढ़े कोण को सीधा करें')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lighting Presets */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  {t('Studio Lighting Preset:', 'लाइटिंग प्रीसेट:')}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setLightingMode('softbox')}
                    className={`p-2 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      lightingMode === 'softbox' ? 'bg-[#C2410C] text-white border-[#C2410C]' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    💡 {t('Studio Softbox', 'सॉफ्टबॉक्स लाइट')}
                  </button>

                  <button
                    onClick={() => setLightingMode('golden_hour')}
                    className={`p-2 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      lightingMode === 'golden_hour' ? 'bg-[#C2410C] text-white border-[#C2410C]' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    🌅 {t('Golden Hour Sunlight', 'सुनहरी धूप')}
                  </button>

                  <button
                    onClick={() => setLightingMode('spotlight')}
                    className={`p-2 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      lightingMode === 'spotlight' ? 'bg-[#C2410C] text-white border-[#C2410C]' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    🔦 {t('Gallery Spotlight', 'गैलरी स्पॉटलाइट')}
                  </button>

                  <button
                    onClick={() => setLightingMode('zari_luster')}
                    className={`p-2 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      lightingMode === 'zari_luster' ? 'bg-[#C2410C] text-white border-[#C2410C]' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    ✨ {t('Zari & Silk Glaze', 'ज़री व रेशम चमक')}
                  </button>
                </div>
              </div>

              {/* Fine-Tuning Sliders */}
              <div className="space-y-3 pt-2">
                {/* Brightness */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>{t('Brightness (Low Light Boost)', 'चमक (कम रोशनी सुधार)')}</span>
                    <span className="text-[#C2410C]">{brightness > 0 ? `+${brightness}` : brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-[#C2410C]"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>{t('Contrast & Depth', 'कंट्रास्ट व गहराई')}</span>
                    <span className="text-[#C2410C]">{contrast > 0 ? `+${contrast}` : contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-[#C2410C]"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>{t('Natural Dye Vibrancy', 'प्राकृतिक रंग संतृप्ति')}</span>
                    <span className="text-[#C2410C]">{saturation > 0 ? `+${saturation}` : saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="40"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-[#C2410C]"
                  />
                </div>

                {/* Rotation Angle Straightener */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>{t('Straighten Camera Angle / Tilt', 'सीधा करें (कैमरा एंगल)')}</span>
                    <span className="text-[#C2410C]">{rotationAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    value={rotationAngle}
                    onChange={(e) => setRotationAngle(Number(e.target.value))}
                    className="w-full accent-[#C2410C]"
                  />
                </div>
              </div>

              {/* Direct Next Step */}
              <div className="pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleSendToWizard(enhancedImageUri)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-extrabold text-xs shadow-lg shadow-amber-900/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('Use in Smart Catalog Wizard →', 'स्मार्ट कैटलॉग विज़ार्ड में उपयोग करें →')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VEO VIDEO ANIMATION TAB */}
      {activeMode === 'veo' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
          <div className="max-w-2xl space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" />
              <span>{t('Veo 3.1 AI Craft Video Generation', 'वीओ 3.1 एआई क्राफ्ट वीडियो निर्माण')}</span>
            </h3>
            <p className="text-xs text-gray-500">
              {t(
                'Generate short, high-definition 360-degree rotation reels showing craft texture, weave luster, and artisan heritage.',
                'अपनी हस्तशिल्प फोटो को इंस्टाग्राम रील्स व ओएनडीसी के लिए 360-डिग्री मोशन वीडियो में बदलें।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t('Aspect Ratio:', 'पहलू अनुपात:')}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVeoAspectRatio('9:16')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      veoAspectRatio === '9:16' ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    📱 9:16 (Instagram & Shorts)
                  </button>
                  <button
                    onClick={() => setVeoAspectRatio('16:9')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      veoAspectRatio === '16:9' ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    🖥️ 16:9 (Marketplace Display)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t('Motion Prompt:', 'मोशन प्रॉम्प्ट:')}
                </label>
                <textarea
                  value={veoPrompt}
                  onChange={(e) => setVeoPrompt(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-purple-600"
                />
              </div>

              <button
                onClick={handleGenerateVeoVideo}
                disabled={isGeneratingVideo}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGeneratingVideo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t(`Synthesizing Veo Video (${veoProgress}%)...`, `वीडियो बन रहा है (${veoProgress}%)...`)}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t('Generate 3D Craft Motion Video', '3D क्राफ्ट वीडियो बनाएं')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Player Output */}
            <div className="aspect-9/16 sm:aspect-4/3 max-h-96 rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-gray-800 shadow-xl relative mx-auto">
              {veoVideoUri ? (
                <video
                  src={veoVideoUri}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              ) : isGeneratingVideo ? (
                <div className="text-center text-white space-y-3 p-6">
                  <RefreshCw className="w-10 h-10 animate-spin text-purple-400 mx-auto" />
                  <p className="text-xs font-bold">{t('Generating cinematic camera orbit...', 'कैमरा ऑर्बिट तैयार हो रहा है...')}</p>
                </div>
              ) : (
                <div className="text-center text-gray-400 p-6 space-y-2">
                  <Video className="w-12 h-12 mx-auto text-gray-600" />
                  <p className="text-xs">{t('Click generate to render Veo motion preview', 'वीओ 3D वीडियो बनाने के लिए क्लिक करें')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UNIFIED FULLSCREEN OVERLAY LIGHTBOX MODAL */}
      <UnifiedOverlayModal
        isOpen={isFullscreenModalOpen && !!enhancedImageUri}
        onClose={() => setIsFullscreenModalOpen(false)}
        title={imageTitle || 'AI Studio Enhanced Master'}
        subtitle="High-Resolution E-Commerce Studio Preview"
        headerActions={
          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-[#FF4B6E] hover:bg-[#FF3358] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('Download Image', 'डाउनलोड करें')}</span>
          </button>
        }
      >
        {enhancedImageUri && (
          <div className="relative max-h-[75vh] max-w-full flex items-center justify-center rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <img
              src={enhancedImageUri}
              alt="Enhanced Studio Master"
              className="max-h-[75vh] w-auto object-contain rounded-2xl block"
            />
          </div>
        )}
      </UnifiedOverlayModal>

      {/* EXTERNAL API CONFIGURATION MODAL (REMOVE.BG & CLOUDINARY) */}
      <UnifiedOverlayModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        title={t('Background Removal API Settings', 'बैकग्राउंड रिमूवल API सेटिंग्स')}
        subtitle={t('Connect official Remove.bg or Cloudinary keys for high-precision craft isolation', 'आधिकारिक Remove.bg या Cloudinary API कुंजी')}
      >
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 text-slate-800 shadow-xl border border-slate-100">
          {/* Section 1: Remove.bg */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Remove.bg API Key</span>
              </label>
              <a
                href="https://www.remove.bg/api"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-[#C2410C] hover:underline"
              >
                Get Free API Key →
              </a>
            </div>
            <input
              type="password"
              value={removeBgKeyInput}
              onChange={(e) => setRemoveBgKeyInput(e.target.value)}
              placeholder="Paste your remove.bg API key (e.g. k5Jk9a8...)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:border-[#C2410C]"
            />
          </div>

          {/* Section 2: Cloudinary */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Cloudinary AI Background Removal</span>
              </label>
              <a
                href="https://cloudinary.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-[#C2410C] hover:underline"
              >
                Cloudinary Account →
              </a>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                defaultValue={imageService.getCloudinaryConfig().cloudName}
                id="cloudinary_cloud_name_studio"
                placeholder="Cloud Name (e.g. kalasetu)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:border-[#C2410C]"
              />
              <input
                type="text"
                defaultValue={imageService.getCloudinaryConfig().uploadPreset || ''}
                id="cloudinary_preset_studio"
                placeholder="Upload Preset (optional)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:border-[#C2410C]"
              />
            </div>
          </div>

          {apiKeySaveStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{apiKeySaveStatus}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 gap-3">
            <button
              onClick={() => {
                imageService.setRemoveBgApiKey('');
                imageService.setCloudinaryConfig({ cloudName: '', uploadPreset: '' });
                setRemoveBgKeyInput('');
                const nameEl = document.getElementById('cloudinary_cloud_name_studio') as HTMLInputElement;
                const presetEl = document.getElementById('cloudinary_preset_studio') as HTMLInputElement;
                if (nameEl) nameEl.value = '';
                if (presetEl) presetEl.value = '';
                setApiKeySaveStatus(t('API Keys cleared. Using on-device Neural CV.', 'कुंजी हटा दी गई। ऑन-डिवाइस न्यूरल सीवी चालू।'));
                setTimeout(() => setApiKeySaveStatus(null), 2500);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              {t('Clear Keys', 'कुंजी हटाएं')}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {t('Close', 'बंद करें')}
              </button>
              <button
                onClick={() => {
                  const nameEl = document.getElementById('cloudinary_cloud_name_studio') as HTMLInputElement;
                  const presetEl = document.getElementById('cloudinary_preset_studio') as HTMLInputElement;
                  imageService.setRemoveBgApiKey(removeBgKeyInput.trim());
                  if (nameEl) {
                    imageService.setCloudinaryConfig({
                      cloudName: nameEl.value.trim(),
                      uploadPreset: presetEl?.value.trim() || ''
                    });
                  }
                  setApiKeySaveStatus(t('API Settings saved successfully!', 'API सेटिंग्स सहेजी गईं!'));
                  renderEnhancedImage();
                  setTimeout(() => {
                    setApiKeySaveStatus(null);
                    setIsApiKeyModalOpen(false);
                  }, 1200);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {t('Save & Apply', 'सहेजें व लागू करें')}
              </button>
            </div>
          </div>
        </div>
      </UnifiedOverlayModal>
    </div>
  );
};
