import { useState, useEffect, useRef } from 'react';
import { X, Package, ShoppingBag, Plus, Edit, Trash2, Tag, Upload, CheckCircle, ChevronDown, Bell, Send, Sparkles, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import ImageUpload from './ImageUpload';
import MultiImageUpload from './MultiImageUpload';
import {
  Product,
  Order,
  Coupon,
  Notification,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllOrders,
  updateOrderStatus,
  fetchAllCoupons,
  createCoupon,
  deleteCoupon,
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  updateCoupon,
  fetchAllSubscriptions,
  notifySubscribers,
  createAnnouncement,
  deleteAllAnnouncements,
  Banner,
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  ShippingSettings,
  fetchShippingSettings,
  updateShippingSettings
} from '../utils/api';
import { toast } from 'sonner';

interface AdminDashboardProps {
  onClose: () => void;
  onDataChange: () => void;
}

// OrderCard Component for managing individual orders
function OrderCard({ order, onStatusUpdate }: { order: Order; onStatusUpdate: (status: string) => void }) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const orderStatuses = ['pending', 'processing', 'packed', 'shipped', 'delivered'];
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    packed: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <div className="border border-pink-100 rounded-2xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm mt-1">{order.items.length} items • ₦{order.total.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
            {order.status}
            </Badge>
            <Button size="sm" variant="ghost" onClick={() => setDetailsVisible(!detailsVisible)}>
                <ChevronDown className={`w-5 h-5 transition-transform ${detailsVisible ? 'rotate-180' : ''}`} />
            </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {detailsVisible && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-4"
            >
                {/* Shipping Details */}
                <div className="pt-2">
                    <h4 className="font-semibold text-sm mb-2">Shipping To:</h4>
                    <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
                        <p><strong>Name:</strong> {order.shippingDetails?.name}</p>
                        <p><strong>Email:</strong> {order.shippingDetails?.email}</p>
                        <p><strong>Phone:</strong> {order.shippingDetails?.phone}</p>
                        <p><strong>Address:</strong> {order.shippingDetails?.address}, {order.shippingDetails?.city}</p>
                    </div>
                </div>

                {/* Items Details */}
                <div className="pt-2">
                    <h4 className="font-semibold text-sm mb-2">Items:</h4>
                    <div className="space-y-2">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-gray-50">
                                <img src={(item as any).image} alt={(item as any).name} className="w-12 h-12 rounded-md object-cover"/>
                                <div className="flex-1">
                                    <p className="font-medium">{(item as any).name}</p>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        {(item as any).selectedSize && (
                                            <span className="text-[10px] bg-white px-1 border rounded">Size: {(item as any).selectedSize}</span>
                                        )}
                                        {(item as any).selectedColor && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px]">Color:</span>
                                                <div className="w-2 h-2 rounded-full border" style={{ backgroundColor: (item as any).selectedColor }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="font-medium">₦{((item as any).price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status History */}
                {order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="space-y-2 pt-2">
                        <h4 className="font-semibold text-sm mb-2">History:</h4>
                        <div className="space-y-1">
                            {order.statusHistory.map((historyItem, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span className="font-medium">{historyItem.status.toUpperCase()}</span>
                                    <span className="flex-1"></span>
                                    <span>{new Date(historyItem.timestamp).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <Label className="text-xs">Update Status</Label>
        <div className="flex flex-wrap gap-2">
          {orderStatuses.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={order.status === status ? 'default' : 'outline'}
              onClick={() => onStatusUpdate(status)}
              className="text-xs px-2 flex-1"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onClose, onDataChange }: AdminDashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isNotifying, setIsNotifying] = useState<string | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'coupon' | 'category' | 'product' | 'banner', id: string} | null>(null);
  const [showClearAnnouncementsConfirm, setShowClearAnnouncementsConfirm] = useState(false);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Ignore clicks inside alert dialogs
      if ((event.target as HTMLElement).closest('[role="alertdialog"]')) return;
      
      // If a dialog is open (deleteTarget or clearAnnouncements), do not close the dashboard
      if (deleteTarget || showClearAnnouncementsConfirm) return;

      if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
        onClose();
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dashboardRef, statusDropdownRef, onClose, deleteTarget, showClearAnnouncementsConfirm]);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    slashPrice: '',
    image: '',
    images: [] as string[],
    category: '',
    stockQuantity: '',
    status: 'in_stock',
    sizes: '',
    colors: '',
    restockDate: '',
    featured: false,
    trending: false,
    newArrival: false,
    flashSale: false,
    visible: true,
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    order: '0'
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    expiresAt: '',
    minPurchase: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, ordersData, couponsData, categoriesData, subscriptionsData, bannersData, shippingData] = await Promise.all([
        fetchProducts(),
        fetchAllOrders(),
        fetchAllCoupons(),
        fetchCategories(),
        fetchAllSubscriptions(),
        fetchBanners(),
        fetchShippingSettings()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setCoupons(couponsData);
      setCategories(categoriesData);
      setSubscriptions(subscriptionsData);
      setBanners(bannersData);
      setShippingSettings(shippingData);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      toast.error("Failed to load dashboard data.");
    }
  };

  const handleSaveShippingSettings = async () => {
    if (!shippingSettings) return;
    try {
      await updateShippingSettings(shippingSettings);
      toast.success('Shipping settings saved!');
      await loadData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save shipping settings');
    }
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
      setIsAddingCategory(false);
      toast.success('Category added!');
      await loadData();
    } catch (e) {
      toast.error('Failed to add category');
    }
  };

  const handleSaveProduct = async () => {
    try {
      const { id, createdAt, ...restOfForm } = productForm as any;
      const productData: any = {
        ...restOfForm,
        price: parseFloat(productForm.price),
        slashPrice: productForm.slashPrice ? parseFloat(productForm.slashPrice) : null,
        stockQuantity: parseInt(productForm.stockQuantity) || 0,
        sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : [],
        colors: productForm.colors ? productForm.colors.split(',').map(c => c.trim()) : [],
        image: productForm.image || (productForm.images.length > 0 ? productForm.images[0] : ''),
        restockDate: productForm.restockDate || null,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully!');
      }

      resetProductForm();
      await loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategoryName.trim()) return;
    try {
      await updateCategory(editingCategory.id, { name: editingCategoryName });
      setEditingCategory(null);
      setEditingCategoryName('');
      toast.success('Category updated!');
      await loadData();
    } catch (e) {
      toast.error('Failed to update category');
    }
  };

  const handleUpdateCoupon = async () => {
    if (!editingCoupon) return;
    try {
        const { id, createdAt, ...updates } = editingCoupon;
        const couponData = {
            ...updates,
            discountValue: parseFloat(updates.discountValue),
            minPurchase: updates.minPurchase ? parseFloat(updates.minPurchase) : null,
            expiresAt: updates.expiresAt || null,
        };
        await updateCoupon(id, couponData);
        setEditingCoupon(null);
        toast.success('Coupon updated!');
        await loadData();
    } catch(e) {
        console.error("Error updating coupon:", e);
        toast.error('Failed to update coupon');
    }
  };

  const confirmClearAnnouncements = async () => {
    try {
        await deleteAllAnnouncements();
        toast.success("All announcements cleared!");
        onDataChange();
    } catch (e) {
        toast.error("Failed to clear announcements.");
    } finally {
        setShowClearAnnouncementsConfirm(false);
    }
  }

  const handleClearAnnouncements = async () => {
    setShowClearAnnouncementsConfirm(true);
  };

  const handleDeleteProduct = (id: string) => {
    setDeleteTarget({ type: 'product', id });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price.toString(),
      slashPrice: product.slashPrice?.toString() || '',
      image: product.image,
      images: product.images || [product.image],
      category: product.category,
      stockQuantity: product.stockQuantity?.toString() || '0',
      status: product.status || 'in_stock',
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      restockDate: product.restockDate || '',
      featured: product.featured || false,
      trending: product.trending || false,
      newArrival: product.newArrival || false,
      flashSale: product.flashSale || false,
      visible: product.visible !== false,
    });
    setIsAddingProduct(true);
    // Scroll to top using the parent element since it's the one with overflow-y-auto
    dashboardRef.current?.parentElement?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      slashPrice: '',
      image: '',
      images: [],
      category: '',
      stockQuantity: '',
      status: 'in_stock',
      sizes: '',
      restockDate: '',
      featured: false,
      trending: false,
      newArrival: false,
      flashSale: false,
      visible: true,
    });
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const handleSaveCoupon = async () => {
    try {
      const couponData = {
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: parseFloat(couponForm.discountValue),
        expiresAt: couponForm.expiresAt || null, 
        minPurchase: couponForm.minPurchase ? parseFloat(couponForm.minPurchase) : null,
      };

      await createCoupon(couponData as Coupon);
      toast.success('Coupon created successfully!');
      
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expiresAt: '',
        minPurchase: '',
      });
      setIsAddingCoupon(false);
      await loadData();
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast.error('Failed to save coupon.');
    }
  };

  const handleDeleteCategory = (id: string) => {
    setDeleteTarget({ type: 'category', id });
  }

  const handleDeleteCoupon = (id: string) => {
    setDeleteTarget({ type: 'coupon', id });
  };
  
  const confirmDelete = async () => {
      if (!deleteTarget) return;
      const target = deleteTarget;
      try {
          if (target.type === 'coupon') {
              await deleteCoupon(target.id);
              toast.success('Coupon deleted!');
          } else if (target.type === 'category') {
              await deleteCategory(target.id);
              toast.success('Category deleted!');
          } else if (target.type === 'product') {
              await deleteProduct(target.id);
              toast.success('Product deleted!');
              onDataChange();
          } else if (target.type === 'banner') {
              await deleteBanner(target.id);
              toast.success('Banner deleted!');
              onDataChange();
          }
          await loadData();
      } catch (e) {
          console.error(`Failed to delete ${target.type}`, e);
          toast.error(`Failed to delete ${target.type}`);
      } finally {
          setDeleteTarget(null);
      }
  }

  const handleSendAnnouncement = async () => {
      if (!announcement.trim()) return;
      try {
          await createAnnouncement({
              message: announcement,
              type: 'announcement'
          });
          toast.success("Announcement sent!");
          setAnnouncement('');
      } catch (e) {
          toast.error("Failed to send announcement.");
      }
    };
  
  const handleNotifySubscribers = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
        toast.error("Product not found");
        return;
    }
    setIsNotifying(productId);
    try {
        await notifySubscribers(productId, product);
        toast.success(`Notified subscribers for ${product.name}`);
        await loadData();
    } catch (e) {
        toast.error("Failed to send notifications.");
    } finally {
        setIsNotifying(null);
    }
  };

  const handleSaveBanner = async () => {
    try {
      const isVideo = bannerForm.image.match(/\.(mp4|webm|ogg)$/i) || bannerForm.image.includes('video');
      const bannerData: any = {
        ...bannerForm,
        order: parseInt(bannerForm.order) || 0,
        mediaType: isVideo ? 'video' : 'image'
      };

      if (editingBanner) {
        await updateBanner(editingBanner.id, bannerData);
        toast.success('Banner updated successfully!');
      } else {
        await createBanner(bannerData);
        toast.success('Banner created successfully!');
      }
      setBannerForm({ title: '', subtitle: '', image: '', order: (banners.length).toString() });
      setEditingBanner(null);
      setIsAddingBanner(false);
      await loadData();
      onDataChange(); // Refresh main app data
    } catch (error) {
      toast.error('Failed to save banner');
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      order: banner.order.toString()
    });
    setIsAddingBanner(true);
  };

  const handleDeleteBanner = (id: string) => {
    setDeleteTarget({ type: 'banner', id });
  };

  return (
    <>
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div ref={dashboardRef} className="min-h-screen p-4" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-pink-100">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Admin Dashboard
            </h1>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4 md:p-6">
            <TabsList className="flex w-full overflow-x-auto pb-2 mb-4 bg-transparent gap-2 h-auto justify-start">
              <TabsTrigger value="products" className="min-w-fit flex-none px-4 data-[state=active]:bg-pink-100 data-[state=active]:text-primary">
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="banners" className="min-w-fit flex-none px-4 data-[state=active]:bg-pink-100 data-[state=active]:text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Banners
              </TabsTrigger>
              <TabsTrigger value="orders" className="min-w-fit flex-none px-4 data-[state=active]:bg-pink-100 data-[state=active]:text-primary">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="coupons" className="min-w-fit flex-none px-4 data-[state=active]:bg-pink-100 data-[state=active]:text-primary">
                <Tag className="w-4 h-4 mr-2" />
                Coupons
              </TabsTrigger>
              <TabsTrigger value="categories" className="min-w-fit flex-none px-4 data-[state=active]:bg-pink-100 data-[state=active]:text-primary">
                <Tag className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="subscribers" className="min-w-fit flex-none px-4 data-[state=active]:bg-pink-100 data-[state=active]:text-primary">
                <Bell className="w-4 h-4 mr-2" />
                Subscribers
              </TabsTrigger>
              <TabsTrigger value="announcements" className="min-w-fit flex-none px-4 data-[state=active]:bg-pink-100 data-[state=active]:text-primary">
                <Send className="w-4 h-4 mr-2" />
                Announce
              </TabsTrigger>
              <TabsTrigger value="settings" className="min-w-fit flex-none px-4 data-[state=active]:bg-pink-100 data-[state=active]:text-primary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Products</h2>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Add/Edit Product Form */}
              {isAddingProduct && (
                <div className="bg-pink-50 rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-lg">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="e.g., Pink Bow Scrunchie"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        placeholder="e.g., Hair Accessories"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Price (₦)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        placeholder="2000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Slash Price (₦) - Optional</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={productForm.slashPrice}
                        onChange={(e) => setProductForm({...productForm, slashPrice: e.target.value})}
                        placeholder="3000"
                      />
                    </div>

                    {/* Stock Management */}
                    <div className="space-y-2">
                      <Label>Stock Quantity</Label>
                      <Input
                        type="number"
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                        placeholder="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="relative" ref={statusDropdownRef}>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between bg-pink-50/50 border-pink-100 hover:bg-pink-100/50 hover:text-primary transition-all rounded-lg h-10"
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                        >
                            <span className="capitalize">{productForm.status.replace('_', ' ')}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                        </Button>
                        <AnimatePresence>
                            {isStatusDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-50 top-full mt-1 w-full bg-white border border-pink-100 rounded-lg shadow-xl overflow-hidden"
                                >
                                    {[{
                                        value: 'in_stock',
                                        label: 'In Stock'
                                    },
                                    {
                                        value: 'out_of_stock',
                                        label: 'Out of Stock'
                                    },
                                    {
                                        value: 'restocking',
                                        label: 'Restocking'
                                    }].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-pink-50 transition-colors"
                                            onClick={() => {
                                                setProductForm({ ...productForm, status: opt.value as any });
                                                setIsStatusDropdownOpen(false);
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {productForm.status === 'restocking' && (
                        <div className="space-y-2">
                            <Label>Restock Date</Label>
                            <Input
                                type="date"
                                value={productForm.restockDate}
                                onChange={(e) => setProductForm({...productForm, restockDate: e.target.value})}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Sizes (comma separated)</Label>
                        <Input
                            value={productForm.sizes}
                            onChange={(e) => setProductForm({...productForm, sizes: e.target.value})}
                            placeholder="S, M, L, XL"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Colors (comma separated)</Label>
                        <Input
                            value={productForm.colors}
                            onChange={(e) => setProductForm({...productForm, colors: e.target.value})}
                            placeholder="Pink, Blue, #ff0000"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Product Images</Label>
                      <MultiImageUpload
                        images={productForm.images}
                        onChange={(images) => setProductForm({...productForm, images})}
                        maxImages={5}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Short Description</Label>
                      <Input
                        value={productForm.shortDescription}
                        onChange={(e) => setProductForm({...productForm, shortDescription: e.target.value})}
                        placeholder="Brief product description"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Full Description</Label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        placeholder="Detailed product description"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Flags */}
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                        className="rounded border-pink-300"
                      />
                      <span>Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.trending}
                        onChange={(e) => setProductForm({...productForm, trending: e.target.checked})}
                        className="rounded border-pink-300"
                      />
                      <span>Trending</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.newArrival}
                        onChange={(e) => setProductForm({...productForm, newArrival: e.target.checked})}
                        className="rounded border-pink-300"
                      />
                      <span>New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.flashSale}
                        onChange={(e) => setProductForm({...productForm, flashSale: e.target.checked})}
                        className="rounded border-pink-300"
                      />
                      <span>Flash Sale</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.visible}
                        onChange={(e) => setProductForm({...productForm, visible: e.target.checked})}
                        className="rounded border-pink-300"
                      />
                      <span>Visible</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveProduct} className="flex-1">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </Button>
                    <Button variant="outline" onClick={resetProductForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Products List */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-pink-100 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="relative">
                        <img src={product.image} alt={product.name} className={`w-full h-28 sm:h-40 object-cover rounded-lg sm:rounded-xl ${product.status !== 'in_stock' ? 'grayscale' : ''}`} />
                        {product.status !== 'in_stock' && (
                            <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black/70 text-white text-[10px] sm:text-xs px-1 sm:px-2 py-0">
                                {product.status === 'out_of_stock' ? 'Out of Stock' : 'Restocking'}
                            </Badge>
                        )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs sm:text-base line-clamp-1">{product.name}</h3>
                      <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-1">{product.category}</p>
                      <p className="text-sm sm:text-lg font-bold text-primary mt-1 sm:mt-2">₦{product.price.toLocaleString()}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Stock: {product.stockQuantity || 0}</p>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)} className="flex-1 h-8 sm:h-9 text-[10px] sm:text-sm px-1 sm:px-3">
                        <Edit className="w-3 h-3 sm:mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)} className="h-8 sm:h-9 px-2 sm:px-3">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Banners Tab */}
            <TabsContent value="banners" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Hero Banners</h2>
                <Button onClick={() => setIsAddingBanner(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Banner
                </Button>
              </div>

              {isAddingBanner && (
                <div className="bg-pink-50 rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-lg">
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                        placeholder="e.g., Summer Sale"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={bannerForm.subtitle}
                        onChange={(e) => setBannerForm({...bannerForm, subtitle: e.target.value})}
                        placeholder="e.g., Up to 50% off"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Order (Sort Priority)</Label>
                      <Input
                        type="number"
                        value={bannerForm.order}
                        onChange={(e) => setBannerForm({...bannerForm, order: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Banner Media (Image or Video)</Label>
                      <ImageUpload
                        value={bannerForm.image}
                        onChange={(image) => setBannerForm({...bannerForm, image})}
                        accept="image/*,video/*"
                        label="Upload Media"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveBanner} className="flex-1">
                      {editingBanner ? 'Update Banner' : 'Create Banner'}
                    </Button>
                    <Button variant="outline" onClick={() => { setIsAddingBanner(false); setEditingBanner(null); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="border border-pink-100 rounded-2xl p-4 space-y-3">
                    {banner.mediaType === 'video' ? (
                        <video src={banner.image} className="w-full h-32 object-cover rounded-xl" muted />
                    ) : (
                        <img src={banner.image} alt={banner.title} className="w-full h-32 object-cover rounded-xl" />
                    )}
                    <div>
                      <h3 className="font-semibold">{banner.title}</h3>
                      <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">Order: {banner.order}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditBanner(banner)} className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteBanner(banner.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No orders yet</p>
                ) : (
                  orders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={async (newStatus) => {
                        try {
                          await updateOrderStatus(order.id, newStatus);
                          toast.success('Order status updated!');
                          await loadData();
                        } catch (error) {
                          console.error('Error updating order status:', error);
                          toast.error('Failed to update order status');
                        }
                      }}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Coupons Tab */}
            <TabsContent value="coupons" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Coupons</h2>
                <Button onClick={() => setIsAddingCoupon(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Coupon
                </Button>
              </div>

              {/* Add Coupon Form */}
              {isAddingCoupon && (
                <div className="bg-pink-50 rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Create New Coupon</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Coupon Code</Label>
                      <Input
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                        placeholder="SAVE20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <select
                        value={couponForm.discountType}
                        onChange={(e) => setCouponForm({...couponForm, discountType: e.target.value as 'percentage' | 'fixed'})}
                        className="w-full p-2 border border-pink-200 rounded-lg"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Discount Value</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={couponForm.discountValue}
                        onChange={(e) => setCouponForm({...couponForm, discountValue: e.target.value})}
                        placeholder={couponForm.discountType === 'percentage' ? '20' : '10.00'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Minimum Purchase (₦)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={couponForm.minPurchase}
                        onChange={(e) => setCouponForm({...couponForm, minPurchase: e.target.value})}
                        placeholder="5000 (optional)"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Expires At (optional)</Label>
                      <Input
                        type="date"
                        value={couponForm.expiresAt}
                        onChange={(e) => setCouponForm({...couponForm, expiresAt: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveCoupon} className="flex-1">
                      Create Coupon
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingCoupon(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Coupons List */}
              <div className="grid md:grid-cols-2 gap-4">
                {coupons.length === 0 ? (
                  <p className="text-muted-foreground col-span-2 text-center py-8">No coupons created yet</p>
                ) : (
                  coupons.map((coupon) => (
                    <div key={coupon.id} className="border border-pink-100 rounded-2xl p-4 space-y-3">
                        {editingCoupon?.id === coupon.id ? (
                            <div className="space-y-2">
                                <Input placeholder="Code" value={editingCoupon.code} onChange={(e) => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})} />
                                <Input placeholder="Discount Value" type="number" value={editingCoupon.discountValue} onChange={(e) => setEditingCoupon({...editingCoupon, discountValue: e.target.value})} />
                                <Input placeholder="Min Purchase" type="number" value={editingCoupon.minPurchase || ''} onChange={(e) => setEditingCoupon({...editingCoupon, minPurchase: e.target.value})} />
                                <Input type="date" value={editingCoupon.expiresAt ? new Date(editingCoupon.expiresAt).toISOString().split('T')[0] : ''} onChange={(e) => setEditingCoupon({...editingCoupon, expiresAt: e.target.value})} />
                                <select value={editingCoupon.discountType} onChange={(e) => setEditingCoupon({...editingCoupon, discountType: e.target.value})}>
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                                <Button size="sm" onClick={handleUpdateCoupon}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingCoupon(null)}>Cancel</Button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                <p className="font-bold text-lg text-primary">{coupon.code}</p>
                                <p className="text-sm">
                                    {coupon.discountType === 'percentage' 
                                    ? `${coupon.discountValue}% off`
                                    : `₦${coupon.discountValue} off`
                                    }
                                </p>
                                {coupon.minPurchase && (
                                    <p className="text-xs text-muted-foreground">
                                    Min. purchase: ₦{coupon.minPurchase.toLocaleString()}
                                    </p>
                                )}
                                {coupon.expiresAt && (
                                    <p className="text-xs text-muted-foreground">
                                    Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                                    </p>
                                )}
                                </div>
                                <Badge className={coupon.expiresAt && new Date(coupon.expiresAt) < new Date() ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'}>
                                    {coupon.expiresAt && new Date(coupon.expiresAt) < new Date() ? 'Inactive' : 'Active'}
                                </Badge>
                            </div>
                        )}
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline" onClick={() => setEditingCoupon(coupon)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteCoupon(coupon.id!)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Categories</h2>
                    <Button onClick={() => setIsAddingCategory(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>

                {isAddingCategory && (
                    <div className="bg-pink-50 rounded-2xl p-6 space-y-4 flex flex-col md:flex-row gap-4 md:items-end">
                        <div className="flex-1 space-y-2">
                            <Label>Category Name</Label>
                            <Input 
                                value={newCategoryName} 
                                onChange={(e) => setNewCategoryName(e.target.value)} 
                                placeholder="e.g. Skin Care"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSaveCategory} className="flex-1 md:flex-none">Save</Button>
                            <Button variant="outline" onClick={() => setIsAddingCategory(false)} className="flex-1 md:flex-none">Cancel</Button>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="border border-pink-100 rounded-2xl p-4 flex justify-between items-center">
                            {editingCategory?.id === cat.id ? (
                                <Input 
                                    value={editingCategoryName} 
                                    onChange={(e) => setEditingCategoryName(e.target.value)} 
                                    className="flex-1"
                                />
                            ) : (
                                <span className="font-medium">{cat.name}</span>
                            )}
                            <div className="flex gap-1">
                                {editingCategory?.id === cat.id ? (
                                    <Button size="sm" onClick={handleUpdateCategory}>Save</Button>
                                ) : (
                                    <Button variant="ghost" size="icon" className="text-blue-500" onClick={() => { setEditingCategory(cat); setEditingCategoryName(cat.name); }}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteCategory(cat.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>

            {/* Subscribers Tab */}
            <TabsContent value="subscribers" className="space-y-4">
                <h2 className="text-xl font-semibold">Restock Subscribers</h2>
                <div className="space-y-3">
                    {products.filter(p => subscriptions.some(s => s.productId === p.id && s.status === 'pending')).map(p => (
                        <div key={p.id} className="border border-pink-100 rounded-2xl p-4 flex gap-4 items-center">
                            <div 
                                className="flex gap-4 items-center flex-1 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors"
                                onClick={() => {
                                    handleEditProduct(p);
                                    setActiveTab('products');
                                }}
                            >
                                <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-pink-50" />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{p.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {subscriptions.filter(s => s.productId === p.id && s.status === 'pending').length} pending notification(s)
                                    </p>
                                </div>
                            </div>
                            <Button 
                                size="sm" 
                                className="mt-2" 
                                onClick={() => handleNotifySubscribers(p.id)}
                                disabled={isNotifying === p.id}
                            >
                                {isNotifying === p.id ? 'Notifying...' : 'Notify Subscribers'}
                            </Button>
                        </div>
                    ))}
                </div>
            </TabsContent>

            {/* Announcements Tab */}
            <TabsContent value="announcements" className="space-y-4">
                 <h2 className="text-xl font-semibold">Send Announcement</h2>
                 <div className="bg-pink-50 rounded-2xl p-6 space-y-4">
                    <Label>Announcement Message</Label>
                    <Textarea 
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        placeholder="e.g., The summer collection is now live!"
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSendAnnouncement}>Send to All Users</Button>
                        <Button variant="destructive" onClick={handleClearAnnouncements}>Clear All Announcements</Button>
                    </div>
                 </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
                <h2 className="text-xl font-semibold">Shipping Settings</h2>
                {shippingSettings && (
                    <div className="bg-pink-50 rounded-2xl p-6 space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Flat Rate Shipping (₦)</Label>
                                <Input 
                                    type="number"
                                    value={shippingSettings.rate}
                                    onChange={(e) => setShippingSettings({...shippingSettings, rate: parseFloat(e.target.value)})}
                                    placeholder="e.g. 1500"
                                />
                                <p className="text-xs text-muted-foreground">This amount will be charged for shipping on all orders unless free shipping applies.</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-pink-200">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Free Shipping</Label>
                                    <p className="text-sm text-muted-foreground">Enable free shipping for orders over a certain amount</p>
                                </div>
                                <Switch 
                                    checked={shippingSettings.isFreeShippingEnabled}
                                    onCheckedChange={(checked) => setShippingSettings({...shippingSettings, isFreeShippingEnabled: checked})}
                                />
                            </div>

                            {shippingSettings.isFreeShippingEnabled && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <Label>Free Shipping Threshold (₦)</Label>
                                    <Input 
                                        type="number"
                                        value={shippingSettings.freeShippingThreshold || ''}
                                        onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: parseFloat(e.target.value)})}
                                        placeholder="e.g. 20000"
                                    />
                                    <p className="text-xs text-muted-foreground">Orders with a subtotal equal to or greater than this amount will have free shipping.</p>
                                </motion.div>
                            )}
                        </div>

                        <Button onClick={handleSaveShippingSettings} className="w-full sm:w-auto">Save Settings</Button>
                    </div>
                )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the {deleteTarget?.type}.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    <AlertDialog open={showClearAnnouncementsConfirm} onOpenChange={setShowClearAnnouncementsConfirm}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This will permanently delete all global announcements for every user. This action cannot be undone.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAnnouncements}>Delete All Announcements</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}