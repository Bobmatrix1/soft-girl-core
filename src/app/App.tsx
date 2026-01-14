import { useEffect, useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import UserOrders from './components/UserOrders';
import NotificationPanel from './components/NotificationPanel';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import PolicyModal from './components/PolicyModal';
import LoadingScreen from './components/LoadingScreen';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Zap, Heart, Star } from 'lucide-react';
import { 
  Product, 
  CartItem, 
  Notification,
  fetchProducts, 
  fetchCategories,
  updateCart, 
  fetchCart, 
  likeProduct,
  createProduct,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteAllNotifications,
  Banner,
  fetchBanners,
  createBanner
} from './utils/api';
import { toast } from 'sonner';
import { auth, db } from './utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const DEMO_PRODUCTS = [
  { name: 'Pink Satin Bow', description: 'Luxurious satin bow perfect for any hairstyle...', shortDescription: 'Elegant satin bow for dreamy hairstyles', price: 5000, slashPrice: 7500, image: 'https://images.unsplash.com/photo-1764072565823-3b731f28ab1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwYm93JTIwYWNjZXNzb3J5fGVufDF8fHx8MTc2NjM0NTk1MHww&ixlib=rb-4.1.0&q=80&w=1080', category: 'Hair Accessories & Tools', featured: true, trending: true, colors: ['#FFB6D9', '#FF69B4', '#FFE4E1'], stockQuantity: 50, status: 'in_stock', sizes: [], sales: 120, likes: 150, rating: 4.8, reviewCount: 60, createdAt: new Date().toISOString() },
  { name: 'Velvet Scrunchie Set', description: 'Set of 5 luxurious velvet scrunchies...', shortDescription: 'Set of 5 soft velvet scrunchies', price: 6500, slashPrice: 9000, image: 'https://images.unsplash.com/photo-1628984081404-5ab8ba13bd8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBzY3J1bmNoaWUlMjBoYWlyfGVufDF8fHx8MTc2NjM0NTk1MXww&ixlib=rb-4.1.0&q=80&w=1080', category: 'Hair Accessories & Tools', flashSale: true, newArrival: true, stockQuantity: 100, status: 'in_stock', sizes: [], sales: 250, likes: 300, rating: 4.9, reviewCount: 120, createdAt: new Date().toISOString() },
  { name: 'Glossy Lip Tint', description: 'Ultra-glossy lip tint with a hint of pink shimmer...', shortDescription: 'Shimmer pink lip gloss', price: 4500, image: 'https://images.unsplash.com/photo-1687195821497-fed0346cdc34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbGlwJTIwZ2xvc3MlMjBtYWtldXB8ZW58MXx8fHwxNzY2MzQ1OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'Lip Care Products', trending: true, stockQuantity: 30, status: 'in_stock', sizes: [], sales: 90, likes: 120, rating: 4.5, reviewCount: 45, createdAt: new Date().toISOString() },
  { name: 'Pearl Hair Clips', description: 'Delicate pearl-adorned hair clips...', shortDescription: 'Set of 3 elegant pearl clips', price: 5500, slashPrice: 8000, image: 'https://images.unsplash.com/photo-1601057836460-67cbb503c1ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1pbmluZSUyMGFjY2Vzc29yaWVzJTIwamV3ZWxyeXxlbnwxfHx8fDE3NjYyNzE2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080', category: 'Hair Accessories & Tools', featured: true, stockQuantity: 15, status: 'in_stock', sizes: [], sales: 150, likes: 200, rating: 4.7, reviewCount: 75, createdAt: new Date().toISOString() },
  { name: 'Butterfly Claw Clip', description: 'Adorable butterfly-shaped claw clip in pastel pink...', shortDescription: 'Cute butterfly claw clip', price: 3500, image: 'https://images.unsplash.com/photo-1655361930131-e390916f167c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwYWVzdGhldGljJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjYzNDU5NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', category: 'Hair Accessories & Tools', newArrival: true, stockQuantity: 40, status: 'in_stock', sizes: [], sales: 80, likes: 100, rating: 4.6, reviewCount: 40, createdAt: new Date().toISOString() },
  { name: 'Handmade Crochet Top', description: 'Beautiful handmade crochet top in pastel colors...', shortDescription: 'Pastel crochet crop top', price: 15000, image: 'https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2xsfGVufDF8fHx8MTc2NjI3MTY1MXww&ixlib=rb-4.1.0&q=80&w=1080', category: 'Crochet Pieces', featured: true, stockQuantity: 5, status: 'restocking', restockDate: '2025-02-15', sizes: ['S', 'M', 'L'], sales: 30, likes: 50, rating: 5.0, reviewCount: 20, createdAt: new Date().toISOString() },
];

const DEMO_BANNERS = [
  {
    title: "Dreamy Collection ✨",
    subtitle: "Elevate your style with our curated soft girl essentials",
    image: "https://images.unsplash.com/photo-1655361930131-e390916f167c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwYWVzdGhldGljJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjYzNDU5NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    order: 0
  },
  {
    title: "New Arrivals 💕",
    subtitle: "Fresh styles that make your heart flutter",
    image: "https://images.unsplash.com/photo-1567523680125-43c5dae7e2fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzY2MzQ1OTUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    order: 1
  },
  {
    title: "Flash Sale 🎀",
    subtitle: "Up to 50% off on selected items - Limited time only!",
    image: "https://images.unsplash.com/photo-1601057836460-67cbb503c1ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1pbmluZSUyMGFjY2Vzc29yaWVzJTIwamV3ZWxyeXxlbnwxfHx8fDE3NjYyNzE2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    order: 2
  },
];

const getReadAnnouncements = (): string[] => {
    const read = localStorage.getItem('readAnnouncements');
    return read ? JSON.parse(read) : [];
};

const addReadAnnouncement = (id: string) => {
    const read = getReadAnnouncements();
    if (!read.includes(id)) {
        localStorage.setItem('readAnnouncements', JSON.stringify([...read, id]));
    }
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | 'refund' | 'shipping' | 'returns' | 'faq' | 'size-guide' | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutCoupon, setCheckoutCoupon] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<any>(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(30);
  const [highlightedProductIds, setHighlightedProductIds] = useState<string[]>([]);
  const isInitializing = useRef(false);
  
  useEffect(() => {
    // Force scroll to top on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Some browsers need a slight delay to override their saved scroll position
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const loadInitialData = async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;
    try {
      // Fetch products and categories first (critical data)
      const [loadedProducts, loadedCategories] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setCategories(loadedCategories);

      // Handle products logic
      if (loadedProducts.length === 0) {
        const secondaryCheck = await fetchProducts();
        if (secondaryCheck.length === 0) {
            for (const demoProduct of DEMO_PRODUCTS) {
              await createProduct(demoProduct as any);
            }
            setProducts(await fetchProducts());
        } else {
            setProducts(secondaryCheck);
        }
      } else {
        setProducts(loadedProducts);
      }

      // Try to fetch banners separately
      try {
        const loadedBanners = await fetchBanners();
        if (loadedBanners.length === 0) {
           // Only try to create demo banners if we can read/write to the collection
           try {
             for (const demoBanner of DEMO_BANNERS) {
                await createBanner(demoBanner);
             }
             setBanners(await fetchBanners());
           } catch(e) {
             console.warn("Could not create demo banners (likely permission error). Using local demo data.");
             setBanners(DEMO_BANNERS.map(b => ({...b, id: `demo-${b.order}`})));
           }
        } else {
           setBanners(loadedBanners);
        }
      } catch (bannerError) {
        console.warn("Failed to fetch banners (likely permission error). Using local demo data.", bannerError);
        setBanners(DEMO_BANNERS.map(b => ({...b, id: `demo-${b.order}`})));
      }

    } catch (error) {
      console.error("Failed to load data", error);
      toast.error("Failed to load store data.");
    } finally {
      setLoading(false);
      isInitializing.current = false;
    }
  };

  const loadNotifications = async (userId: string) => {
    try {
        const userNotifications = await fetchNotifications(userId);
        const readAnnouncements = getReadAnnouncements();
        const processedNotifications = userNotifications.map(n => ({
            ...n,
            isRead: n.userId ? n.isRead : readAnnouncements.includes(n.id)
        }));
        setNotifications(processedNotifications);
    } catch (e) {
        console.error("Failed to load notifications", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          let userData: any = { uid: currentUser.uid, email: currentUser.email, name: currentUser.displayName };
          if (docSnap.exists()) {
            userData = { ...userData, ...docSnap.data() };
          }
          setUser(userData);
          loadNotifications(currentUser.uid);
        } catch (e) {
          console.error("Error fetching user data", e);
        }
      } else {
        setUser(null);
        setCartItems([]);
        setNotifications([]);
      }
    });
    loadInitialData();
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
      if (user && products.length > 0) {
          const loadUserCart = async () => {
              try {
                const cart = await fetchCart(user.uid);
                if (cart.items) {
                    const itemsWithProducts = cart.items.map((item: CartItem) => ({
                        ...item,
                        product: products.find(p => p.id === item.productId),
                    }));
                    setCartItems(itemsWithProducts);
                }
              } catch (e) {
                  console.error("Failed to load cart", e);
              }
          }
          loadUserCart();
      }
  }, [user, products]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, activeFilter, sortBy, displayLimit]);

  const filterProducts = () => {
    let filtered = [...products];
    let highlightedIds: string[] = [];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = products.filter(p => {
        const match = p.name.toLowerCase().includes(lowerCaseQuery) ||
                      p.description.toLowerCase().includes(lowerCaseQuery) ||
                      p.category.toLowerCase().includes(lowerCaseQuery);
        if (match) highlightedIds.push(p.id);
        return match;
      });
      const element = document.getElementById('products-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    
    setHighlightedProductIds(highlightedIds);

    if (activeFilter !== 'all') {
      if (activeFilter === 'featured') filtered = filtered.filter(p => p.featured);
      else if (activeFilter === 'trending') filtered = filtered.filter(p => p.trending);
      else if (activeFilter === 'new') filtered = filtered.filter(p => p.newArrival);
      else if (activeFilter === 'flash_sale') filtered = filtered.filter(p => p.flashSale);
      else filtered = filtered.filter(p => p.category === activeFilter);
    }

    if (sortBy === 'best-sellers') filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    else if (sortBy === 'most-rated') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'most-liked') filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredProducts(filtered);
  };

  const handleSortChange = (sortType: string) => {
    setSortBy(current => current === sortType ? 'default' : sortType);
    setActiveFilter('all');
    setDisplayLimit(30);
    const element = document.getElementById('products-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryClick = (category: string) => {
    setSortBy('default');
    setActiveFilter(category);
    setDisplayLimit(30);
    const element = document.getElementById('products-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveFilter('all');
    setSortBy('default');
    setDisplayLimit(30);
  };

  const handleAllProductsClick = () => {
    setActiveFilter('all');
    setSortBy('default');
    setDisplayLimit(30);
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = async (product: Product, quantity: number = 1, color?: string, size?: string) => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      setIsAuthOpen(true);
      return;
    }
    const existingItemIndex = cartItems.findIndex(item => 
        item.productId === product.id && item.selectedColor === color && item.selectedSize === size
    );
    let newItems;
    if (existingItemIndex > -1) {
      newItems = cartItems.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      newItems = [...cartItems, { productId: product.id, quantity, product, selectedColor: color, selectedSize: size }];
    }
    setCartItems(newItems);
    toast.success('Added to cart');
    try {
      await updateCart(user.uid, { items: newItems.map(({ product, ...item }) => item) });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleBuyNow = async (product: Product, quantity: number = 1, color?: string, size?: string) => {
    await handleAddToCart(product, quantity, color, size);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = async (productId: string, quantity: number, color?: string, size?: string) => {
    const newItems = cartItems.map(item =>
      (item.productId === productId && item.selectedColor === color && item.selectedSize === size) 
        ? { ...item, quantity } 
        : item
    );
    setCartItems(newItems);
    if (user) {
      try {
        await updateCart(user.uid, { items: newItems.map(({ product, ...item }) => item) });
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  };

  const handleRemoveItem = async (productId: string, color?: string, size?: string) => {
    const newItems = cartItems.filter(item => 
      !(item.productId === productId && item.selectedColor === color && item.selectedSize === size)
    );
    setCartItems(newItems);
    if (user) {
      try {
        await updateCart(user.uid, { items: newItems.map(({ product, ...item }) => item) });
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  };

  const handleLike = async (productId: string) => {
    try { await likeProduct(productId); } catch (error) { }
  };

  const handleLogin = (userData: any) => { setIsAuthOpen(false); };

  const handleLogout = async () => {
    try { await signOut(auth); toast.success('Logged out successfully'); } 
    catch (e) { console.error("Logout failed", e); toast.error("Logout failed"); }
  };

  const handleCheckout = (couponCode?: string, discount?: number) => {
    setCheckoutCoupon(couponCode);
    setCheckoutDiscount(discount || 0);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = async () => {
    if (user) {
      try { await updateCart(user.uid, { items: [] }); } 
      catch (error) { console.error("Failed to clear cart in Firestore:", error); }
    }
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const handleReviewProduct = (productId: string) => {
    const productToReview = products.find(p => p.id === productId);
    if (productToReview) {
      setIsOrdersOpen(false);
      setSelectedProduct(productToReview);
    } else {
      toast.error('Product not found.');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    const unreadPersonal = notifications.filter(n => !n.isRead && n.userId);
    if (unreadPersonal.length > 0) { await markAllNotificationsAsRead(user.uid); }
    notifications.forEach(n => { if (!n.userId) addReadAnnouncement(n.id); });
    await loadNotifications(user.uid);
    toast.success("All notifications marked as read.");
  };

  const handleMarkOneAsRead = async (notificationId: string) => {
    if (!user) return;
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.isRead) return;
    if (notification.userId) { await markNotificationAsRead(user.uid, notificationId); } 
    else { addReadAnnouncement(notificationId); }
    await loadNotifications(user.uid);
  };

  const handleDeleteAllNotifications = async () => {
      if (!user) return;
      try {
          await deleteAllNotifications(user.uid);
          await loadNotifications(user.uid);
          toast.success("Your personal notifications have been cleared!");
      } catch (e) { toast.error("Failed to clear notifications."); }
  };

  const handleOrderNotificationClick = () => {
    setIsNotificationPanelOpen(false);
    setIsOrdersOpen(true);
  };

  const handleProductNotificationClick = (productId: string) => {
    const productToShow = products.find(p => p.id === productId);
    if (productToShow) {
      setIsNotificationPanelOpen(false);
      setSelectedProduct(productToShow);
    } else {
      toast.error("Product information not found.");
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div 
      className="min-h-screen bg-background" 
      style={{ fontFamily: 'Poppins, sans-serif' }}
      onClick={() => toast.dismiss()}
    >
      {showLoadingScreen && <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />}
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => user ? handleLogout() : setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onSearchChange={setSearchQuery}
        onCategoryClick={handleCategoryClick}
        onHomeClick={handleHomeClick}
        user={user}
        categories={categories.map(c => c.name)}
        notificationCount={notifications.filter(n => !n.isRead).length}
        onNotificationClick={() => setIsNotificationPanelOpen(prev => !prev)}
        isContactModalOpen={isContactModalOpen}
        setIsContactModalOpen={setIsContactModalOpen}
      />

      <main>
        <Hero onSortChange={handleSortChange} banners={banners} />

        {user && user.isAdmin && (
          <div className="max-w-7xl mx-auto px-4 mb-4">
            <Button variant="outline" onClick={() => setIsAdminOpen(true)} className="border-pink-200 hover:bg-pink-50">
              🔧 Admin Dashboard
            </Button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-3">
                        <Button
                          variant={activeFilter === 'all' && sortBy === 'default' ? 'default' : 'outline'}
                          onClick={handleAllProductsClick}
                          className={`border-pink-200 ${activeFilter !== 'all' || sortBy !== 'default' ? 'hover:bg-pink-50 hover:text-primary' : ''}`}
                        >
                          All Products
                        </Button>
            <Button variant={activeFilter === 'featured' ? 'default' : 'outline'} onClick={() => handleCategoryClick('featured')} className={`border-pink-200 ${activeFilter !== 'featured' ? 'hover:bg-pink-50 hover:text-primary' : ''}`}>
              <Sparkles className="w-4 h-4 mr-2" /> Featured
            </Button>
            <Button variant={activeFilter === 'trending' ? 'default' : 'outline'} onClick={() => handleCategoryClick('trending')} className={`border-pink-200 ${activeFilter !== 'trending' ? 'hover:bg-pink-50 hover:text-primary' : ''}`}>
              <TrendingUp className="w-4 h-4 mr-2" /> Trending
            </Button>
            <Button variant={activeFilter === 'new' ? 'default' : 'outline'} onClick={() => handleCategoryClick('new')} className={`border-pink-200 ${activeFilter !== 'new' ? 'hover:bg-pink-50 hover:text-primary' : ''}`}>
              <Zap className="w-4 h-4 mr-2" /> New Arrivals
            </Button>
            <Button variant={activeFilter === 'flash_sale' ? 'default' : 'outline'} onClick={() => handleCategoryClick('flash_sale')} className={`border-pink-200 ${activeFilter !== 'flash_sale' ? 'hover:bg-pink-50 hover:text-primary' : ''}`}>
              <Zap className="w-4 h-4 mr-2 text-yellow-500" /> Flash Sale
            </Button>
            <Button variant={sortBy === 'most-rated' ? 'default' : 'outline'} onClick={() => handleSortChange('most-rated')} className={`border-pink-200 ${sortBy !== 'most-rated' ? 'hover:bg-pink-50 hover:text-primary' : ''}`}>
              <Star className="w-4 h-4 mr-2 text-yellow-500" /> Most Rated
            </Button>
            <Button variant={sortBy === 'most-liked' ? 'default' : 'outline'} onClick={() => handleSortChange('most-liked')} className={`border-pink-200 ${sortBy !== 'most-liked' ? 'hover:bg-pink-50 hover:text-primary' : ''}`}>
              <Heart className="w-4 h-4 mr-2 text-red-500" /> Most Liked
            </Button>
          </div>
        </div>

        <div id="products-section" className="max-w-7xl mx-auto px-4 pb-16 scroll-mt-24">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.slice(0, displayLimit).map((product, index) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (index % 30) * 0.03, duration: 0.2 }}>
                    <ProductCard product={product} onAddToCart={(p, q, c, s) => handleAddToCart(p, q, c, s)} onBuyNow={(p) => handleBuyNow(p)} onLike={handleLike} onClick={setSelectedProduct} isHighlighted={highlightedProductIds.includes(product.id)} />
                  </motion.div>
                ))}
              </motion.div>
              {filteredProducts.length > displayLimit && (
                <div className="mt-12 text-center">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-pink-200 hover:bg-pink-50 hover:text-primary min-w-[200px] transition-all"
                    onClick={() => setDisplayLimit(prev => prev + 30)}
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer 
        onCategoryClick={handleCategoryClick} 
        onSortChange={handleSortChange} 
        onContactClick={() => setIsContactModalOpen(true)}
        onPolicyClick={(type) => setPolicyType(type)}
      />

      {selectedProduct && (
        <ProductDetail product={selectedProduct} allProducts={products} onClose={() => setSelectedProduct(null)} onAddToCart={(p, q, c, s) => handleAddToCart(p, q, c, s)} onBuyNow={(p, q, c, s) => handleBuyNow(p, q, c, s)} onProductSelect={setSelectedProduct} user={user} />
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onCheckout={handleCheckout} user={user} />

      <Auth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />

      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} onDataChange={() => { loadInitialData(); if(user) loadNotifications(user.uid); }} />
      )}

      {isOrdersOpen && user && (
        <UserOrders userId={user.uid || user.id} onClose={() => setIsOrdersOpen(false)} onReviewProduct={handleReviewProduct} />
      )}

      {isNotificationPanelOpen && (
        <NotificationPanel 
            notifications={notifications}
            onClose={() => setIsNotificationPanelOpen(false)}
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkOneAsRead={(notif) => handleMarkOneAsRead(notif)}
            onDeleteAll={handleDeleteAllNotifications}
            onOrderNotificationClick={handleOrderNotificationClick}
            onProductNotificationClick={handleProductNotificationClick}
        />
      )}

      <PolicyModal 
        isOpen={!!policyType} 
        onClose={() => setPolicyType(null)} 
        type={policyType} 
      />

      <Checkout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} items={cartItems} user={user} total={subtotal - checkoutDiscount} discount={checkoutDiscount} couponCode={checkoutCoupon} onSuccess={handleCheckoutSuccess} />

      <Toaster position="top-right" richColors />
    </div>
  );
}
