import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product } from '../utils/api';
import { useState } from 'react';
import { toast } from 'sonner';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (couponCode?: string, discount?: number) => void;
  user: any;
}

import { fetchCoupon } from '../utils/api';

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout, user }: CartProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const discount = appliedCoupon 
    ? appliedCoupon.discountType === 'percentage'
      ? subtotal * (appliedCoupon.discountValue / 100)
      : appliedCoupon.discountValue
    : 0;

  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    try {
        const coupon = await fetchCoupon(couponCode.trim().toUpperCase());
        
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            toast.error('This coupon has expired.');
            return;
        }

        if (coupon.minPurchase && subtotal < coupon.minPurchase) {
            toast.error(`You need to spend at least ₦${coupon.minPurchase} to use this coupon.`);
            return;
        }

        toast.success('Coupon applied successfully! ✨');
        setAppliedCoupon(coupon);
    } catch (error) {
        toast.error('Invalid coupon code.');
        setAppliedCoupon(null);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please log in to checkout');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    onCheckout(appliedCoupon?.code, discount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-24 h-24 text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button className="mt-4" onClick={onClose}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 bg-pink-50 rounded-2xl p-4"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-white flex-shrink-0">
                        <img
                          src={item.product?.image}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.product?.category}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.selectedSize && (
                            <Badge variant="outline" className="text-[10px] py-0 h-4 bg-white">
                              Size: {item.selectedSize}
                            </Badge>
                          )}
                          {item.selectedColor && (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-muted-foreground">Color:</span>
                              <div 
                                className="w-3 h-3 rounded-full border border-gray-200" 
                                style={{ backgroundColor: item.selectedColor }}
                                title={item.selectedColor}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-lg font-bold text-primary mt-1">
                          ₦{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-auto text-destructive"
                            onClick={() => onRemoveItem(item.productId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Checkout */}
            {items.length > 0 && (
              <div className="border-t border-pink-100 p-6 space-y-4">
                {/* Coupon */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <span>Coupon "{appliedCoupon.code}" applied</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAppliedCoupon(null)}
                      className="h-auto p-0 text-green-600"
                    >
                      Remove
                    </Button>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₦{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t border-pink-100 pt-2">
                    <span>Total</span>
                    <span className="text-primary">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
