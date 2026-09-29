import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../models/auth';
import { Product, ProductStatus } from '../../models/product';
import { KalaPost, KalaComment } from '../../models/kalachannel';
import { Opportunity } from '../../models/opportunity';
import { DemoAccount } from '../../services/auth/authService';
import { DEMO_USERS, INITIAL_PRODUCTS, INITIAL_KALA_POSTS, INITIAL_OPPORTUNITIES, KalaNotification, INITIAL_NOTIFICATIONS } from '../data/seedData';
import { translateText } from '../data/translations';

export type AppLanguage = 'en' | 'hi' | 'gu' | 'ta' | 'te' | 'mr' | 'bn' | 'kn' | 'ml' | 'pa' | 'or';

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
];

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  recipientName: string;
  phone: string;
  address: string;
  paymentMethod: 'cod' | 'online_test';
  status: 'confirmed' | 'dispatched' | 'delivered';
  createdAt: string;
}

export interface OpportunityQuote {
  id: string;
  opportunityId: string;
  artisanId: string;
  artisanName: string;
  quotedUnitPrice: number;
  totalQuotedPrice: number;
  estimatedDays: number;
  notes: string;
  status: 'submitted' | 'accepted' | 'under_review';
  createdAt: string;
}

interface WebAppContextType {
  // Auth
  currentUser: UserProfile | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  loginAsDemoUser: (demo: DemoAccount) => void;
  loginCustom: (fullName: string, email: string, role: UserRole, extra?: Partial<UserProfile>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  deleteAccount: () => void;
  logout: () => void;

  // Language
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (enText: string, hiText?: string, multiLang?: Partial<Record<AppLanguage, string>>) => string;

  // View Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;

  // Catalogue Template Studio
  selectedCatalogueTemplate: string;
  setSelectedCatalogueTemplate: (template: string) => void;

  // Realtime Notifications
  notifications: KalaNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<KalaNotification, 'id' | 'createdAt'>) => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  changeProductStatus: (id: string, status: ProductStatus) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders
  orders: OrderRecord[];
  placeOrder: (details: { recipientName: string; phone: string; address: string; paymentMethod: 'cod' | 'online_test' }) => OrderRecord;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // KalaChannel
  posts: KalaPost[];
  toggleLikePost: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  createPost: (post: Omit<KalaPost, 'id' | 'likesCount' | 'isLikedByMe' | 'commentsCount' | 'createdAt'>) => void;

  // Opportunities (B2B)
  opportunities: Opportunity[];
  quotes: OpportunityQuote[];
  postOpportunity: (opp: Omit<Opportunity, 'id' | 'responsesCount' | 'createdAt' | 'updatedAt'>) => void;
  submitQuote: (opportunityId: string, quotedUnitPrice: number, estimatedDays: number, notes: string) => void;
}

const WebAppContext = createContext<WebAppContextType | null>(null);

export const WebAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load real user from localStorage or device profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kalasetu_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.fullName && parsed.id) {
          return parsed;
        }
      } catch {}
    }
    // Check if a real registered profile exists on this device
    const savedReal = localStorage.getItem('kalasetu_real_profile');
    if (savedReal) {
      try {
        const parsedReal = JSON.parse(savedReal);
        if (parsedReal && parsedReal.fullName) return parsedReal;
      } catch {}
    }
    // For first-time visitors who haven't registered, provide initial starter profile
    const defaultDemo = DEMO_USERS[0];
    return {
      id: defaultDemo.id,
      fullName: defaultDemo.name,
      phone: '+91 98765 43210',
      role: defaultDemo.role,
      languagePreference: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => currentUser?.role || 'artisan');
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kalasetu_language') as AppLanguage;
      if (saved && ['en', 'hi', 'gu', 'ta', 'te', 'mr', 'bn', 'kn', 'ml', 'pa', 'or'].includes(saved)) {
        return saved;
      }
    }
    return currentUser?.languagePreference || 'en';
  });

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(() => {
    // If no real account or entered session, show landing page
    return !sessionStorage.getItem('kalasetu_entered');
  });

  // Catalogue Template Studio
  const [selectedCatalogueTemplate, setSelectedCatalogueTemplateState] = useState<string>(() => {
    return localStorage.getItem('kalasetu_template') || 'heritage';
  });

  const setSelectedCatalogueTemplate = (template: string) => {
    setSelectedCatalogueTemplateState(template);
    localStorage.setItem('kalasetu_template', template);
  };

  // Realtime Notifications
  const [notifications, setNotifications] = useState<KalaNotification[]>(() => {
    const saved = localStorage.getItem('kalasetu_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  const unreadNotificationCount = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  ).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser?.id ? { ...n, read: true } : n))
    );
  };

  const addNotification = (notif: Omit<KalaNotification, 'id' | 'createdAt'>) => {
    const newNotif: KalaNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Products: Preserve any custom artisan created products across reloads, while keeping INITIAL_PRODUCTS for demo
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kalasetu_products');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: any) => p.id));
          const missing = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
          return [...missing, ...parsed];
        }
      } catch {}
    }
    return INITIAL_PRODUCTS;
  });

  // Cart (Strictly partitioned per user ID to guarantee zero data bleed between accounts)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const activeUserId = currentUser?.id || 'guest';
    const saved = localStorage.getItem(`kalasetu_cart_${activeUserId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Re-sync cart on user change
  useEffect(() => {
    const activeUserId = currentUser?.id || 'guest';
    const saved = localStorage.getItem(`kalasetu_cart_${activeUserId}`);
    if (saved) {
      try {
        setCart(JSON.parse(saved));
        return;
      } catch {}
    }
    // Demo buyer/patron default initial sample cart if demo, otherwise empty for new users
    if (currentUser?.id === 'patron-1' || currentUser?.id === 'demo-customer-1') {
      setCart([{ product: INITIAL_PRODUCTS[0], quantity: 1 }]);
    } else {
      setCart([]);
    }
  }, [currentUser?.id]);

  // Sync cart to partitioned local storage
  useEffect(() => {
    const activeUserId = currentUser?.id || 'guest';
    localStorage.setItem(`kalasetu_cart_${activeUserId}`, JSON.stringify(cart));
  }, [cart, currentUser?.id]);

  // Orders (Isolated per artisan - Hetvi starts with 0 orders until customers purchase her crafts)
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const saved = localStorage.getItem('kalasetu_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'ord-ramesh-1',
        orderNumber: 'KS-89241',
        items: [
          {
            product: INITIAL_PRODUCTS[0], // Kutch Kala Cotton Shawl (Ramesh Vankar)
            quantity: 1,
          }
        ],
        subtotal: 3450,
        deliveryFee: 0,
        totalAmount: 3450,
        recipientName: 'Vikramaditya Singh',
        phone: '9876543210',
        address: 'Heritage Haveli Resort, Lake Pichola, Udaipur, Rajasthan - 313001',
        paymentMethod: 'online_test',
        status: 'dispatched',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('kalasetu_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return ['prod-1', 'prod-2'];
  });

  // KalaChannel Posts
  const [posts, setPosts] = useState<KalaPost[]>(() => {
    const saved = localStorage.getItem('kalasetu_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_KALA_POSTS;
  });

  // B2B Opportunities & Quotes
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('kalasetu_opportunities');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_OPPORTUNITIES;
  });

  const [quotes, setQuotes] = useState<OpportunityQuote[]>(() => {
    const saved = localStorage.getItem('kalasetu_quotes');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'quote-1',
        opportunityId: 'opp-1',
        artisanId: 'demo-artisan-2',
        artisanName: 'Meera Devi',
        quotedUnitPrice: 1650,
        totalQuotedPrice: 82500,
        estimatedDays: 25,
        notes: 'Can deliver 50 hand-painted Jaipur Blue Pottery vases with authentic GI certification and bubble export crates.',
        status: 'under_review',
        createdAt: '2026-02-16T10:00:00Z',
      }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('kalasetu_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kalasetu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kalasetu_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kalasetu_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('kalasetu_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('kalasetu_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('kalasetu_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('kalasetu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kalasetu_template', selectedCatalogueTemplate);
  }, [selectedCatalogueTemplate]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem('kalasetu_user', JSON.stringify(updated));
    }
    // Set appropriate initial tab
    if (role === 'artisan') setActiveTab('home');
    else if (role === 'business') setActiveTab('discover');
    else setActiveTab('marketplace');
  };

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalasetu_language', lang);
    }
    if (currentUser) {
      const updated = { ...currentUser, languagePreference: lang };
      setCurrentUser(updated);
      localStorage.setItem('kalasetu_user', JSON.stringify(updated));
    }
  };

  const t = (enText: string, hiText?: string, multiLang?: Partial<Record<AppLanguage, string>>): string => {
    return translateText(enText, language, hiText, multiLang);
  };

  const loginAsDemoUser = (demo: DemoAccount) => {
    const user: UserProfile = {
      id: demo.id,
      fullName: demo.name,
      phone: '+91 98765 00000',
      role: demo.role,
      languagePreference: language,
      email: demo.email,
      location: demo.location,
      craftSpecialization: demo.role === 'artisan' ? demo.craftOrDomain : undefined,
      businessName: demo.role === 'business' ? demo.craftOrDomain : undefined,
      curiosityInterests: demo.role === 'customer' ? ['Double Ikat Patola', 'Kutch Weaving', 'Jaipur Blue Pottery'] : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    setCurrentRole(demo.role);
    localStorage.setItem('kalasetu_user', JSON.stringify(user));
    setActiveModal(null);
  };

  const loginCustom = (fullName: string, email: string, role: UserRole, extra?: Partial<UserProfile>) => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanEnteredName = fullName.trim() || (email.includes('@') ? email.split('@')[0] : 'User');

    // Real entities: Generate stable, strictly partitioned ID for this user account
    const userId = 'user-' + (normalizedEmail ? normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_') : Date.now());

    const user: UserProfile = {
      id: userId,
      fullName: cleanEnteredName, // STRICTLY PRESERVE USER'S ENTERED NAME (e.g. abc)
      phone: extra?.phone || '+91 98765 11111',
      role,
      languagePreference: language,
      email: normalizedEmail || 'user@kalasetu.in',
      location: extra?.location || (role === 'artisan' ? 'Patan, Gujarat' : role === 'business' ? 'Mumbai, India' : 'Delhi, India'),
      state: extra?.state || (role === 'artisan' ? 'Gujarat' : 'Maharashtra'),
      district: extra?.district || (role === 'artisan' ? 'Patan' : 'Mumbai'),
      craftSpecialization: extra?.craftSpecialization || (role === 'artisan' ? 'Traditional Handcraft' : undefined),
      businessName: extra?.businessName || (role === 'business' ? `${cleanEnteredName} Enterprise` : undefined),
      curiosityInterests: extra?.curiosityInterests || (role === 'customer' ? ['Handloom Weaves', 'Tribal Bell Metal', 'Terracotta'] : undefined),
      avatarUrl: extra?.avatarUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setCurrentRole(role);
    setActiveTab('home'); // Reset to main home page on login
    localStorage.setItem('kalasetu_user', JSON.stringify(user));
    localStorage.setItem('kalasetu_real_profile', JSON.stringify(user));
    localStorage.setItem('kalasetu_has_real_account', 'true');
    setActiveModal(null);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated: UserProfile = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('kalasetu_user', JSON.stringify(updated));
      localStorage.setItem('kalasetu_real_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteAccount = () => {
    localStorage.removeItem('kalasetu_user');
    localStorage.removeItem('kalasetu_real_profile');
    localStorage.removeItem('kalasetu_has_real_account');
    sessionStorage.removeItem('kalasetu_entered');
    setCurrentUser(null);
    setCurrentRole('customer');
    setActiveModal(null);
    setShowLandingPage(true);
  };

  const logout = () => {
    // Preserve real account history on device so mock quick login is NOT shown
    // but clear active session user
    localStorage.removeItem('kalasetu_user');
    sessionStorage.removeItem('kalasetu_entered');
    setCurrentUser(null);
    setActiveModal(null);
    setShowLandingPage(true);
  };

  // Product Operations
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);

    // Automatically generate publication notification
    addNotification({
      userId: product.artisanId,
      role: 'artisan',
      titleEn: `Product Published: ${product.info.titleEn}`,
      titleHi: `उत्पाद प्रकाशित: ${product.info.titleHi}`,
      messageEn: `Your craft has been listed with ${product.catalogueTemplate || selectedCatalogueTemplate} template. Live for B2B buyers and retail patrons.`,
      messageHi: `आपका शिल्प उत्पाद ${product.catalogueTemplate || selectedCatalogueTemplate} टेम्पलेट के साथ लाइव हो चुका है।`,
      type: 'order',
      read: false,
      actionTab: 'catalogue',
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const changeProductStatus = (id: string, status: ProductStatus) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p));
  };

  // Cart Operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place Order
  const placeOrder = (details: { recipientName: string; phone: string; address: string; paymentMethod: 'cod' | 'online_test' }) => {
    const subtotal = cart.reduce((acc, item) => acc + ((item.product.pricing?.finalListingPrice || 1000) * item.quantity), 0);
    const deliveryFee = 0; // Subsidized artisan free shipping
    const totalAmount = subtotal + deliveryFee;

    const newOrder: OrderRecord = {
      id: 'ord-' + Date.now(),
      orderNumber: `KS-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [...cart],
      subtotal,
      deliveryFee,
      totalAmount,
      recipientName: details.recipientName,
      phone: details.phone,
      address: details.address,
      paymentMethod: details.paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);

    // Dispatch realtime notifications to each affected artisan
    const artisanGroups = new Map<string, typeof cart>();
    cart.forEach(item => {
      const artId = item.product.artisanId;
      if (!artisanGroups.has(artId)) {
        artisanGroups.set(artId, []);
      }
      artisanGroups.get(artId)!.push(item);
    });

    artisanGroups.forEach((items, artId) => {
      const artTotal = items.reduce((sum, it) => sum + ((it.product.pricing?.finalListingPrice || 1000) * it.quantity), 0);
      const itemsSummary = items.map(it => `${it.quantity}x ${it.product.info.titleEn}`).join(', ');
      addNotification({
        userId: artId,
        role: 'artisan',
        titleEn: `New Order Received: ${newOrder.orderNumber} 🎉`,
        titleHi: `नया ऑर्डर प्राप्त हुआ: ${newOrder.orderNumber} 🎉`,
        messageEn: `Order placed for ₹${artTotal.toLocaleString()} (${itemsSummary}). Ship to ${details.recipientName}, ${details.address}.`,
        messageHi: `₹${artTotal.toLocaleString()} का नया ऑर्डर मिला। प्राप्तकर्ता: ${details.recipientName}।`,
        type: 'order',
        read: false,
        actionTab: 'analytics',
      });
    });

    // Notify customer
    if (currentUser) {
      addNotification({
        userId: currentUser.id,
        role: 'customer',
        titleEn: `Order Confirmed: ${newOrder.orderNumber} ✨`,
        titleHi: `ऑर्डर बुक हो गया: ${newOrder.orderNumber} ✨`,
        messageEn: `Your order for ₹${totalAmount.toLocaleString()} is confirmed directly with the artisan. Free shipping enabled.`,
        messageHi: `आपका ₹${totalAmount.toLocaleString()} का ऑर्डर सीधे कारीगर के पास दर्ज हो चुका है।`,
        type: 'order',
        read: false,
        actionTab: 'orders',
      });
    }

    clearCart();
    setIsCartOpen(false);
    return newOrder;
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  // KalaChannel Operations
  const toggleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.isLikedByMe;
        return {
          ...p,
          isLikedByMe: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    }));
  };

  const addPostComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
        };
      }
      return p;
    }));
  };

  const createPost = (postData: Omit<KalaPost, 'id' | 'likesCount' | 'isLikedByMe' | 'commentsCount' | 'createdAt'>) => {
    const newPost: KalaPost = {
      ...postData,
      id: 'post-' + Date.now(),
      likesCount: 0,
      isLikedByMe: false,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
  };

  // Opportunities
  const postOpportunity = (oppData: Omit<Opportunity, 'id' | 'responsesCount' | 'createdAt' | 'updatedAt'>) => {
    const newOpp: Opportunity = {
      ...oppData,
      id: 'opp-' + Date.now(),
      responsesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const submitQuote = (opportunityId: string, quotedUnitPrice: number, estimatedDays: number, notes: string) => {
    const opp = opportunities.find(o => o.id === opportunityId);
    const quantity = opp ? opp.quantity : 10;
    const newQuote: OpportunityQuote = {
      id: 'quote-' + Date.now(),
      opportunityId,
      artisanId: currentUser?.id || 'artisan',
      artisanName: currentUser?.fullName || 'Master Artisan',
      quotedUnitPrice,
      totalQuotedPrice: quotedUnitPrice * quantity,
      estimatedDays,
      notes,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    setQuotes(prev => [newQuote, ...prev]);
    setOpportunities(prev => prev.map(o => o.id === opportunityId ? { ...o, responsesCount: (o.responsesCount || 0) + 1 } : o));

    addNotification({
      userId: currentUser?.id || 'artisan',
      role: 'artisan',
      titleEn: `B2B Proposal Sent: ${opp?.title || 'Custom RFQ'}`,
      titleHi: `थोक प्रस्ताव भेजा गया: ${opp?.title || 'कस्टम मांग'}`,
      messageEn: `Your quotation of ₹${quotedUnitPrice.toLocaleString()}/unit (Total ₹${(quotedUnitPrice * quantity).toLocaleString()}) has been transmitted to ${opp?.buyerOrganization || 'the corporate buyer'}.`,
      messageHi: `आपका ₹${quotedUnitPrice.toLocaleString()}/इकाई का प्रस्ताव खरीदार को भेज दिया गया है।`,
      type: 'quote',
      read: false,
      actionTab: 'opportunities',
    });
  };

  return (
    <WebAppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        loginAsDemoUser,
        loginCustom,
        updateUserProfile,
        deleteAccount,
        logout,
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        activeModal,
        setActiveModal,
        selectedProduct,
        setSelectedProduct,
        isSidebarOpen,
        setIsSidebarOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        showLandingPage,
        setShowLandingPage,
        selectedCatalogueTemplate,
        setSelectedCatalogueTemplate,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        changeProductStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        orders,
        placeOrder,
        wishlist,
        toggleWishlist,
        posts,
        toggleLikePost,
        addPostComment,
        createPost,
        opportunities,
        quotes,
        postOpportunity,
        submitQuote,
      }}
    >
      {children}
    </WebAppContext.Provider>
  );
};

export const useWebApp = () => {
  const context = useContext(WebAppContext);
  if (!context) throw new Error('useWebApp must be used within WebAppProvider');
  return context;
};
