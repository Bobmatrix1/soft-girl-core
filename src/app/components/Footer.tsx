import { Sparkles, Heart, Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FooterProps {
  onCategoryClick: (category: string) => void;
  onSortChange: (sortType: string) => void;
  onContactClick: () => void;
  onPolicyClick: (type: 'privacy' | 'terms' | 'refund' | 'shipping' | 'returns' | 'faq' | 'size-guide') => void;
}

export default function Footer({ onCategoryClick, onSortChange, onContactClick, onPolicyClick }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-pink-50 to-purple-50 border-t border-pink-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                Soft Girl Core
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your dreamy destination for all things soft, feminine, and fabulous. 
              Curated with love for the modern soft girl.
            </p>
            <div className="flex gap-2">
              <a 
                href="https://www.instagram.com/softgirlcore.ng?igsh=MWcxNHlqNmJlc3E5aw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-transparent hover:bg-pink-100 text-pink-600 transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-transparent hover:bg-pink-100 text-black transition-all hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-transparent hover:bg-pink-100 text-black transition-all hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => onCategoryClick('new')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSortChange('best-sellers')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSortChange('most-rated')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Most Rated
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSortChange('most-liked')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Most Liked
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick('flash_sale')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Flash Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={onContactClick} className="hover:text-primary transition-colors text-left">Contact Us</button></li>
              <li><button onClick={() => onPolicyClick('shipping')} className="hover:text-primary transition-colors text-left">Shipping Info</button></li>
              <li><button onClick={() => onPolicyClick('returns')} className="hover:text-primary transition-colors text-left">Returns & Exchanges</button></li>
              <li><button onClick={() => onPolicyClick('faq')} className="hover:text-primary transition-colors text-left">FAQ</button></li>
              <li><button onClick={() => onPolicyClick('size-guide')} className="hover:text-primary transition-colors text-left">Size Guide</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers, new arrivals, and exclusive updates!
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white border-pink-200"
              />
              <Button className="bg-primary hover:bg-primary/90">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-pink-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Soft Girl Core. Made with <Heart className="inline w-4 h-4 fill-pink-400 text-pink-400" /> by girl bosses, for girl bosses.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <button onClick={() => onPolicyClick('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button>
            <button onClick={() => onPolicyClick('terms')} className="hover:text-primary transition-colors">Terms of Service</button>
            <button onClick={() => onPolicyClick('refund')} className="hover:text-primary transition-colors">Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}