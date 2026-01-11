import { db, auth } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  setDoc,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { uploadToCloudinary } from './cloudinary';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  slashPrice?: number;
  image: string;
  images?: string[];
  category: string;
  colors?: string[];
  sizes?: string[];
  rating: number;
  reviewCount: number;
  likes: number;
  visible?: boolean;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  flashSale?: boolean;
  stockQuantity?: number;
  status?: 'in_stock' | 'out_of_stock' | 'restocking';
  restockDate?: string;
  sales?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  approved: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  discount?: number;
  couponCode?: string;
  shippingFee?: number;
  status: string;
  createdAt: string;
  statusUpdatedAt?: string;
  statusHistory?: { status: string; timestamp: string }[];
  shippingDetails?: any;
  paymentReference?: string;
  paymentStatus?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiresAt?: string;
  minPurchase?: number;
}

export interface ShippingSettings {
  id?: string;
  type: 'flat_rate';
  rate: number;
  freeShippingThreshold: number | null;
  isFreeShippingEnabled: boolean;
}

export interface Notification {
    id: string;
    userId?: string; // Optional for announcements
    message: string;
    type: 'announcement' | 'restock';
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    mediaType?: 'image' | 'video';
    order: number;
}

// Helper to convert Firestore data to our types
const convertDoc = <T>(docSnapshot: any): T => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
  } as T;
};

// Products
export const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => convertDoc<Product>(doc));
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return convertDoc<Product>(docSnap);
  } else {
    throw new Error('Product not found');
  }
};

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const productData = {
    ...product,
    createdAt: new Date().toISOString(),
    likes: 0,
    rating: 0,
    reviewCount: 0,
    sales: 0
  };
  const docRef = await addDoc(collection(db, 'products'), productData);
  return { id: docRef.id, ...productData } as Product;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, updates);
  return fetchProduct(id);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'products', id));
};

export const likeProduct = async (id: string): Promise<number> => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const currentLikes = docSnap.data().likes || 0;
    const newLikes = currentLikes + 1;
    await updateDoc(docRef, { likes: newLikes });
    return newLikes;
  }
  return 0;
};

// Cart
export const fetchCart = async (userId: string) => {
  const docRef = doc(db, 'carts', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return { items: [] };
};

export const updateCart = async (userId: string, cart: { items: CartItem[] }) => {
  const docRef = doc(db, 'carts', userId);
  const sanitizedItems = cart.items.map(item => {
    const sanitizedItem: any = { ...item };
    Object.keys(sanitizedItem).forEach(key => {
      if (sanitizedItem[key] === undefined) {
        delete sanitizedItem[key];
      }
    });
    return sanitizedItem;
  });
  await setDoc(docRef, { items: sanitizedItems }, { merge: true });
  return { items: sanitizedItems };
};

// Orders
export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  const orderData = {
    ...order,
    createdAt: new Date().toISOString(),
    status: order.status || 'pending',
    statusHistory: [{ status: order.status || 'pending', timestamp: new Date().toISOString() }]
  };
  
  // Create the order document
  const docRef = await addDoc(collection(db, 'orders'), orderData);

  // Update stock and sales for each item in the order
  try {
    const batch = writeBatch(db);
    for (const item of (order.items || [])) {
        const productRef = doc(db, 'products', item.productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
            const currentData = productSnap.data();
            const currentStock = currentData.stockQuantity || 0;
            const currentSales = currentData.sales || 0;
            
            batch.update(productRef, {
                stockQuantity: Math.max(0, currentStock - item.quantity),
                sales: currentSales + item.quantity
            });
        }
    }
    await batch.commit();
  } catch (e) {
      console.error("Failed to update stock/sales after order:", e);
  }

  return { id: docRef.id, ...orderData } as Order;
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => convertDoc<Order>(doc));
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => convertDoc<Order>(doc));
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  const docRef = doc(db, 'orders', orderId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Order not found');
  }

  const currentData = docSnap.data();
  const history = currentData.statusHistory || [];
  
  const updates = {
    status,
    statusUpdatedAt: new Date().toISOString(),
    statusHistory: [...history, { status, timestamp: new Date().toISOString() }]
  };
  
  await updateDoc(docRef, updates);

  // If the order is shipped, create a notification for the user
  if (status === 'shipped') {
    const userId = currentData.userId;
    if (userId) {
        const notification: Partial<Notification> = {
            userId,
            message: `Your order #${orderId.slice(0, 8)} has been shipped!`,
            type: 'order',
            link: '/orders' // A link to the orders page
        };
        const notifRef = doc(collection(db, `users/${userId}/notifications`));
        await setDoc(notifRef, {
            ...notification,
            createdAt: new Date().toISOString(),
            isRead: false
        });
    }
  }
  
  return { ...convertDoc<Order>(docSnap), ...updates };
};

export const deleteOrder = async (orderId: string): Promise<void> => {
    await deleteDoc(doc(db, 'orders', orderId));
};

// Reviews
export const fetchReviews = async (productId: string): Promise<Review[]> => {
  const q = query(collection(db, 'reviews'), where("productId", "==", productId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => convertDoc<Review>(doc));
};

export const createReview = async (review: Partial<Review>): Promise<Review> => {
  const reviewData = {
    ...review,
    createdAt: new Date().toISOString(),
    approved: true // Auto-approve for now, can be changed later
  };
  const docRef = await addDoc(collection(db, 'reviews'), reviewData);
  
  // Update product stats
  try {
    const productRef = doc(db, 'products', review.productId!);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
        const productData = productSnap.data();
        const currentCount = productData.reviewCount || 0;
        const currentRating = productData.rating || 0;
        
        const newCount = currentCount + 1;
        // Simple moving average approximation
        const newRating = ((currentRating * currentCount) + (review.rating || 0)) / newCount;
        
        await updateDoc(productRef, {
            reviewCount: newCount,
            rating: Math.round(newRating * 10) / 10
        });
    }
  } catch (e) {
      console.error("Failed to update product stats", e);
  }

  return { id: docRef.id, ...reviewData } as Review;
};

export const approveReview = async (productId: string, reviewId: string): Promise<Review> => {
  const docRef = doc(db, 'reviews', reviewId);
  await updateDoc(docRef, { approved: true });
  const docSnap = await getDoc(docRef);
  return convertDoc<Review>(docSnap);
};

// Coupons
export const fetchCoupon = async (code: string): Promise<Coupon> => {
  const q = query(collection(db, 'coupons'), where("code", "==", code));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    return convertDoc<Coupon>(querySnapshot.docs[0]);
  }
  throw new Error('Coupon not found');
};

export const createCoupon = async (coupon: Coupon): Promise<Coupon> => {
  const docRef = await addDoc(collection(db, 'coupons'), coupon);
  return { id: docRef.id, ...coupon };
};

export const updateCoupon = async (id: string, updates: Partial<Coupon>): Promise<Coupon> => {
    const docRef = doc(db, 'coupons', id);
    await updateDoc(docRef, updates);
    const docSnap = await getDoc(docRef);
    return convertDoc<Coupon>(docSnap);
};

export const fetchAllCoupons = async (): Promise<Coupon[]> => {
  const querySnapshot = await getDocs(collection(db, 'coupons'));
  return querySnapshot.docs.map(doc => convertDoc<Coupon>(doc));
};

export const deleteCoupon = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'coupons', id));
};

// Categories
export const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createCategory = async (category: { name: string; description?: string }) => {
  const docRef = await addDoc(collection(db, 'categories'), category);
  return { id: docRef.id, ...category };
};

export const updateCategory = async (id: string, updates: { name: string }) => {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, updates);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'categories', id));
};

// Subscriptions
export const subscribeToRestock = async (subscription: { productId: string; userId: string; email: string }) => {
  const subData = {
    ...subscription,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  await addDoc(collection(db, 'restock_subscriptions'), subData);
};

export const fetchAllSubscriptions = async (): Promise<any[]> => {
    const querySnapshot = await getDocs(collection(db, 'restock_subscriptions'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Notifications
export const createAnnouncement = async (notification: Partial<Notification>) => {
    const notifData = {
        ...notification,
        createdAt: new Date().toISOString(),
        isRead: false
    };
    await addDoc(collection(db, 'announcements'), notifData);
};

export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
    let allNotifications: Notification[] = [];

    // Query for user-specific notifications
    const userNotifQuery = query(collection(db, `users/${userId}/notifications`));
    const userNotifSnapshot = await getDocs(userNotifQuery);
    const userNotifications = userNotifSnapshot.docs.map(doc => convertDoc<Notification>(doc));
    allNotifications = allNotifications.concat(userNotifications);
    
    // Query for global announcements
    const globalNotifQuery = query(collection(db, 'announcements'));
    const globalNotifSnapshot = await getDocs(globalNotifQuery);
    const globalNotifications = globalNotifSnapshot.docs.map(doc => convertDoc<Notification>(doc));
    allNotifications = allNotifications.concat(globalNotifications);

    // Combine and sort by date
    allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return allNotifications;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    const notificationsRef = collection(db, `users/${userId}/notifications`);
    const querySnapshot = await getDocs(notificationsRef);
    
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
        if (doc.data().isRead === false) {
            batch.update(doc.ref, { isRead: true });
        }
    });
    await batch.commit();
};

export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
    const docRef = doc(db, `users/${userId}/notifications`, notificationId);
    try {
      await updateDoc(docRef, { isRead: true });
    } catch(e) {
      console.log("Could not mark announcement as read (this is expected).");
    }
};

export const deleteAllNotifications = async (userId: string): Promise<void> => {
    const q = query(collection(db, `users/${userId}/notifications`));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
};

export const deleteAllAnnouncements = async (): Promise<void> => {
    const querySnapshot = await getDocs(collection(db, 'announcements'));
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
};

export const notifySubscribers = async (productId: string, product: Product) => {
    const q = query(collection(db, 'restock_subscriptions'), where("productId", "==", productId), where("status", "==", "pending"));
    const subsSnapshot = await getDocs(q);
    
    if (subsSnapshot.empty) {
        return;
    }

    const batch = writeBatch(db);
    subsSnapshot.forEach(subDoc => {
        const sub = subDoc.data();
        const notification: Partial<Notification> = {
            message: `Good news! "${product.name}" is back in stock.`,
            type: 'restock',
            link: productId, // Just store the ID for easy navigation
        };
        const notifRef = doc(collection(db, `users/${sub.userId}/notifications`));
        batch.set(notifRef, {
            ...notification,
            createdAt: new Date().toISOString(),
            isRead: false
        });
        batch.update(subDoc.ref, { status: 'notified' });
    });

    await batch.commit();
};


// Banners
export const fetchBanners = async (): Promise<Banner[]> => {
  const q = query(collection(db, 'banners'), orderBy("order"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => convertDoc<Banner>(doc));
};

export const createBanner = async (banner: Partial<Banner>): Promise<Banner> => {
  const docRef = await addDoc(collection(db, 'banners'), banner);
  return { id: docRef.id, ...banner } as Banner;
};

export const updateBanner = async (id: string, updates: Partial<Banner>): Promise<void> => {
  const docRef = doc(db, 'banners', id);
  await updateDoc(docRef, updates);
};

export const deleteBanner = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'banners', id));
};

// File Uploads
export const uploadFile = async (file: File): Promise<string> => {
  return uploadToCloudinary(file);
};

// Shipping Settings
export const fetchShippingSettings = async (): Promise<ShippingSettings> => {
  try {
    const docRef = doc(db, 'settings', 'shipping');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ShippingSettings;
    }
  } catch (error) {
    console.warn("Error fetching shipping settings (likely permission issue), using defaults:", error);
  }
  
  // Default settings if not found or error occurs
  return {
    type: 'flat_rate',
    rate: 0,
    freeShippingThreshold: null,
    isFreeShippingEnabled: false
  };
};

export const updateShippingSettings = async (settings: ShippingSettings): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', 'shipping');
    const { id, ...data } = settings; // Remove ID before saving
    await setDoc(docRef, data);
  } catch (error) {
    console.error("Error updating shipping settings:", error);
    throw new Error("Failed to save settings. Please check Firestore permissions for 'settings' collection.");
  }
};