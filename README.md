# 🌸 Soft Girl Core - E-Commerce Website

<div align="center">
  <h3>✨ A Dreamy, Feminine E-Commerce Platform ✨</h3>
  <p>Built with React, TypeScript, Tailwind CSS, and Firebase</p>
  <p><a href="https://github.com/Bobmatrix1/soft-girl-core"><strong>View Repository</strong></a></p>
</div>

---

## 🎀 About

**Soft Girl Core** is a fully functional, modern e-commerce website designed with a soft, feminine, and dreamy aesthetic. Perfect for fashion accessories, beauty products, and anything cute and pink! 💕

### ✨ Key Features

- 🛍️ **Complete E-Commerce Flow** - Browse → Cart → Checkout → Order
- 💳 **Payment Integration** - Paystack (placeholder ready)
- 👤 **User Authentication** - Sign up, log in, persistent sessions (Firebase Auth)
- 🔧 **Admin Dashboard** - Manage products, orders, and coupons
- ⭐ **Reviews & Ratings** - Customer reviews with admin approval
- 💝 **Wishlist System** - Like your favorite products
- 🎟️ **Discount Coupons** - Create and apply discount codes
- 📱 **Fully Responsive** - Beautiful on all devices
- ✨ **Smooth Animations** - Powered by Motion (Framer Motion)

---

## 🚀 Quick Start

### 1. First Launch

Open the application and it will automatically:
- Load the application
- Connect to Firebase services
- Display the beautiful storefront

### 2. Browse as Customer

- Explore products in the grid
- Search for items
- Filter by Featured, Trending, or New Arrivals
- Click any product to see details
- Like products with the heart button

### 3. Try Shopping

1. Click "Sign Up" (user icon in navbar)
2. Create an account
3. Add products to cart
4. Apply coupon codes (create them in admin)
5. Proceed to checkout

### 4. Access Admin Dashboard

1. Log in with any account
2. Click the **"🔧 Admin Dashboard"** button
3. Manage:
   - Products (create, edit, delete)
   - Orders (view all)
   - Coupons (create discount codes)

---

## 📦 What's Included

### Frontend Components

```
src/app/
├── App.tsx                    # Main application
├── components/
│   ├── Navbar.tsx            # Top navigation with cart
│   ├── Hero.tsx              # Rotating banner section
│   ├── ProductCard.tsx       # Product grid item
│   ├── ProductDetail.tsx     # Product modal
│   ├── Cart.tsx              # Shopping cart sidebar
│   ├── Auth.tsx              # Login/signup modal
│   ├── Checkout.tsx          # Checkout form
│   ├── AdminDashboard.tsx    # Admin panel
│   └── Footer.tsx            # Site footer
├── utils/
│   ├── api.ts                # Firebase Data interactions
│   ├── firebase.ts           # Firebase Configuration
│   └── cloudinary.ts         # Cloudinary Uploads
```

### Backend

The application uses **Firebase** as a backend-as-a-service (BaaS).
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Cloudinary (Media) & Firebase Storage

---

## 🎨 Design System

### Color Palette

- **Background**: Soft blush pink (#fef5f8)
- **Primary**: Pink (#ff9ec9)
- **Secondary**: Light pink (#ffd4e5)
- **Accent**: Medium pink (#ffb3d9)
- **Text**: Dark purple (#2d1b2e)

### Fonts

- **Playfair Display** - Elegant headings
- **Poppins** - Modern body text
- **Quicksand** - Soft accents

### Aesthetic

- Rounded corners (1rem)
- Soft shadows and gradients
- Glassmorphism effects
- Smooth hover animations
- Dreamy, feminine vibe

---

## 🔧 Configuration

### Payment Setup (Required)

Update `/src/app/components/Checkout.tsx`:

```typescript
const PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_KEY_HERE';
```

Get your key from: https://paystack.com

### Firebase Setup

The project includes a default configuration in `/src/app/utils/firebase.ts`. For production, create your own Firebase project:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a Web App
4. Copy the config object
5. Replace the `firebaseConfig` in `/src/app/utils/firebase.ts`

### Cloudinary Setup

Update `/src/app/utils/cloudinary.ts` with your Cloudinary credentials for image uploads.

---

## 📊 Database Structure

All data is stored in **Cloud Firestore** collections:

| Collection | Description |
|------------|-------------|
| `products` | Product catalog |
| `carts` | User shopping carts |
| `orders` | Completed orders |
| `reviews` | Product reviews |
| `coupons` | Discount codes |
| `categories` | Product categories |
| `banners` | Home page banners |
| `settings` | Global settings (shipping, etc) |

---

## 🎯 User Flows

### Customer Journey

```
Browse Products → View Details → Add to Cart → Sign Up/Login → 
Apply Coupon → Checkout → Payment → Order Confirmation
```

### Admin Journey

```
Login → Admin Dashboard → Create Products → Set Prices → 
Create Coupons → View Orders → Approve Reviews
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **UI Components**: Radix UI
- **Backend**: Firebase (Firestore, Auth)
- **Media**: Cloudinary
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: Sonner (Toast)

---

## 📱 Responsive Design

- **Mobile**: Single column grid
- **Tablet**: 2 column grid
- **Desktop**: 3-4 column grid
- Touch-friendly buttons
- Collapsible navigation
- Optimized images

---

## ✨ Features in Detail

### Product Management
- Bulk upload ready
- Image gallery support
- Color variants
- Inventory tracking
- Visibility toggle
- Category assignment

### Shopping Experience
- Real-time search
- Smart filters
- Product quick view
- Zoom images
- Compare prices
- Save favorites

### Checkout Process
- Guest checkout option
- Saved addresses
- Multiple payment methods
- Order summary
- Discount application
- Email confirmation

### Admin Tools
- Dashboard analytics ready
- Order management
- Customer insights
- Inventory control
- Marketing tools
- Report generation ready

---

## 🎁 Demo Products

6 pre-loaded products:

1. **Pink Satin Bow** - $12.99
2. **Velvet Scrunchie Set** - $15.99
3. **Glossy Lip Tint** - $9.99
4. **Pearl Hair Clips** - $14.99
5. **Butterfly Claw Clip** - $8.99
6. **Heart Earrings** - $16.99

---

## 📚 Documentation

- **SETUP.md** - Detailed setup guide
- **FEATURES.md** - Complete feature list
- **README.md** - This file

---

## 🔒 Security Notes

- Uses Firebase Authentication
- Firestore Security Rules (ensure these are configured in your Firebase console)
- CORS enabled for frontend
- Input validation on forms
- User data isolation

**⚠️ Note**: This is a demo/prototype. For production:
- Implement proper authentication
- Add rate limiting
- Use HTTPS only
- Secure API keys
- Add CSRF protection

---

## 🎨 Customization

### Change Colors

Edit `/src/styles/theme.css`:

```css
:root {
  --primary: #ff9ec9;      /* Your pink */
  --secondary: #ffd4e5;    /* Your light pink */
  --background: #fef5f8;   /* Your background */
}
```

### Change Fonts

Edit `/src/styles/fonts.css`:

```css
@import url('YOUR_GOOGLE_FONT_URL');
```

### Modify Layout

All components in `/src/app/components/` are fully customizable!

---

## 🚀 Deployment Ready

This app is ready to deploy on:
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting

Backend uses Firebase (Serverless).

---

## 💖 Perfect For

- 🎀 Fashion & Accessories stores
- 💄 Beauty & Cosmetics shops
- 🎁 Handmade crafts & gifts
- 👗 Boutique clothing stores
- 🧸 Kawaii & cute products
- 💝 Girl-owned businesses
- 🌸 Soft aesthetic brands

---

## 🎯 What's Next?

### Immediate:
1. Add your Paystack API key
2. Configure Firebase project
3. Customize colors/fonts
4. Create your product catalog
5. Set up discount campaigns

### Later:
- Email marketing integration
- Social media sharing
- Product recommendations
- Loyalty program
- Multi-language support
- Advanced analytics

---

## 🆘 Support

### Common Issues

**Products not loading?**
- Check browser console
- Verify Firebase config is correct
- Clear cache and reload

**Cart not saving?**
- Ensure user is logged in
- Check localStorage

**Checkout failing?**
- Add Paystack API key
- Check payment configuration

---

## 📄 License

This project is open for personal and commercial use. Built with love for entrepreneurs! 💕

---

## 🌟 Credits

- **Design**: Soft Girl Core aesthetic
- **Icons**: Lucide React
- **Images**: Unsplash (demo only)
- **Fonts**: Google Fonts

---

<div align="center">
  <h3>Made with 💖 for girl bosses, by girl bosses</h3>
  <p>Start your dreamy e-commerce journey today! ✨</p>
  
  **#SoftGirlCore #ECommerce #GirlBoss #SmallBusiness**
</div>

---

## 🎉 Ready to Launch!

Your beautiful e-commerce store is ready to go. Just add your products, configure payment, and start selling! 

**Happy selling! 🛍️💕✨**
