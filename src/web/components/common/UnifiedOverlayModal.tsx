import React, { useEffect } from 'react';
import { X, ArrowLeft, Download, Share2 } from 'lucide-react';

interface UnifiedOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  footerActions?: React.ReactNode;
  maxWidthClass?: string;
  theme?: 'dark' | 'glass' | 'light';
}

export const UnifiedOverlayModal: React.FC<UnifiedOverlayModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  headerActions,
  footerActions,
  maxWidthClass = 'max-w-5xl',
  theme = 'glass'
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scrolling while modal is active
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Top Floating Glassmorphism Navigation Bar */}
      <div
        className={`w-full ${maxWidthClass} mx-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-white shrink-0 cursor-default`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent Left Exit / Back Button */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4B6E] to-[#FF6B6B] hover:opacity-95 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-950/40 shrink-0 group active:scale-95"
            title="Exit / Close View (ESC)"
            aria-label="Close"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Close / Exit</span>
            <span className="hidden sm:inline-block text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-normal">
              ESC
            </span>
          </button>

          {(title || subtitle) && (
            <div className="min-w-0 truncate">
              {title && <h3 className="text-sm sm:text-base font-bold text-white truncate">{title}</h3>}
              {subtitle && <p className="text-[11px] text-white/70 truncate hidden sm:block">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Right Action Controls & Circular Close Icon */}
        <div className="flex items-center gap-2 shrink-0">
          {headerActions}

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
            aria-label="Close modal"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Main Content Container */}
      <div
        className={`w-full ${maxWidthClass} mx-auto my-auto py-4 flex items-center justify-center cursor-default`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>

      {/* Bottom Action Footer Bar */}
      <div
        className={`w-full ${maxWidthClass} mx-auto flex items-center justify-between gap-3 p-3 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-white shrink-0 cursor-default`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-white/70 hidden sm:block">
          Press <span className="font-mono text-amber-300 font-bold">ESC</span> or click outside to close
        </p>

        <div className="flex items-center gap-2 ml-auto">
          {footerActions}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-all cursor-pointer border border-white/20"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
