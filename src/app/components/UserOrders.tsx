import { useState, useEffect, useRef } from 'react';
import { X, Package, Truck, CheckCircle, Clock, Instagram, Send, ChevronDown, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Order, fetchUserOrders, updateOrderStatus, deleteOrder, Product, fetchProducts, fetchProduct } from '../utils/api';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface UserOrdersProps {
  onClose: () => void;
  userId: string;
  onReviewProduct: (productId: string) => void;
}

const OrderItemCard = ({ item }: { item: any }) => (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-pink-50/50">
        <img 
            src={item.image || item.product?.image} 
            alt={item.name || item.product?.name} 
            className="w-16 h-16 rounded-lg object-cover bg-pink-100"
        />
        <div className="flex-1">
            <p className="font-medium">{item.name || item.product?.name}</p>
            <div className="flex flex-wrap gap-2 items-center">
                <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
                {item.selectedSize && (
                    <Badge variant="outline" className="text-[10px] py-0 h-4 bg-white">Size: {item.selectedSize}</Badge>
                )}
                {item.selectedColor && (
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">Color:</span>
                        <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.selectedColor }} title={item.selectedColor} />
                    </div>
                )}
            </div>
        </div>
        <p className="font-semibold">₦{((item.price || item.product?.price) * item.quantity).toLocaleString()}</p>
    </div>
);

export default function UserOrders({ onClose, userId, onReviewProduct }: UserOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | 'all' | null>(null);

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Fetch all products once to avoid multiple fetches
      const allProducts = await fetchProducts();
      const productMap = new Map(allProducts.map(p => [p.id, p]));

      const data = await fetchUserOrders(userId);
      const ordersWithFullProduct = data.map(order => ({
          ...order,
          items: order.items.map(item => ({
              ...item,
              product: productMap.get(item.productId)
          }))
      }));

      setOrders(ordersWithFullProduct.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'delivered');
      toast.success('Order marked as delivered!');
      loadOrders();
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      toast.error('Failed to update order');
    }
  };
  
  const confirmDelete = async () => {
      if (!deleteTarget) return;
      try {
          if (deleteTarget === 'all') {
              await Promise.all(orders.map(order => deleteOrder(order.id)));
              toast.success('All orders cleared!');
          } else {
              await deleteOrder(deleteTarget);
              toast.success('Order deleted!');
          }
          loadOrders();
      } catch (e) {
          toast.error('Failed to delete order(s).');
      } finally {
          setDeleteTarget(null);
      }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'processing': case 'packed': return <Package className="w-5 h-5" />;
      case 'shipped': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    packed: 'bg-purple-100 text-purple-800 border-purple-200',
    shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusSteps = ['pending', 'processing', 'packed', 'shipped', 'delivered'];

  const getStatusProgress = (status: string) => {
    const index = statusSteps.indexOf(status);
    return ((index + 1) / statusSteps.length) * 100;
  };

  return (
    <>
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-pink-100">
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              My Orders
            </h1>
            <div className="flex items-center gap-2">
                {orders.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={() => setDeleteTarget('all')}>
                        <Trash2 className="w-4 h-4 mr-2"/>
                        Clear History
                    </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-6 h-6" />
                </Button>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6 space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-pink-200 mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
                <Button onClick={onClose} className="mt-4">
                  Start Shopping
                </Button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border border-pink-100 rounded-2xl p-4 md:p-6 space-y-4">
                  {/* Order Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-primary">₦{order.total.toLocaleString()}</p>
                         <Button size="sm" variant="ghost" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                            <ChevronDown className={`w-5 h-5 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order.id && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-6"
                        >
                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
                                    {getStatusIcon(order.status)}
                                </div>
                                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                </div>
                                
                                <div className="w-full bg-pink-100 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${getStatusProgress(order.status)}%` }}
                                />
                                </div>
                                <div className="grid grid-cols-5 gap-1 text-xs text-center">
                                {statusSteps.map((step, index) => {
                                    const isActive = statusSteps.indexOf(order.status) >= index;
                                    return (
                                    <div
                                        key={step}
                                        className={`py-1 ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                                    >
                                        {step}
                                    </div>
                                    );
                                })}
                                </div>
                            </div>

                            {/* Items */}
                             <div className="space-y-2 pt-2">
                                <p className="text-sm font-medium">Items ({order.items.length})</p>
                                <div className="space-y-2">
                                  {order.items.map((item, index) => (
                                      <OrderItemCard key={index} item={item} />
                                  ))}
                                </div>
                              </div>
                            
                            {/* History */}
                            {order.statusHistory && order.statusHistory.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <p className="text-sm font-medium">History</p>
                                    <div className="space-y-1">
                                        {order.statusHistory.map((historyItem, index) => (
                                            <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                <span className="font-medium">{historyItem.status.toUpperCase()}</span>
                                                <span className="flex-1 border-b border-dashed"></span>
                                                <span>{new Date(historyItem.timestamp).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {/* Actions */}
                            {order.status === 'shipped' && (
                                <Button
                                onClick={() => handleMarkAsDelivered(order.id)}
                                className="w-full bg-primary hover:bg-primary/90"
                                >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Order Received
                                </Button>
                            )}

                            {order.status === 'delivered' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center space-y-3">
                                  <div className="mx-auto">
                                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                                    <p className="text-sm font-medium text-green-800">Order Delivered!</p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-xs text-green-700 font-medium">Leave a review for your items:</p>
                                    {order.items.map(item => (
                                      <Button 
                                        key={item.productId}
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => onReviewProduct(item.productId!)} 
                                        className="w-full border-green-200 hover:bg-green-100 text-green-700"
                                      >
                                        Review "{item.product?.name || `Item`}"
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                            )}
                             <Button variant="destructive" size="sm" className="w-full" onClick={() => setDeleteTarget(order.id)}>
                                Delete Order
                            </Button>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>

          {/* Social Links Footer */}
          <div className="p-6 border-t border-pink-100 bg-pink-50/30 rounded-b-3xl">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-pink-600">Follow our dreamy journey ✨</p>
              <div className="flex gap-6">
                <a href="https://www.instagram.com/softgirlcore.ng?igsh=MWcxNHlqNmJlc3E5aw==" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white shadow-sm hover:scale-110 transition-transform text-pink-500">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white shadow-sm hover:scale-110 transition-transform text-black">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white shadow-sm hover:scale-110 transition-transform text-black">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                  </svg>
                </a>
              </div>
              <p className="text-xs text-muted-foreground">© 2025 Soft Girl Core. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete {deleteTarget === 'all' ? 'all your orders' : 'this order'}.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
