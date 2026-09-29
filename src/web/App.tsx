import React from 'react';
import { WebAppProvider, useWebApp } from './context/WebAppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FlipkartSidebarDrawer } from './components/FlipkartSidebarDrawer';
import { ArtisanDashboard } from './components/artisan/ArtisanDashboard';
import { SmartCatalogWizard } from './components/artisan/SmartCatalogWizard';
import { ArtisanCatalog } from './components/artisan/ArtisanCatalog';
import { OpportunitiesView } from './components/artisan/OpportunitiesView';
import { ExhibitionQrModal } from './components/artisan/ExhibitionQrModal';
import { OndcReadinessView } from './components/artisan/OndcReadinessView';
import { ArtisanTemplatesView } from './components/artisan/ArtisanTemplatesView';
import { CraftClusterMapsView } from './components/artisan/CraftClusterMapsView';
import { BusinessDashboard } from './components/business/BusinessDashboard';
import { CustomerMarketplace } from './components/customer/CustomerMarketplace';
import { KalaChannelView } from './components/customer/KalaChannelView';
import { CartDrawer } from './components/customer/CartDrawer';
import { OrdersView } from './components/customer/OrdersView';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { VoiceTranscriberModal } from './components/common/VoiceTranscriberModal';
import { Mic } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    currentRole, 
    activeTab, 
    showLandingPage, 
    setShowLandingPage, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    isVoiceModalOpen,
    setIsVoiceModalOpen,
    t 
  } = useWebApp();

  if (showLandingPage) {
    return (
      <LandingPage
        onEnterApp={() => {
          setShowLandingPage(false);
          sessionStorage.setItem('kalasetu_entered', 'true');
        }}
      />
    );
  }

  const renderContent = () => {
    if (currentRole === 'artisan') {
      switch (activeTab) {
        case 'home':
          return <ArtisanDashboard />;
        case 'image_studio':
        case 'wizard':
          // Unified Smart Catalog with embedded AI Studio
          return <SmartCatalogWizard />;
        case 'catalogue':
          return <ArtisanCatalog />;
        case 'kalachannel':
          return <KalaChannelView />;
        case 'opportunities':
          return <OpportunitiesView />;
        case 'qr':
          return <ExhibitionQrModal />;
        case 'ondc':
          return <OndcReadinessView />;
        case 'templates':
          return <ArtisanTemplatesView />;
        case 'maps':
          return <CraftClusterMapsView />;
        default:
          return <ArtisanDashboard />;
      }
    }

    if (currentRole === 'business') {
      switch (activeTab) {
        case 'discover':
        case 'home':
        case 'requirements':
        case 'proposals':
        case 'opportunities':
          return <BusinessDashboard />;
        case 'maps':
          return <CraftClusterMapsView />;
        case 'kalachannel':
          return <KalaChannelView />;
        default:
          return <BusinessDashboard />;
      }
    }

    if (currentRole === 'customer') {
      switch (activeTab) {
        case 'marketplace':
        case 'home':
          return <CustomerMarketplace />;
        case 'kalachannel':
          return <KalaChannelView />;
        case 'orders':
          return <OrdersView />;
        case 'maps':
          return <CraftClusterMapsView />;
        default:
          return <CustomerMarketplace />;
      }
    }

    return <CustomerMarketplace />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      <Navbar />

      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Global Modals & Root-level Drawers */}
      <FlipkartSidebarDrawer 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <ProductDetailModal />
      <CartDrawer />
      <AuthModal />
      <SettingsModal />

      {/* Modern Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200 py-10 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#BE123C] text-white flex items-center justify-center font-bold text-base shadow-xs">
                🌸
              </div>
              <div>
                <p className="font-extrabold text-sm text-gray-900">
                  Kala<span className="text-[#E11D48]">Setu</span> (कलासेतु)
                </p>
                <p className="text-[11px] text-gray-500">
                  {t('Bridge from Maker to Marketplace', 'कारीगर से बाज़ार तक का सीधा सेतु')}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
            <p>
              KalaSetu — Empowering Traditional Indian Artisans.
            </p>
            <p>
              100% Direct Fair Wage Guarantee • ONDC Schema Standard
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <WebAppProvider>
      <AppContent />
    </WebAppProvider>
  );
};
