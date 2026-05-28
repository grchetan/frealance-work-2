# 🚀 Production Deployment & Cloud Integration Guide

This guide will walk you through the process of connecting the **Mahesvari Kachori** frontend with a real, live cloud database and authentication system (Firebase Auth + Supabase SQL Database) to get your e-commerce platform production-ready and live!

---

## 1. Firebase Authentication Setup (Security & Login)

Firebase handles secure user authentication (SignUp, SignIn, SignOut, session states, and passwords).

### Steps:
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Name your project (e.g., `mahesvari-kachori-live`) and complete the creation steps.
3. In the sidebar, navigate to **Build > Authentication** and click **Get Started**.
4. Under **Sign-in method**, choose **Email/Password**, toggle **Enable**, and click **Save**.
5. Go to **Project Settings** (the gear icon near the top left).
6. Under **Your apps**, click the **Web icon (`</>`)** to register a new Web App. Name it `Mahesvari E-commerce`.
7. Once registered, look for the `firebaseConfig` object in the script snippet. It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
8. **Save these values!** You will put them in your environment file.

---

## 2. Supabase SQL Database & Storage Setup

Supabase acts as your primary database ledger, storing products, customer profiles, order transit tracking logs, dynamic banners, and catalog reviews.

### Steps:
1. Go to [Supabase](https://supabase.com/) and click **Sign Up / Sign In**.
2. Click **New Project** and select an organization. Name your project (e.g., `mahesvari-database`) and set a secure Database Password. Choose a hosting region closest to your main customers (e.g., *Mumbai (ap-south-1)* for India).
3. Once the database is provisioned, go to the **SQL Editor** tab in the left-hand sidebar (the icon looks like `>_`).
4. Click **New Query** to create a blank script editor.
5. Open the PostgreSQL schema setup script provided in the project under [scratch/supabase_schema.sql](file:///e:/My%20Projects/Frealance%20Project/mahesvari-kachori/scratch/supabase_schema.sql).
6. **Copy all contents** of `supabase_schema.sql`, paste them into the Supabase SQL editor, and click **Run** (at the bottom right).
7. *This script automatically creates all 6 tables (`users`, `products`, `addresses`, `orders`, `banners`, `reviews`), sets up primary keys, foreign relation constraints, and seeds the initial catalog products (Heritage Kachoris, Masalas, Combos, etc.) with exact prices and descriptions!*
8. Next, go to the **Project Settings** (gear icon) in the sidebar.
9. Click **API** to copy:
   * **Project URL**: (e.g., `https://your-id.supabase.co`)
   * **API Key (anon/public)**: (e.g., `eyJhbG...`)

---

## 3. Environment Variables Configuration

Now, bind the frontend to your real live services.

### Steps:
1. Create a new file in the root of your project folder (`e:\My Projects\Frealance Project\mahesvari-kachori`) named exactly `.env`.
2. Copy and paste the template below, replacing the placeholder text with your actual Firebase and Supabase keys:

```env
# ==========================================
# 🌿 SUPABASE CLOUD DATABASE CONFIGURATION
# ==========================================
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key-here

# ==========================================
# 🔥 FIREBASE AUTHENTICATION CONFIGURATION
# ==========================================
VITE_FIREBASE_API_KEY=your-firebase-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id-here
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
VITE_FIREBASE_APP_ID=your-app-id-here
```

3. Save the `.env` file and **restart your local server** (`npm run dev`). 
4. The application will detect the environment variables and seamlessly switch from **Simulator Mode** to **Live Cloud Mode** instantly!

---

## 4. Live Verification & Testing

Once connected to the cloud, you can test operations:
1. Open `http://localhost:5173/` and navigate to **Sign In** (via user icon in navbar).
2. Create a new account. This registers the user securely in Firebase Auth and pushes their profile to Supabase `users` database table simultaneously.
3. Place an order on the store. It will create a live transaction record, compute invoice taxes, and place it in the live Supabase `orders` ledger.
4. **Accessing the Admin Console**:
   * Navigate to `http://localhost:5173/?view=admin-portal` or `http://localhost:5173/?admin=true`.
   * Log in with your admin credentials.
   * You can add, edit, or delete products live, update orders, moderate reviews, and modify announcement banners! Any product added here will save directly to Supabase and update on the storefront in real-time.

---

## 5. Going Live (Production Deployment)

To deploy the website so that users worldwide can access it:

### Build for Production:
Run this command in your terminal to build highly-optimized production assets:
```bash
npm run build
```
This generates a static compiled folder named `/dist` in your root workspace containing clean minified HTML, CSS, and JS chunks.

### Hosting Options:
You can host this static folder for **FREE** on premium platforms:

1. **Vercel (Recommended - Easiest)**:
   * Sign up at [Vercel](https://vercel.com/) and connect your GitHub repository.
   * Vercel will auto-detect the Vite project. Set the Output Directory to `dist`.
   * Under **Environment Variables**, copy-paste your `.env` keys.
   * Click **Deploy**. Vercel will give you a premium public URL (e.g., `https://mahesvari-kachori.vercel.app`) with free SSL certificates!
2. **Netlify**:
   * Drag and drop the compiled `/dist` folder directly onto [Netlify](https://www.netlify.com/) dashboard to host instantly.
3. **Firebase Hosting**:
   * Run `npx firebase-tools init hosting` and deploy directly onto Firebase servers.

---
💡 *For any questions regarding spice parameters, pricing adjustments, or deployment configurations, refer to the source files or drop a query to our developer lead!*
