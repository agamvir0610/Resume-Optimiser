# 🚀 Production Deployment Guide

## Step 1: Database Setup (Railway)

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub
3. **Create New Project** → **Database** → **PostgreSQL**
4. **Copy the connection string** (looks like: `postgresql://postgres:password@host:port/railway`)

## Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up** with GitHub
3. **Import your repository**
4. **Set environment variables**:

### Required Environment Variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@host:port/railway

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth (Production)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_your-live-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

## Step 3: Configure Google OAuth

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create/Select Project**
3. **Enable Google+ API**
4. **Create OAuth 2.0 credentials**
5. **Add authorized redirect URIs**:
   - `https://your-app.vercel.app/api/auth/callback/google`
6. **Copy Client ID and Secret**

## Step 4: Configure Stripe

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com
2. **Switch to Live mode**
3. **Get your live secret key**
4. **Create webhook endpoint**:
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`
5. **Copy webhook secret**

## Step 5: Run Database Migrations

After deployment, run:
```bash
npx prisma db push
```

## Step 6: Test Your Deployment

1. **Visit your app**: `https://your-app.vercel.app`
2. **Test sign-up/sign-in**
3. **Test resume optimization**
4. **Test credit purchase**

## Step 7: Custom Domain (Optional)

1. **Buy domain** from Namecheap/GoDaddy
2. **In Vercel**: Project Settings → Domains
3. **Add your domain**
4. **Update DNS records** as instructed
5. **Update NEXTAUTH_URL** to your custom domain
6. **Update Google OAuth** redirect URIs
7. **Update Stripe** webhook URL

## Cost Breakdown:

- **Vercel**: Free tier (100GB bandwidth/month)
- **Railway**: $5/month for PostgreSQL
- **Domain**: $10-15/year
- **Total**: ~$5-10/month

## Security Checklist:

- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Environment variables secured
- ✅ Database connection encrypted
- ✅ Stripe webhook signature verification
- ✅ NextAuth secret configured
- ✅ CORS properly configured
