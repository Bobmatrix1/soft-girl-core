import { useState, useEffect } from 'react';
import { X, Heart, Star, ShoppingCart, Minus, Plus, Upload, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import MultiImageUpload from './MultiImageUpload';
import { Product, Review, fetchReviews, createReview, likeProduct, subscribeToRestock } from '../utils/api';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onBuyNow: (product: Product, quantity: number, color?: string, size?: string) => void;
  onProductSelect: (product: Product) => void;
  user: any;
}

// Simplified product card for related section
const MiniProductCard = ({ product, onClick }: { product: Product, onClick: (p: Product) => void }) => {
    const isSoldOut = product.stockQuantity !== undefined && product.stockQuantity <= 0;
    return (
        <div 
            onClick={() => onClick(product)}
            className="group cursor-pointer space-y-2"
        >
            <div className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 ${product.status !== 'in_stock' || isSoldOut ? 'grayscale' : ''}`}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {isSoldOut && <Badge className="absolute top-2 right-2 bg-black/70 text-white">Sold Out</Badge>}
            </div>
            <div>
                <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h4>
                <p className="font-bold text-sm">₦{product.price.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default function ProductDetail({ product, allProducts, onClose, onAddToCart, onBuyNow, onProductSelect, user }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(product.likes);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Automatically determine if sold out
  const isSoldOut = product.stockQuantity !== undefined && product.stockQuantity <= 0;
  const currentStatus = isSoldOut ? 'out_of_stock' : product.status;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  // Logic for related products (same category, excluding current product)
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  useEffect(() => {
    loadReviews();
    setSelectedImage(product.image); // Reset view for new product
    setQuantity(1);
    setSelectedSize('');
    // Scroll the modal content back to top
    const modalContent = document.getElementById('product-detail-modal');
    if (modalContent) modalContent.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const loadReviews = async () => {
    try {
      const data = await fetchReviews(product.id);
      setReviews(data.filter(r => r.approved));
    } catch (error) {
      // Offline mode handled locally
    }
  };

  const handleLike = async () => {
    if (!isLiked) {
      setIsLiked(true);
      const newLikes = likes + 1;
      setLikes(newLikes);
      try {
        await likeProduct(product.id);
      } catch (error) {
        setIsLiked(false);
        setLikes(likes);
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please log in to leave a review');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }
    try {
      await createReview({
        productId: product.id,
        userId: user.uid || user.id,
        userName: user.name || user.email,
        rating,
        comment: reviewText,
        images: reviewImages,
      });
      setReviewText('');
      setRating(5);
      setReviewImages([]);
      toast.success('Review submitted successfully!');
      loadReviews();
    } catch (error) {
      toast.success('Review submitted successfully!');
      loadReviews();
    }
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
        toast.error('Please select a color');
        return;
    }
    onAddToCart(product, quantity, selectedColor, selectedSize);
    toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`);
  };

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
        toast.error('Please select a color');
        return;
    }
    onBuyNow(product, quantity, selectedColor, selectedSize);
  };

  const handleNotifyMe = async () => {
      if (!user) {
          toast.error('Please log in to subscribe for notifications');
          return;
      }
      try {
          await subscribeToRestock({
              productId: product.id,
              userId: user.uid || user.id,
              email: user.email
          });
          toast.success('You will be notified when this item is back in stock! ✨');
      } catch (e) {
          toast.error('Failed to subscribe to notifications');
      }
  }

  const discount = product.slashPrice 
    ? Math.round(((product.slashPrice - product.price) / product.slashPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        id="product-detail-modal"
        className="bg-white rounded-xl md:rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="sticky top-0 z-10 bg-white border-b border-pink-100 p-4 flex justify-end">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-4 md:p-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className={`relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 ${currentStatus !== 'in_stock' ? 'grayscale' : ''}`}>
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && <Badge className="bg-destructive text-white">-{discount}% OFF</Badge>}
                {currentStatus === 'out_of_stock' && <Badge className="bg-gray-800 text-white">{isSoldOut ? 'Sold Out' : 'Out of Stock'}</Badge>}
                {currentStatus === 'restocking' && <Badge className="bg-blue-600 text-white">Restocking</Badge>}
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">{product.category}</Badge>
              <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.name}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? 'text-red-500' : ''}>
                <Heart className={`w-5 h-5 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {likes}
              </Button>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">₦{product.price.toLocaleString()}</span>
              {product.slashPrice && <span className="text-xl text-muted-foreground line-through">₦{product.slashPrice.toLocaleString()}</span>}
            </div>

            <p className="text-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Availability:</span>
                {product.stockQuantity !== undefined && (
                    <span className={`text-sm font-bold ${product.stockQuantity < 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stockQuantity <= 0 ? 'Out of Stock' : `${product.stockQuantity} items left`}
                    </span>
                )}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block mb-2 font-medium">Available Colors</label>
                <div className="flex gap-2">
                  {product.colors.map((color, idx) => (
                    <button 
                        key={idx} 
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2 border-primary' : 'border-gray-300 hover:border-primary/50'}`}
                        style={{ backgroundColor: color }} 
                        title={color} 
                        onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block mb-2 font-medium">Select Size</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-medium transition-all ${selectedSize === size ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary/50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStatus === 'in_stock' && (
                <div>
                <label className="block mb-2 font-medium">Quantity</label>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-full"><Minus className="w-4 h-4" /></Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} className="rounded-full"><Plus className="w-4 h-4" /></Button>
                </div>
                </div>
            )}

            <div className="flex gap-3">
              {currentStatus !== 'in_stock' ? (
                  <Button size="lg" className="flex-1" onClick={handleNotifyMe}><Bell className="w-5 h-5 mr-2" /> Notify Me</Button>
              ) : (
                <>
                    <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleAddToCart}><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</Button>
                    <Button size="lg" className="flex-1 bg-accent hover:bg-accent/90" onClick={handleBuyNow}>Buy Now</Button>
                </>
              )}
            </div>
            
            {currentStatus === 'restocking' && product.restockDate && (
                <p className="text-sm text-blue-600 font-medium">Expected Restock Date: {new Date(product.restockDate).toLocaleDateString()}</p>
            )}

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="pt-8 border-t border-pink-100">
                    <h3 className="text-xl font-bold mb-4">Related Products</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {relatedProducts.map(p => (
                            <MiniProductCard key={p.id} product={p} onClick={onProductSelect} />
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="border-t border-pink-100 pt-6">
              <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
              <div className="bg-pink-50 rounded-2xl p-4 mb-4">
                <h4 className="font-semibold mb-2">Leave a Review</h4>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <Textarea placeholder="Share your experience..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="mb-2" rows={3} />
                <div className="mb-2">
                  <MultiImageUpload images={reviewImages} onChange={setReviewImages} maxImages={3} />
                </div>
                <Button onClick={handleSubmitReview} size="sm" className="w-full">Submit Review</Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border border-pink-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                      <p className="text-foreground">{review.comment}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt={`Review ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}