# 🌸 Quick Start Guide

## Get Started in 5 Minutes! ⚡

### Step 1: Launch the App 🚀
Just open the application! That's it. The app will automatically:
- ✅ Create 6 beautiful demo products
- ✅ Set up your database
- ✅ Display your storefront

### Step 2: Try Shopping 🛍️

**As a Customer:**

1. **Browse products** - Scroll through the beautiful grid
2. **Click a product** - See full details, reviews, and images
3. **Add to cart** - Click the pink "Add to Cart" button
4. **Sign up** - Click the user icon (top right) and create an account
5. **Checkout** - Open cart, add a coupon (try `SAVE10`), and proceed to checkout

**As an Admin:**

1. **Log in** - Use any account
2. **Open Admin Dashboard** - Click "🔧 Admin Dashboard" button
3. **Create a product**:
   - Click "Add Product"
   - Fill in: Name, Price, Description, Image URL
   - Toggle: Featured, Trending, New Arrival, Flash Sale
   - Click "Create Product"
4. **Create a coupon**:
   - Go to "Coupons" tab
   - Click "Add Coupon"
   - Code: `SAVE20`
   - Type: Percentage
   - Value: `20`
   - Click "Create Coupon"

---

## 🎯 Essential Features to Try

### 1. Search Products
Type in the search bar: "bow", "scrunchie", "lip gloss"

### 2. Filter Products
Click the filter buttons:
- ✨ Featured
- 📈 Trending
- ⚡ New Arrivals

### 3. Like Products
Click the heart ❤️ on any product card

### 4. Leave a Review
1. Click a product
2. Scroll to "Leave a Review"
3. Select stars and write a comment
4. Submit (requires login)

### 5. Apply Coupons
1. Add items to cart
2. Enter coupon code (create one in Admin first!)
3. Click "Apply"

---

## 🔧 Important Configuration

### Payment Setup (REQUIRED for real payments)

**File:** `/src/app/components/Checkout.tsx`

**Line 23:** Replace placeholder with your key:
```typescript
const PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_ACTUAL_KEY';
```

**Get your key:** https://paystack.com

---

## 📦 Demo Products Included

Your store comes pre-loaded with:

1. **Pink Satin Bow** - $12.99 (was $18.99) 🎀
2. **Velvet Scrunchie Set** - $15.99 (was $24.99) 🌸
3. **Glossy Lip Tint** - $9.99 💄
4. **Pearl Hair Clips** - $14.99 (was $19.99) 📌
5. **Butterfly Claw Clip** - $8.99 🦋
6. **Heart Earrings** - $16.99 💝

---

## 🎨 Customization Tips

### Change Brand Colors
**File:** `/src/styles/theme.css`
```css
:root {
  --primary: #ff9ec9;      /* Main pink */
  --secondary: #ffd4e5;    /* Light pink */
  --background: #fef5f8;   /* Page background */
}
```

### Change Store Name
**File:** `/src/app/components/Navbar.tsx` and `/src/app/components/Footer.tsx`
```tsx
<span>Soft Girl Core</span>  // Change this text
```

### Add Your Logo
Replace the `<Sparkles />` icon in Navbar.tsx with:
```tsx
<img src="your-logo.png" alt="Logo" className="w-6 h-6" />
```

---

## 🆘 Troubleshooting

### ❌ Products Not Showing?
- Open browser console (F12)
- Look for errors
- Try refreshing the page
- Check if backend server is running

### ❌ Cart Not Saving?
- Make sure you're logged in
- Check localStorage (DevTools → Application → Local Storage)
- Try logging out and back in

### ❌ Checkout Not Working?
- Verify you added Paystack key
- Check console for payment errors
- Ensure items are in cart

### ❌ Admin Dashboard Not Opening?
- Make sure you're logged in
- Look for the admin button below the hero section
- Check browser console for errors

---

## 💡 Pro Tips

### For Best Results:

1. **Use High-Quality Images**
   - Square format (1:1 ratio)
   - At least 800x800px
   - Clear product shots
   - Consistent lighting

2. **Write Great Descriptions**
   - Short description: 1 sentence (shows on card)
   - Full description: 2-3 paragraphs (shows on detail page)
   - Include benefits, not just features

3. **Set Smart Prices**
   - Use slash prices to show discounts
   - Round to .99 for psychological pricing
   - Mark flash sales for urgency

4. **Organize with Categories**
   - Keep categories consistent
   - Use clear, simple names
   - Examples: "Hair Accessories", "Beauty", "Jewelry"

5. **Create Compelling Coupons**
   - Use memorable codes: WELCOME10, SPRING20
   - Set expiration dates for urgency
   - Require minimum purchase for profitability

---

## 📱 Test on Mobile

1. Open browser DevTools (F12)
2. Click device toolbar icon
3. Select "iPhone 12" or similar
4. Test all features:
   - Navigation menu
   - Product cards
   - Cart sidebar
   - Checkout form

---

## 🎉 You're Ready!

Your soft girl core e-commerce store is fully functional and ready to sell! 

### Next Steps:
1. ✅ Add your products
2. ✅ Set up payment (Paystack key)
3. ✅ Customize colors & branding
4. ✅ Create discount campaigns
5. ✅ Share with customers!

---

## 📚 More Help

- **Full Setup Guide**: See `SETUP.md`
- **Feature List**: See `FEATURES.md`
- **Complete Docs**: See `README.md`

---

## 💖 Need Help?

Common questions:

**Q: How do I add my own products?**
A: Use the Admin Dashboard → Products → Add Product

**Q: How do I change the pink colors?**
A: Edit `/src/styles/theme.css`

**Q: Where do I add my Paystack key?**
A: Edit `/src/app/components/Checkout.tsx` line 23

**Q: Can customers checkout without an account?**
A: Currently requires login (easy to customize)

**Q: How do I approve reviews?**
A: Admin Dashboard → will add review tab (approve reviews per product)

**Q: Can I add more product images?**
A: Yes! Add an `images` array when creating products

---

<div align="center">
  <h3>🌸 Happy Selling! 🛍️</h3>
  <p>Made with 💕 for girl bosses!</p>
</div>

---

## 🎀 Quick Commands Cheat Sheet

```bash
# View all products
Admin Dashboard → Products Tab

# Create new product
Admin Dashboard → Add Product → Fill Form → Create

# Create coupon
Admin Dashboard → Coupons Tab → Add Coupon

# View orders
Admin Dashboard → Orders Tab

# Test checkout
Add to Cart → View Cart → Proceed to Checkout

# Apply discount
Cart → Enter Code → Apply

# Leave review  
Product Detail → Scroll Down → Write Review
```

---

**You're all set! Start building your dream store! ✨💖🌸**
