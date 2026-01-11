import { useState } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, Sparkles, Instagram, Facebook, LogOut, LogIn, ChevronRight, ShoppingBag, Bell, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
  onOpenOrders: () => void;
  onSearchChange: (query: string) => void;
  onCategoryClick: (category: string) => void;
  onHomeClick: () => void;
  user: any;
  categories: string[];
  notificationCount: number;
  onNotificationClick: () => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
}

export default function Navbar({ 
  cartCount, 
  onCartClick, 
  onAuthClick, 
  onOpenOrders, 
  onSearchChange, 
  onCategoryClick, 
  onHomeClick,
  user,
  categories = [],
  notificationCount,
  onNotificationClick,
  isContactModalOpen,
  setIsContactModalOpen
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  const adminContact = {
      email: 'adenikeakande2001@gmail.com',
      phone: '08130499441',
      whatsapp: 'message/TW5ETDFZLOZ4O1'
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    onCategoryClick(category);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);

    // Defer scroll to allow App component to re-render first
    setTimeout(() => {
      const element = document.getElementById('products-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-pink-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-1 sm:space-x-2 cursor-pointer pr-2 md:pr-10"
              onClick={() => handleCategoryClick('all')}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                Soft Girl Core
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={onHomeClick} className="text-foreground hover:text-primary transition-colors font-medium">Home</button>              
              {/* Desktop Categories Dropdown */}
              <div className="relative group">
                <button className="text-foreground hover:text-primary transition-colors font-medium py-4">
                  Categories
                </button>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-pink-100 p-2 min-w-[200px]">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => handleCategoryClick('new')} className="text-foreground hover:text-primary transition-colors font-medium">New Arrivals</button>
              <button onClick={() => handleCategoryClick('flash_sale')} className="text-foreground hover:text-primary transition-colors font-medium text-pink-600">Flash Sale</button>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 bg-pink-50/50 border-pink-100 focus:border-pink-300 rounded-full transition-all focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative hover:bg-pink-50" onClick={onNotificationClick}>
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                        {notificationCount}
                    </Badge>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-pink-50"
                onClick={onCartClick}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-pink-50"
                onClick={() => setIsProfileMenuOpen(true)}
              >
                <User className="w-5 h-5" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-pink-100 bg-white overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 bg-pink-50/50 border-pink-100 rounded-full"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button onClick={onHomeClick} className="text-left py-2 font-medium">Home</button>
                  <button onClick={() => handleCategoryClick('all')} className="text-left py-2 font-medium">Shop</button>
                  <div className="space-y-2 pl-4 border-l-2 border-pink-100">
                    <p className="text-sm text-muted-foreground py-1">Categories</p>
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="block w-full text-left py-1 text-sm hover:text-primary"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => handleCategoryClick('new')} className="text-left py-2 font-medium">New Arrivals</button>
                  <button onClick={() => handleCategoryClick('flash_sale')} className="text-left py-2 font-medium text-pink-600">Flash Sale</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Profile Side Menu */}
      <AnimatePresence>
        {isProfileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsProfileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-80 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Soft Girl Core
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsProfileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* User Info */}
              <div className="mb-8 p-4 bg-white/50 rounded-2xl border border-pink-100">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">Sign in to view orders and more</p>
                    <Button onClick={() => { setIsProfileMenuOpen(false); onAuthClick(); }} className="w-full" size="sm">
                      Sign In
                    </Button>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                <button 
                  onClick={onHomeClick}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-white/50 transition-colors"
                >
                  <span className="font-medium">Home</span>
                </button>

                <div>
                  <button 
                    onClick={() => setShowCategories(!showCategories)}
                    className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-white/50 transition-colors"
                  >
                    <span className="font-medium">Categories</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${showCategories ? 'rotate-90' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showCategories && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-2 space-y-1">
                          {categories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => handleCategoryClick(cat)}
                              className="block w-full text-left py-2 px-3 text-sm text-muted-foreground hover:text-primary hover:bg-pink-50/50 rounded-lg transition-colors"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => handleCategoryClick('flash_sale')}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-white/50 transition-colors text-pink-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="font-medium">Flash Sale</span>
                </button>

                {user && (
                  <button 
                    onClick={() => { setIsProfileMenuOpen(false); onOpenOrders(); }}
                    className="flex items-center w-full p-3 rounded-xl hover:bg-white/50 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    <span className="font-medium">My Orders</span>
                  </button>
                )}

                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-white/50 transition-colors"
                >
                  <span className="font-medium">Contact Us</span>
                </button>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-pink-100">
                {user && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 mb-6"
                    onClick={() => { setIsProfileMenuOpen(false); onAuthClick(); }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                )}

                {/* Social Links */}
                <div className="flex justify-center gap-4">
                  <a 
                    href="https://www.instagram.com/softgirlcore.ng?igsh=MWcxNHlqNmJlc3E5aw==" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 transition-all hover:scale-110"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-black transition-all hover:scale-110"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-black transition-all hover:scale-110"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contact Us Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-xl border border-pink-100 rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Get in Touch
                </h3>
                <p className="text-sm text-muted-foreground">We'd love to hear from you, soft girl!</p>
              </div>

              <div className="space-y-3">
                <a 
                    href={`mailto:${adminContact.email}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-pink-50 hover:border-pink-200 hover:bg-pink-50/50 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Email Us</p>
                        <p className="text-sm font-semibold">{adminContact.email}</p>
                    </div>
                </a>

                <a 
                    href={`https://wa.me/${adminContact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-pink-50 hover:border-pink-200 hover:bg-pink-50/50 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.76-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.131.57-.074 1.758-.706 2.009-1.39.25-.682.25-1.267.174-1.391-.076-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.187-1.622c1.736.946 3.703 1.445 5.703 1.447h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">WhatsApp Chat</p>
                        <p className="text-sm font-semibold">Message Us Directly</p>
                    </div>
                </a>

                <a 
                    href={`tel:${adminContact.phone}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-pink-50 hover:border-pink-200 hover:bg-pink-50/50 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.56 2.62 4.59 5.34 6.03l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Call Support</p>
                        <p className="text-sm font-semibold">{adminContact.phone}</p>
                    </div>
                </a>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Available 24/7 for our girls</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
