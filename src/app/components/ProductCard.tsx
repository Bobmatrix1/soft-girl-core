import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Product } from '../utils/api';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onLike: (productId: string) => void;
  onClick: (product: Product) => void;
  isHighlighted?: boolean;
}

export default function ProductCard({ product, onAddToCart, onLike, onClick, isHighlighted }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(product.likes);

  // Automatically determine if sold out based on stock quantity
  const isSoldOut = product.stockQuantity !== undefined && product.stockQuantity <= 0;
  const currentStatus = isSoldOut ? 'out_of_stock' : product.status;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsLiked(true);
      setLikes(likes + 1);
      onLike(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.status === 'out_of_stock') return;
    onAddToCart(product);
  };

  const discount = product.slashPrice 
    ? Math.round(((product.slashPrice - product.price) / product.slashPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-pink-100 cursor-pointer transition-all duration-300 ${
        isHighlighted ? 'ring-2 ring-pink-400 ring-offset-2' : ''
      }`}
      onClick={() => onClick(product)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2">
        {product.flashSale && (
          <Badge className="bg-destructive text-white text-[10px] sm:text-xs px-1.5 py-0.5 h-auto">Flash Sale</Badge>
        )}
        {product.newArrival && (
          <Badge className="bg-accent text-white text-[10px] sm:text-xs px-1.5 py-0.5 h-auto">New</Badge>
        )}
        {discount > 0 && (
          <Badge className="bg-primary text-white text-[10px] sm:text-xs px-1.5 py-0.5 h-auto">-{discount}%</Badge>
        )}
        {currentStatus === 'out_of_stock' && (
          <Badge className="bg-gray-800 text-white text-[10px] sm:text-xs px-1.5 py-0.5 h-auto">{isSoldOut ? 'Sold Out' : 'Out of Stock'}</Badge>
        )}
        {currentStatus === 'restocking' && (
          <Badge className="bg-blue-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 h-auto">Restocking</Badge>
        )}
      </div>

      {/* Like Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/80 backdrop-blur-sm hover:bg-white transition-all w-8 h-8 sm:w-10 sm:h-10 ${
          isLiked ? 'text-red-500' : 'text-gray-400'
        }`}
        onClick={handleLike}
      >
        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
      </Button>

      {/* Product Image */}
      <div className={`relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 ${currentStatus !== 'in_stock' ? 'grayscale' : ''}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Quick Add - Shown on hover (if in stock) */}
        {currentStatus === 'in_stock' && (
            <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 bg-gradient-to-t from-black/60 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <Button
                onClick={handleAddToCart}
                size="sm"
                className="w-full bg-white text-primary hover:bg-primary hover:text-white transition-all text-xs sm:text-sm h-8 sm:h-9"
            >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Add to Cart
            </Button>
            </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
        <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 hidden sm:block">
          {product.shortDescription}
        </p>

        {/* Rating and Likes */}
        <div className="flex flex-wrap items-center justify-between gap-1">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs sm:text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] sm:text-sm text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {product.stockQuantity !== undefined && (
                <span className={`text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full ${product.stockQuantity < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {product.stockQuantity} left
                </span>
            )}
            <div className="hidden sm:flex items-center space-x-1">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{likes}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl font-bold text-primary">
            ₦{product.price.toLocaleString()}
          </span>
          {product.slashPrice && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through">
              ₦{product.slashPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}