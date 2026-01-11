# 🌸 Soft Girl Core E-Commerce Setup Guide

## Welcome to Your Dreamy E-Commerce Store! 

Your fully functional e-commerce website is ready to use. Here's everything you need to know:

---

## 🎯 Features Included

### ✨ Customer Features
- **Beautiful Product Catalog** - Browse products with images, prices, ratings, and likes
- **Smart Search & Filters** - Find products by name, category, or filter by Featured/Trending/New
- **Product Details** - View full product information, multiple images, colors, and reviews
- **Shopping Cart** - Add items, adjust quantities, apply discount coupons
- **User Authentication** - Sign up and log in to save your cart across devices
- **Checkout Flow** - Complete purchase with Paystack payment integration
- **Reviews & Ratings** - Leave product reviews with star ratings
- **Wishlist (Likes)** - Like your favorite products

### 🔧 Admin Features
- **Product Management** - Create, edit, delete products
- **Inventory Control** - Set prices, discounts, categories
- **Coupon Management** - Create discount codes (percentage or fixed amount)
- **Order Management** - View all customer orders
- **Review Moderation** - Approve customer reviews
- **Product Flags** - Mark items as Featured, Trending, New Arrival, or Flash Sale

---

## 🚀 Getting Started

### First Time Setup

1. **Open the application** - The app will automatically create 6 demo products on first load
2. **Create an account** - Click the user icon in the top right to sign up
3. **Browse products** - Explore the product catalog
4. **Try the cart** - Add items to your cart and test the checkout flow

### Accessing Admin Dashboard

1. **Log in** with any account
2. Click the **"🔧 Admin Dashboard"** button (appears after login)
3. Manage products, orders, and coupons from the dashboard

---

## 💳 Payment Integration

### Paystack Setup (Required for Production)

The checkout currently uses a placeholder Paystack key. To enable real payments:

1. **Get your Paystack API key** from https://paystack.com
2. **Update `/src/app/components/Checkout.tsx`**:
   ```typescript
   const PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_ACTUAL_KEY_HERE';
   ```
3. **Integrate Paystack payment flow** using their React SDK or popup

---

## 🎨 Customization

### Colors & Theme
Edit `/src/styles/theme.css` to customize the pink/pastel color palette

### Fonts
Fonts are defined in `/src/styles/fonts.css`
- Playfair Display (headings)
- Poppins (body text)
- Quicksand (accent text)

### Adding Products
Use the Admin Dashboard to:
1. Click "Add Product"
2. Fill in product details (name, price, description, image URL)
3. Set flags (Featured, Trending, etc.)
4. Toggle visibility

---

## 📦 Database Structure

All data is stored in the Supabase KV store with these prefixes:

- `product:` - Product data
- `cart:` - User shopping carts
- `order:` - Order records
- `userOrders:` - User order history
- `review:` - Product reviews
- `coupon:` - Discount coupons
- `category:` - Product categories

---

## 🔐 User Authentication

Currently uses **localStorage** for demo purposes. In production:
- Integrate with Supabase Auth (already configured)
- Update Auth.tsx to use real Supabase authentication
- Add password reset functionality
- Implement social login (Google, Facebook)

---

## 🛍️ Using the Store

### As a Customer:
1. Sign up for an account
2. Browse products and add to cart
3. Apply discount codes at checkout
4. Complete purchase via Paystack
5. Leave reviews on purchased products

### As an Admin:
1. Access Admin Dashboard
2. Add new products with images
3. Create discount coupons
4. Monitor orders
5. Approve customer reviews

---

## 🎁 Pre-Created Demo Products

The app comes with 6 demo products:
- Pink Satin Bow
- Velvet Scrunchie Set
- Glossy Lip Tint
- Pearl Hair Clips
- Butterfly Claw Clip
- Heart Earrings

---

## 🌐 Features Overview

### Product Card
- Product image with hover zoom
- Name, short description
- Price with slash price (if discounted)
- Star rating and review count
- Like button with counter
- Quick "Add to Cart" on hover
- Badges for Flash Sale, New, Discount percentage

### Product Detail Page
- Image gallery with thumbnails
- Full description
- Color options
- Quantity selector
- Add to Cart / Buy Now buttons
- Customer reviews section
- Leave a review form
- Related products

### Shopping Cart
- Item list with thumbnails
- Quantity adjustment
- Remove items
- Coupon code input
- Subtotal and total calculation
- Proceed to checkout

### Checkout
- Shipping information form
- Order summary
- Coupon discount display
- Paystack payment integration
- Order confirmation

### Admin Dashboard
- Products tab: CRUD operations
- Orders tab: View all orders
- Coupons tab: Create discount codes
- Easy-to-use forms
- No coding required!

---

## 🎯 Next Steps

### For Production:
1. ✅ Add real Paystack keys
2. ✅ Upload your product images
3. ✅ Create your product catalog
4. ✅ Set up discount campaigns
5. ✅ Configure shipping options
6. ✅ Add terms & privacy policy pages
7. ✅ Set up customer email notifications

### Optional Enhancements:
- Product image upload (use Supabase Storage)
- User profile pages
- Order tracking
- Email marketing integration
- Social media sharing
- Product recommendations
- Inventory management
- Multi-currency support

---

## 🆘 Troubleshooting

**Products not loading?**
- Check browser console for errors
- Ensure backend server is running
- Clear browser cache and reload

**Cart not saving?**
- Make sure you're logged in
- Check localStorage for user data

**Checkout not working?**
- Verify Paystack key is set
- Check console for payment errors

---

## 🎨 Design Philosophy

This store embraces **Soft Girl Core** aesthetics:
- 💕 Soft pink and pastel colors
- ✨ Dreamy, feminine design
- 🎀 Rounded corners and smooth animations
- 💖 Glassmorphism effects
- 🌸 Elegant typography
- 🦋 Playful yet premium feel

---

## 📝 Important Notes

- **Demo Mode**: Currently using simulated authentication
- **Paystack**: Payment integration needs your API keys
- **Images**: Using Unsplash images for demo (replace with your own)
- **Security**: Not designed for storing sensitive PII in production

---

## 💖 Enjoy Your Store!

Your Soft Girl Core e-commerce website is ready to make your dreams come true! Start by exploring the products, testing the cart, and setting up your admin dashboard.

**Happy Selling! ✨🛍️💕**
