import { useState, useEffect, useRef } from 'react';
import { X, CreditCard, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, createOrder, fetchShippingSettings, ShippingSettings } from '../utils/api';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { usePaystackPayment } from 'react-paystack';

// Nigerian cities for datalist
const nigerianCities = ["Lagos", "Kano", "Ibadan", "Abuja", "Port Harcourt", "Benin City", "Maiduguri", "Zaria", "Aba", "Jos", "Ilorin", "Oyo", "Enugu", "Abeokuta", "Onitsha", "Warri", "Sokoto", "Calabar", "Uyo", "Katsina", "Akure", "Bauchi", "Ebonyi", "Makurdi", "Minna", "Effurun", "Ikorodu", "Owerri"];

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: any;
  total: number;
  discount: number;
  couponCode?: string;
  onSuccess: () => void;
}

export default function Checkout({ 
  isOpen, 
  onClose, 
  items, 
  user, 
  total, 
  discount, 
  couponCode,
  onSuccess 
}: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings | null>(null);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const loadSettings = async () => {
        try {
            const settings = await fetchShippingSettings();
            setShippingSettings(settings);
        } catch (e) {
            console.error("Failed to load shipping settings", e);
        }
    }
    if (isOpen) {
        loadSettings();
    }
  }, [isOpen]);

  useEffect(() => {
    if (shippingSettings) {
        if (shippingSettings.isFreeShippingEnabled && total >= (shippingSettings.freeShippingThreshold || 0)) {
            setShippingFee(0);
        } else {
            setShippingFee(shippingSettings.rate);
        }
    }
  }, [shippingSettings, total]);

  const finalTotal = total + shippingFee;

  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });
  
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { email, name, address, city, phone } = formData;
    const requiredFieldsFilled = email && name && address && city && phone;
    setIsFormValid(!!requiredFieldsFilled && termsAccepted);
  }, [formData, termsAccepted]);

  // Handle outside click for city dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cityDropdownRef]);


  // Paystack configuration
  const PAYSTACK_PUBLIC_KEY = 'pk_test_bcaf17258cd41671d12272479d1196b6223e7fc4';

  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: Math.ceil(finalTotal * 100), // Convert to kobo (integer)
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
        name: formData.name,
        phone: formData.phone,
        custom_fields: []
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onPaystackSuccess = async (reference: any) => {
      try {
        // Create order in Firestore
        await createOrder({
            userId: user.uid || user.id,
            items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            name: item.product?.name,
            price: item.product?.price,
            image: item.product?.image,
            selectedColor: item.selectedColor || null,
            selectedSize: item.selectedSize || null
            })),
            total: finalTotal,
            shippingFee,
            discount,
            couponCode: couponCode || null,
            status: 'pending',
            shippingDetails: formData,
            paymentReference: reference.reference,
            paymentStatus: 'paid'
        });

        // Success sequence
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFB6D9', '#FF69B4', '#9333EA']
        });
        
        setShowSuccess(true);
        setTimeout(() => {
            onSuccess();
            onClose();
            setShowSuccess(false);
        }, 5000);
      } catch (error) {
          console.error('Order creation failed:', error);
          toast.error('Payment successful but order creation failed. Please contact support.');
      } finally {
          setLoading(false);
      }
  };

  const onPaystackClose = () => {
      toast.info('Payment cancelled');
      setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let processedValue = value;
    
    if (id === 'name' || id === 'city') {
      processedValue = value.replace(/[^a-zA-Z\s'-]/g, '');
    } else if (id === 'phone' || id === 'zipCode') {
      processedValue = value.replace(/[^0-9]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [id]: processedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
        toast.error('Please fill all required fields and accept the terms.');
        return;
    }

    setLoading(true);
    initializePayment({ onSuccess: onPaystackSuccess, onClose: onPaystackClose });
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-pink-100">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Checkout
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-pink-50 rounded-2xl p-4">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm gap-3">
                    <img src={item.product?.image} alt={item.product?.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0"/>
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name}</p>
                      <div className="flex gap-2 items-center">
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        {item.selectedSize && <span className="text-[10px] bg-white px-1 border rounded">Size: {item.selectedSize}</span>}
                        {item.selectedColor && (
                            <div className="flex items-center gap-1">
                                <span className="text-[10px]">Color:</span>
                                <div className="w-2 h-2 rounded-full border" style={{ backgroundColor: item.selectedColor }} />
                            </div>
                        )}
                      </div>
                    </div>
                    <span className="font-medium">₦{((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount {couponCode && `(${couponCode})`}</span>
                    <span>-₦{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                        {shippingFee === 0 ? "Free" : `₦${shippingFee.toLocaleString()}`}
                    </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-pink-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-primary">₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Shipping Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-pink-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-pink-50/50"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="bg-pink-50/50"
                  />
                </div>
                
                <div className="space-y-2" ref={cityDropdownRef}>
                  <Label htmlFor="city">City</Label>
                  <div className="relative">
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-pink-50/50 pr-10"
                      autoComplete="off"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                    </Button>
                    {isCityDropdownOpen && (
                      <div className="absolute z-10 top-full mt-1 w-full bg-white border border-pink-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {nigerianCities.map(city => (
                          <button
                            type="button"
                            key={city}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-pink-50"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, city }));
                              setIsCityDropdownOpen(false);
                            }}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code (Optional)</Label>
                  <Input
                    id="zipCode"
                    type="tel"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="bg-pink-50/50"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="bg-pink-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4 border border-pink-200">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Payment via Paystack</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure payment processing. You'll be redirected to complete your payment.
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2 p-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted} 
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <button 
                  type="button" 
                  className="text-primary hover:underline"
                  onClick={() => toast.info('Terms & Conditions', { description: 'Placeholder for actual T&C text.' })}
                >
                  Terms & Conditions
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={loading || !isFormValid}
            >
              {loading ? 'Processing...' : `Pay ₦${finalTotal.toLocaleString()}`}
            </Button>
          </form>
        </motion.div>
      </motion.div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-16 h-16 text-green-600 animate-bounce" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Thank You!
                </h2>
                <p className="text-xl text-muted-foreground">
                  Your order has been placed successfully.
                </p>
              </div>
              <p className="text-sm text-pink-400 font-medium">
                Wait a moment, we're redirecting you...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}