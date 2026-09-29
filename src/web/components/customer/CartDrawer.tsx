import React, { useState } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck,
  CheckCircle2
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    isCartOpen, 
    setIsCartOpen, 
    placeOrder, 
    setActiveTab, 
    t 
  } = useWebApp();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [recipientName, setRecipientName] = useState('Priya Deshmukh');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('14 Indiranagar, 100ft Road, Bengaluru, Karnataka - 560038');
  const [paymentMethod, setPaymentMethod] = useState<'online_test' | 'cod'>('online_test');
  const [orderConfirmedNumber, setOrderConfirmedNumber] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.pricing?.finalListingPrice || item.product.pricing?.suggestedRetailPrice || 2500;
    return acc + price * item.quantity;
  }, 0);

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !address.trim()) return;

    const order = placeOrder({
      recipientName,
      phone,
      address,
      paymentMethod,
    });

    setOrderConfirmedNumber(order.orderNumber);
    setTimeout(() => {
      setOrderConfirmedNumber(null);
      setIsCheckingOut(false);
      setIsCartOpen(false);
      setActiveTab('orders');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#E11D48]" />
            <h2 className="font-extrabold text-base text-gray-900">
              {t('Handcrafted Bag', 'आपकी खरीदारी थैली')} ({cart.length})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        {orderConfirmedNumber ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{t('Order Confirmed!', 'ऑर्डर सफलतापूर्वक दर्ज!')}</h3>
            <p className="text-xs text-gray-500">
              {t('Order Number:', 'ऑर्डर संख्या:')} <strong className="text-gray-900">{orderConfirmedNumber}</strong>
            </p>
            <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl">
              {t('100% direct artisan payout scheduled. Tracking details sent via SMS.', 'कारीगर को भुगतान सुनिश्चित किया गया। ट्रैकिंग विवरण भेजा गया।')}
            </p>
          </div>
        ) : isCheckingOut ? (
          /* Checkout Step inside Drawer */
          <form onSubmit={handleCompleteOrder} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">{t('Shipping & Delivery Address', 'डिलीवरी पता व विवरण')}</h3>
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="text-xs text-[#E11D48] font-semibold cursor-pointer"
              >
                {t('Back to Bag', 'वापस जाएं')}
              </button>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Recipient Full Name', 'प्राप्तकर्ता का नाम')}</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Mobile Phone (10 digits)', 'मोबाइल नंबर')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t('Delivery Address & Pincode', 'पूरा पता व पिनकोड')}</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200"
                required
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-gray-700 font-semibold">{t('Payment Method', 'भुगतान विकल्प')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online_test')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'online_test'
                      ? 'border-[#E11D48] bg-rose-50/50 text-[#BE123C] font-bold'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <p className="font-semibold">{t('UPI / Online', 'यूपीआई / ऑनलाइन')}</p>
                  <span className="text-[10px] text-gray-500">Test Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#E11D48] bg-rose-50/50 text-[#BE123C] font-bold'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <p className="font-semibold">{t('Pay on Delivery', 'कैश ऑन डिलीवरी')}</p>
                  <span className="text-[10px] text-gray-500">COD Available</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>{t('Subtotal', 'उप-योग')}:</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>{t('Subsidized Delivery', 'सब्सिडीयुक्त डिलीवरी')}:</span>
                <span className="font-bold">{t('FREE', 'निःशुल्क')}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#E11D48] text-white font-bold text-xs hover:bg-[#BE123C] shadow-md shadow-rose-200 cursor-pointer"
            >
              {t('Place Order & Pay', 'ऑर्डर पुष्टि करें')} • ₹{subtotal.toLocaleString()}
            </button>
          </form>
        ) : (
          /* Normal Cart List */
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-[#E11D48] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-gray-800">{t('Your Bag is Empty', 'आपकी थैली खाली है')}</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  {t('Discover authentic handloom weaving, blue pottery, and tribal brass sculptures.', 'प्रामाणिक हस्तशिल्प और हथकरघा उत्पाद देखें।')}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer"
                >
                  {t('Explore Crafts', 'शिल्प देखें')}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.product.pricing?.finalListingPrice || item.product.pricing?.suggestedRetailPrice || 2500;

                return (
                  <div
                    key={item.product.id}
                    className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3 items-center justify-between"
                  >
                    <img
                      src={item.product.images[0]?.processedUrl || item.product.images[0]?.originalUrl}
                      alt={item.product.info.titleEn}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-gray-900 truncate">
                        {item.product.info.titleEn}
                      </h4>
                      <p className="text-[10px] text-gray-500 truncate">
                        {item.product.info.craftType} • {item.product.info.originState}
                      </p>
                      <p className="text-xs font-extrabold text-[#E11D48] mt-1">
                        ₹{itemPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white text-xs font-bold">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Drawer Footer with Subtotal & Checkout Trigger */}
        {!isCheckingOut && !orderConfirmedNumber && cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-600">{t('Subtotal', 'कुल राशि')}</span>
              <span className="text-xl font-extrabold text-gray-900">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg">
              <Truck className="w-3.5 h-3.5" />
              <span>{t('Free Subsidized Artisan Courier to your doorstep', 'सीधे आपके पते पर निःशुल्क कूरियर')}</span>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3 rounded-xl bg-[#E11D48] text-white font-bold text-xs hover:bg-[#BE123C] shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('Proceed to Checkout', 'आगे बढ़ें (चेकआउट)')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
