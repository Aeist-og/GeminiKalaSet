import React from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, setActiveTab, t } = useWebApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#E11D48]" />
            <span>{t('My Handcrafted Orders', 'मेरे ऑर्डर')}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {t('Track handcrafted items dispatched directly from master artisan clusters.', 'कारीगर क्लस्टरों से सीधे भेजे जा रहे उत्पादों की स्थिति।')}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('marketplace')}
          className="text-xs font-bold text-[#E11D48] hover:text-[#BE123C] cursor-pointer"
        >
          {t('Browse More Crafts', 'और शिल्प देखें')} →
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-3">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-base text-gray-800">{t('No Orders Placed Yet', 'अभी तक कोई ऑर्डर नहीं')}</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {t('Support Indian weavers and artisans by purchasing certified handmade creations.', 'भारतीय हथकरघा व हस्तशिल्प खरीदकर कारीगरों का संबल बनें।')}
          </p>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="px-5 py-2 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer"
          >
            {t('Shop Marketplace', 'बाज़ार देखें')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                <div>
                  <span className="text-gray-500">{t('Order Reference:', 'ऑर्डर संख्या:')}</span>
                  <span className="font-bold text-gray-900 ml-1.5">{order.orderNumber}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 capitalize text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{order.status}</span>
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items.map((item, idx) => {
                  const price = item.product.pricing?.finalListingPrice || item.product.pricing?.suggestedRetailPrice || 2500;

                  return (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]?.processedUrl || item.product.images[0]?.originalUrl}
                          alt={item.product.info.titleEn}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 line-clamp-1">{item.product.info.titleEn}</h4>
                          <p className="text-[10px] text-gray-500">
                            {item.product.info.craftType} • {item.product.info.originState}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-gray-500">{item.quantity} x </span>
                        <span className="font-extrabold text-gray-900">₹{price.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Footer */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-gray-50/70 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-gray-600 truncate max-w-sm">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{order.address}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">{t('Total Amount', 'कुल भुगतान')}</span>
                  <span className="text-base font-extrabold text-[#E11D48]">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
