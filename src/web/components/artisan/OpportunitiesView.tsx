import React, { useState } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { Opportunity } from '../../../models/opportunity';
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  Calendar, 
  Send, 
  CheckCircle, 
  DollarSign, 
  X,
  FileCheck
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const { opportunities, quotes, submitQuote, currentUser, t } = useWebApp();

  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [quotedUnitPrice, setQuotedUnitPrice] = useState<number>(1500);
  const [estimatedDays, setEstimatedDays] = useState<number>(20);
  const [quoteNotes, setQuoteNotes] = useState<string>('');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const handleOpenQuoteModal = (opp: Opportunity) => {
    setSelectedOpp(opp);
    const approxUnit = opp.budget ? Math.round(opp.budget / opp.quantity) : 1500;
    setQuotedUnitPrice(approxUnit);
    setEstimatedDays(25);
    setQuoteNotes(
      `Master artisan with 15+ years experience. Authentic materials with GI provenance certificate. Ready to deliver ${opp.quantity} units.`
    );
    setSubmittedSuccess(false);
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;

    submitQuote(selectedOpp.id, quotedUnitPrice, estimatedDays, quoteNotes);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSelectedOpp(null);
      setSubmittedSuccess(false);
    }, 1500);
  };

  // Find quotes submitted strictly by active artisan (zero cross-artisan data leak)
  const myQuotes = quotes.filter(q => q.artisanId === currentUser?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-gray-900">
              {t('B2B Sourcing Opportunities & RFQs', 'थोक व्यापार मांग व प्रस्ताव (RFQs)')}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('Verified corporate buyers, boutique hotels, and export houses seeking authentic handmade crafts directly from artisans.', 'होटल, कॉरपोरेट उपहार और बड़े शोरूम से सीधी थोक मांग।')}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-[#2563EB] px-3 py-1.5 rounded-xl text-xs font-semibold">
          <span>{myQuotes.length} {t('Quotes Submitted', 'प्रस्ताव भेजे गए')}</span>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map((opp) => {
          const hasQuoted = quotes.some(q => q.opportunityId === opp.id && (q.artisanId === currentUser?.id || q.artisanId === 'demo-artisan-1'));

          return (
            <div
              key={opp.id}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                    {opp.craftType}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {opp.title}
                </h3>
                <p className="text-xs font-semibold text-gray-500">
                  {opp.businessName}
                </p>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {opp.description}
                </p>

                {/* Specs Pill Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-[10px] text-gray-400 block">{t('Quantity Required', 'मांग मात्रा')}</span>
                    <span className="font-bold text-gray-900">{opp.quantity} {t('units', 'पीस')}</span>
                  </div>

                  <div className="p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-[10px] text-gray-400 block">{t('Target Budget', 'बजट')}</span>
                    <span className="font-bold text-[#2563EB]">
                      {opp.budget ? `₹${opp.budget.toLocaleString()}` : 'Negotiable'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-gray-50 rounded-xl sm:col-span-1 col-span-2">
                    <span className="text-[10px] text-gray-400 block">{t('Timeline', 'समय सीमा')}</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {opp.deadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {opp.location || 'India'}
                </span>

                {hasQuoted ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold">
                    <FileCheck className="w-4 h-4" />
                    <span>{t('Proposal Submitted', 'प्रस्ताव भेजा जा चुका है')}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenQuoteModal(opp)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('Submit Price Quote', 'मूल्य प्रस्ताव भेजें')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quote Submission Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => setSelectedOpp(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t('Quote Submitted Successfully!', 'प्रस्ताव सफलतापूर्वक भेजा गया!')}</h3>
                <p className="text-xs text-gray-500">
                  {t('The business buyer will review your quote and contact you directly through KalaSetu.', 'खरीदार आपके प्रस्ताव की समीक्षा करके संपर्क करेंगे।')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                    {selectedOpp.craftType}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-2">
                    {selectedOpp.title}
                  </h3>
                  <p className="text-xs text-gray-500">{selectedOpp.businessName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t('Your Quoted Unit Price (₹)', 'प्रति इकाई भाव (₹)')}
                    </label>
                    <input
                      type="number"
                      min={100}
                      value={quotedUnitPrice}
                      onChange={(e) => setQuotedUnitPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t('Estimated Delivery Days', 'अनुमानित दिन')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB]"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-gray-600">{t('Total Contract Value', 'कुल अनुबंध मूल्य')}:</span>
                  <span className="font-extrabold text-[#2563EB] text-base">
                    ₹{(quotedUnitPrice * selectedOpp.quantity).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t('Artisan Experience & Craft Details', 'कारीगर अनुभव व सामग्री विवरण')}
                  </label>
                  <textarea
                    rows={3}
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB]"
                    placeholder="Mention materials, handloom/kiln technique, quality certifications..."
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                  >
                    {t('Cancel', 'रद्द करें')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 shadow-md transition-colors cursor-pointer"
                  >
                    {t('Send Quote to Buyer', 'प्रस्ताव भेजें')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
