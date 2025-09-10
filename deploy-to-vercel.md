# 🚀 Deploy to Vercel - Quick Guide

## Your Project Details:
- **Vercel Project**: `vercel.com/cvcrafter`
- **NextAuth Secret**: `sX7rN/LhbH+JLYSSAU7kSfkil7cQL24XWJp9QktNUWo=`

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

## Step 2: Connect to Vercel
1. Go to https://vercel.com/cvcrafter
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

## Step 3: Set Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```bash
DATABASE_URL=postgresql://postgres:password@host:port/railway
NEXTAUTH_URL=https://cvcrafter.vercel.app
NEXTAUTH_SECRET=sX7rN/LhbH+JLYSSAU7kSfkil7cQL24XWJp9QktNUWo=
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
STRIPE_SECRET_KEY=sk_live_your-live-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
OPENAI_API_KEY=your-openai-api-key
```

## Step 4: Deploy
Click "Deploy" in Vercel dashboard

## Step 5: Run Database Migration
After deployment, run:
```bash
npx prisma db push
```

## Step 6: Test Your Live App
Visit: https://cvcrafter.vercel.app

## 🎉 You're Live!
Your Resume Optimizer is now public and ready for users!
