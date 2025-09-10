# 🚀 Quick Start - Deploy Your Resume Optimizer

## ⚡ 5-Minute Deployment

### 1. Set Up Database (2 minutes)
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Create New Project → Database → PostgreSQL
4. Copy the connection string

### 2. Deploy to Vercel (2 minutes)
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Add environment variables (see below)

### 3. Configure Services (1 minute)
- **Google OAuth**: Add redirect URI `https://your-app.vercel.app/api/auth/callback/google`
- **Stripe**: Add webhook URL `https://your-app.vercel.app/api/stripe/webhook`

## 🔑 Required Environment Variables

Add these to Vercel:

```bash
DATABASE_URL=postgresql://postgres:password@host:port/railway
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
STRIPE_SECRET_KEY=sk_live_your-live-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
OPENAI_API_KEY=your-openai-api-key
```

## 🎯 That's It!

Your app will be live at: `https://your-app.vercel.app`

## 📚 Need More Details?

Check `DEPLOYMENT.md` for the complete guide.

## 🆘 Need Help?

1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connection
4. Check Google OAuth redirect URIs
5. Verify Stripe webhook configuration

**Happy Deploying! 🚀**
