import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Gift, Star } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const heroImages = [
  'https://images.unsplash.com/photo-1645199133690-27ab2afb6d37',
  'https://images.unsplash.com/photo-1601938219471-fb3393955f15',
  'https://images.unsplash.com/photo-1623184469710-dbad55757b1e',
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    // Auto-rotate hero images
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7d057e1e/products`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setProducts(data.slice(0, 8)); // Show first 8 products
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="relative w-full h-full">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
              style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-900/70 to-purple-900/50" />
            </motion.div>
          ))}
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="max-w-3xl px-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  Soft Girl Core
                </h1>
                <p className="text-xl md:text-2xl text-pink-100 mb-8">
                  Dreamy, feminine, and luxurious accessories for the modern girl
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/products">
                    <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Shop Now
                    </Button>
                  </Link>
                  <Link to="/products?sort=new">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
                      Explore Collection
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-3 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-3 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-pink-400 to-purple-500 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Gift className="w-6 h-6" />
            <p className="text-lg font-medium">
              ✨ New Year Sale: Get 25% OFF on all items! Use code: <span className="font-bold">NEWYEAR25</span>
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Scrunchies', emoji: '🎀', category: 'scrunchies' },
            { name: 'Lip Gloss', emoji: '💄', category: 'lipgloss' },
            { name: 'Bows', emoji: '🎀', category: 'bows' },
            { name: 'Accessories', emoji: '✨', category: 'accessories' },
          ].map((cat) => (
            <Link
              key={cat.category}
              to={`/products?category=${cat.category}`}
              className="group"
            >
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-6xl mb-4">{cat.emoji}</div>
                <h3 className="font-semibold text-lg text-gray-800">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-pink-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent flex items-center">
              <Star className="w-8 h-8 mr-3 text-pink-400" />
              Featured Products
            </h2>
            <Link to="/products">
              <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                View All
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-pink-400" />
            Trending Now
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-pink-400 to-purple-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Soft Girl Community
          </h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals!
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-pink-500 hover:bg-pink-50 px-8 py-3 rounded-full">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
