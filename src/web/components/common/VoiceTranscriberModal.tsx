import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  Volume2, 
  RotateCcw, 
  Globe, 
  Wand2,
  FileText,
  Radio
} from 'lucide-react';
import { speechService, SUPPORTED_INDIAN_LANGUAGES } from '../../../services/speech/speechService';
import { catalogAiService } from '../../../services/catalog-ai/catalogAiService';

interface VoiceTranscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText?: (text: string) => void;
  initialLanguage?: string;
}

export const VoiceTranscriberModal: React.FC<VoiceTranscriberModalProps> = ({
  isOpen,
  onClose,
  onInsertText,
  initialLanguage = 'hi-IN'
}) => {
  const [selectedLang, setSelectedLang] = useState<string>(initialLanguage);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [activeRecognizer, setActiveRecognizer] = useState<{ stop: () => void } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedDetails, setExtractedDetails] = useState<any | null>(null);

  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startListening = async () => {
    setIsListening(true);
    setInterimText('');
    setExtractedDetails(null);

    try {
      const recognizer = await speechService.startLiveTranscription(
        selectedLang,
        (text, isFinal) => {
          if (text.trim()) {
            setTranscript(text.trim());
            setInterimText(text.trim());
          }
        },
        (errorMsg) => {
          console.warn('[Voice Transcriber] Notice:', errorMsg);
          setIsListening(false);
        }
      );
      setActiveRecognizer(recognizer);
    } catch (err) {
      console.warn('[Voice Transcriber] Error starting mic:', err);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    if (activeRecognizer) {
      try {
        await activeRecognizer.stop();
      } catch {}
      setActiveRecognizer(null);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleCopy = () => {
    if (!transcript.trim()) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertText && transcript.trim()) {
      onInsertText(transcript.trim());
      onClose();
    }
  };

  const handleSampleClick = (sampleText: string) => {
    setTranscript(sampleText);
    setInterimText(sampleText);
    setExtractedDetails(null);
  };

  const handleAiExtract = async () => {
    if (!transcript.trim()) return;
    setIsExtracting(true);
    try {
      const structured = await catalogAiService.extractCraftFromVoice(transcript);
      setExtractedDetails(structured);
    } catch (err) {
      console.warn('AI Extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const selectedLangObj = SUPPORTED_INDIAN_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_INDIAN_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-xs text-white">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold">KalaSetu Voice Transcriber</h2>
              <p className="text-xs text-white/90 font-medium">
                Real-time speech-to-text in 11 Indian Languages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Language Selector Strip */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              Select Speech Language / भाषा चुनें
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {SUPPORTED_INDIAN_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang.code);
                    if (isListening) {
                      stopListening();
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedLang === lang.code
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Microphone Recording Orb & Controls */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-4">
            <button
              type="button"
              onClick={toggleMic}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-300 ring-8 ring-rose-100 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-amber-200 hover:scale-105'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-bounce" />
              ) : (
                <MicOff className="w-8 h-8" />
              )}
            </button>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {isListening ? 'Listening live... Speak in ' + selectedLangObj.label : 'Tap the microphone to start speaking'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isListening ? 'Your words will transcribe automatically below' : 'Supports audio input & live voice-to-text'}
              </p>
            </div>
          </div>

          {/* Live Transcript Display Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                Live Transcription Output
              </label>
              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Clear Text
                </button>
              )}
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Spoken words will appear here in real-time... Or tap any sample phrase below."
              rows={4}
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Quick Language Sample Triggers */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              1-Click Sample Regional Craft Voice Text ({selectedLangObj.label})
            </label>
            <div
              onClick={() => handleSampleClick(selectedLangObj.sampleText)}
              className="p-3 bg-amber-50 hover:bg-amber-100/80 rounded-xl border border-amber-200 text-amber-900 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between group"
            >
              <span>"{selectedLangObj.sampleText}"</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-800 px-2 py-0.5 rounded-md group-hover:bg-amber-300">
                Use Sample
              </span>
            </div>
          </div>

          {/* AI Craft Details Extraction */}
          {transcript.trim().length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={handleAiExtract}
                  disabled={isExtracting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {isExtracting ? 'AI Analyzing Voice...' : 'Auto-Extract Structured Craft Info'}
                </button>
              </div>

              {extractedDetails && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs space-y-2 text-purple-950 animate-in fade-in">
                  <p className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-purple-600" />
                    Structured Craft Data Extracted
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="font-bold text-purple-800">Craft Name:</span> {extractedDetails.productName || 'N/A'}</div>
                    <div><span className="font-bold text-purple-800">Category:</span> {extractedDetails.category || 'N/A'}</div>
                    <div><span className="font-bold text-purple-800">Materials:</span> {extractedDetails.materialsUsed?.join(', ') || 'N/A'}</div>
                    <div><span className="font-bold text-purple-800">Estimated Price:</span> ₹{extractedDetails.basePrice || 'N/A'}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!transcript.trim()}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Transcript'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>
            {onInsertText && (
              <button
                type="button"
                onClick={handleInsert}
                disabled={!transcript.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-40"
              >
                Insert Transcribed Text
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
