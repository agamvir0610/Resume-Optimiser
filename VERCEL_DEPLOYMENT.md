# 🚀 Deploy Your Resume Optimizer to Vercel

## Your Project Details:
- **Vercel Project**: `vercel.com/cvcrafter`
- **NextAuth Secret**: `sX7rN/LhbH+JLYSSAU7kSfkil7cQL24XWJp9QktNUWo=`

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `resume-optimizer` (or any name you prefer)
3. **Make it Public** (required for Vercel free tier)
4. **Click "Create repository"**

## Step 2: Push Your Code to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/resume-optimizer.git

# Push to GitHub
git push -u origin master
```

## Step 3: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com/cvcrafter
2. **Click "Import Project"**
3. **Connect GitHub** and select your repository
4. **Vercel will auto-detect Next.js** ✅

## Step 4: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```bash
# Database (get from Railway - see Step 5)
DATABASE_URL=postgresql://postgres:password@host:port/railway

# NextAuth
NEXTAUTH_URL=https://cvcrafter.vercel.app
NEXTAUTH_SECRET=sX7rN/LhbH+JLYSSAU7kSfkil7cQL24XWJp9QktNUWo=

# Google OAuth (Production - see Step 6)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Stripe (Production - see Step 7)
STRIPE_SECRET_KEY=sk_live_your-live-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

## Step 5: Set Up Production Database

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub
3. **Create New Project** → **Database** → **PostgreSQL**
4. **Copy the connection string** (looks like: `postgresql://postgres:password@host:port/railway`)
5. **Add it to Vercel** as `DATABASE_URL`

## Step 6: Configure Google OAuth (Production)

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create/Select Project**
3. **Enable Google+ API**
4. **Create OAuth 2.0 credentials**
5. **Add authorized redirect URIs**:
   - `https://cvcrafter.vercel.app/api/auth/callback/google`
6. **Copy Client ID and Secret** to Vercel

## Step 7: Configure Stripe (Production)

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com
2. **Switch to Live mode**
3. **Get your live secret key**
4. **Create webhook endpoint**:
   - URL: `https://cvcrafter.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`
5. **Copy webhook secret** to Vercel

## Step 8: Deploy!

1. **Click "Deploy"** in Vercel
2. **Wait for deployment** (2-3 minutes)
3. **Visit your live app**: https://cvcrafter.vercel.app

## Step 9: Run Database Migration

After deployment, run:
```bash
npx prisma db push
```

## Step 10: Test Your Live App

1. **Visit**: https://cvcrafter.vercel.app
2. **Test sign-up/sign-in**
3. **Test resume optimization**
4. **Test credit purchase**

## 🎉 You're Live!

Your Resume Optimizer is now public and ready for users!

### What Users Can Do:
- ✅ Sign up with Google or email/password
- ✅ Get 10 free credits
- ✅ Optimize resumes (5 credits each)
- ✅ Purchase more credits via Stripe
- ✅ Export optimized resumes

### Revenue Model:
- **Free tier**: 10 credits (2 optimizations)
- **Paid packages**: 20, 50, 100 credits
- **Pricing**: $9.99, $19.99, $34.99

## 🆘 Need Help?

1. **Check Vercel deployment logs**
2. **Verify all environment variables**
3. **Test database connectivity**
4. **Check Google OAuth redirect URIs**
5. **Verify Stripe webhook configuration**

**Congratulations! Your SaaS is now live! 🚀**
