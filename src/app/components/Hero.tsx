import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Banner } from '../utils/api';

interface HeroProps {
  onSortChange: (sortType: string) => void;
  banners: Banner[];
}

export default function Hero({ onSortChange, banners = [] }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-none md:rounded-3xl md:mx-4 md:my-8 shadow-2xl">
      {/* Background Slides */}
      {banners.map((banner, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: currentSlide === index ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 z-10" />
          {banner.mediaType === 'video' ? (
              <video
                src={banner.image}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
          ) : (
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
          )}
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Limited Edition</span>
            </div>
            
            <h1 
              className="text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {banners[currentSlide].title}
            </h1>
            
            <p className="text-xl text-white/95 mb-8 drop-shadow-md">
              {banners[currentSlide].subtitle}
            </p>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-primary hover:text-white transition-all shadow-lg px-8"
                onClick={() => {
                  const element = document.getElementById('products-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/20 backdrop-blur-sm text-white border-white hover:bg-white hover:text-primary transition-all"
                onClick={() => onSortChange('best-sellers')}
              >
                Best Sellers
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-20 right-20 z-30 hidden lg:block"
      >
        <div className="w-20 h-20 bg-pink-300/30 backdrop-blur-sm rounded-full" />
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-32 right-32 z-30 hidden lg:block"
      >
        <div className="w-16 h-16 bg-purple-300/30 backdrop-blur-sm rounded-full" />
      </motion.div>
    </div>
  );
}