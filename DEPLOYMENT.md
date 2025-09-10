# 🚀 Resume Optimizer - Production Deployment Guide

## 📋 Pre-Deployment Checklist

- [x] ✅ Application builds successfully (`npm run build`)
- [x] ✅ All TypeScript errors resolved
- [x] ✅ Environment variables documented
- [x] ✅ Database schema ready
- [x] ✅ Stripe integration complete
- [x] ✅ Authentication system working

## 🎯 Recommended Deployment Stack

**Frontend + API**: Vercel (Free tier)
**Database**: Railway PostgreSQL ($5/month)
**Domain**: Namecheap/GoDaddy ($10-15/year)

**Total Cost**: ~$5-10/month

## 📝 Step-by-Step Deployment

### Step 1: Set Up Production Database

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub
3. **Create New Project** → **Database** → **PostgreSQL**
4. **Copy the connection string** (looks like: `postgresql://postgres:password@host:port/railway`)

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up** with GitHub
3. **Import your repository**
4. **Set environment variables**:

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

### Step 3: Configure Google OAuth (Production)

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create/Select Project**
3. **Enable Google+ API**
4. **Create OAuth 2.0 credentials**
5. **Add authorized redirect URIs**:
   - `https://your-app.vercel.app/api/auth/callback/google`
6. **Copy Client ID and Secret**

### Step 4: Configure Stripe (Production)

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com
2. **Switch to Live mode**
3. **Get your live secret key**
4. **Create webhook endpoint**:
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`
5. **Copy webhook secret**

### Step 5: Run Database Migrations

After deployment, run:
```bash
npx prisma db push
```

### Step 6: Test Your Deployment

1. **Visit your app**: `https://your-app.vercel.app`
2. **Test sign-up/sign-in**
3. **Test resume optimization**
4. **Test credit purchase**

## 🔧 Quick Deploy Commands

```bash
# Run deployment script
./scripts/deploy.sh

# Or manually:
npm run build
# Then follow Vercel/Railway instructions
```

## 🌐 Custom Domain Setup (Optional)

1. **Buy domain** from Namecheap/GoDaddy
2. **In Vercel**: Project Settings → Domains
3. **Add your domain**
4. **Update DNS records** as instructed
5. **Update NEXTAUTH_URL** to your custom domain
6. **Update Google OAuth** redirect URIs
7. **Update Stripe** webhook URL

## 💰 Cost Breakdown

- **Vercel**: Free tier (100GB bandwidth/month)
- **Railway**: $5/month for PostgreSQL
- **Domain**: $10-15/year
- **Total**: ~$5-10/month

## 🔒 Security Checklist

- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Environment variables secured
- ✅ Database connection encrypted
- ✅ Stripe webhook signature verification
- ✅ NextAuth secret configured
- ✅ CORS properly configured

## 🚨 Common Issues & Solutions

### Issue: Build fails on Vercel
**Solution**: Check environment variables are set correctly

### Issue: Database connection fails
**Solution**: Verify DATABASE_URL format and credentials

### Issue: Google OAuth doesn't work
**Solution**: Check redirect URIs match exactly

### Issue: Stripe webhooks fail
**Solution**: Verify webhook URL and secret

## 📞 Support

If you encounter issues:
1. Check the deployment logs in Vercel
2. Verify all environment variables
3. Test locally with production env vars
4. Check database connectivity

## 🎉 Success!

Once deployed, your Resume Optimizer will be live at:
`https://your-app.vercel.app`

Users can:
- ✅ Sign up with Google or email/password
- ✅ Get 10 free credits
- ✅ Optimize resumes (5 credits each)
- ✅ Purchase more credits via Stripe
- ✅ Export optimized resumes

**Congratulations! Your SaaS is now live! 🚀**
