# 🚀 Complete Setup Guide - Go Live Today

## Step 1: Get Your API Keys

### 1.1 OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Replace `your_openai_api_key_here` in `.env.local`

### 1.2 Stripe Setup
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Replace the keys in `.env.local`

### 1.3 Create Stripe Product & Price
1. Go to https://dashboard.stripe.com/test/products
2. Click "Add product"
3. Name: "ATS Pack (5 exports)"
4. Description: "5 ATS-ready resume exports"
5. Pricing: One-time payment, $15 AUD
6. Copy the **Price ID** (starts with `price_`)
7. Replace `price_your_price_id_here` in `.env.local`

### 1.4 Stripe Webhook
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://your-vercel-url.vercel.app/api/webhook`
4. Events: `checkout.session.completed`
5. Copy the **Webhook secret** (starts with `whsec_`)
6. Replace `whsec_your_webhook_secret_here` in `.env.local`

### 1.5 JWT Secret (for credits)
Generate a random 32+ character string:
```bash
openssl rand -base64 32
```
Replace `your_jwt_secret_here_minimum_32_characters` in `.env.local`

## Step 2: Test Locally

### 2.1 Install Dependencies
```bash
npm install
```

### 2.2 Start Development Server
```bash
npm run dev
```

### 2.3 Test the Flow
1. Go to http://localhost:3000
2. Paste a resume and job ad
3. Click "Get ATS-Ready Resume"
4. Check the results
5. Test export (will fail without credits - that's expected)

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/resume-optimizer.git
git push -u origin main
```

### 3.2 Deploy to Vercel
1. Go to https://vercel.com
2. Import your GitHub repo
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_ID`
   - `CREDITS_JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL` (your Vercel URL)
   - `APP_URL` (your Vercel URL)

### 3.3 Update Stripe Webhook
1. Go back to Stripe webhook settings
2. Update the URL to your actual Vercel URL
3. Test the webhook

## Step 4: Test End-to-End

### 4.1 Test Payment Flow
1. Go to your live site
2. Click "Buy credits"
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify credits are added

### 4.2 Test Export
1. Optimize a resume
2. Click "Export DOCX"
3. Verify file downloads
4. Check credits are consumed

## Step 5: Launch Marketing

### 5.1 Reddit Posts
Post in r/resumes, r/jobs, r/cscareerquestions:
"Free ATS resume tune-up: drop your job ad + 3 bullets you want rewritten. I'll reply with a tailored version (no login)."

### 5.2 LinkedIn
Post: "Just launched an AI resume optimizer that gets you ATS-ready in 60 seconds. First 50 users get free credits with code LAUNCH50"

## Step 6: Monitor & Iterate

### 6.1 Check Logs
- Vercel dashboard → Functions → View logs
- Look for any errors in optimization or export

### 6.2 Test Edge Cases
- Very short resume
- Resume with no metrics
- Long job ad with many requirements
- Network issues

## 🔧 Troubleshooting

### Common Issues:

**500 Error on /api/optimize:**
- Check OPENAI_API_KEY is set correctly
- Verify the key has credits

**Stripe checkout fails:**
- Check STRIPE_SECRET_KEY and STRIPE_PRICE_ID
- Verify price exists in Stripe dashboard

**Webhook not working:**
- Check STRIPE_WEBHOOK_SECRET
- Verify webhook URL is correct
- Test webhook in Stripe dashboard

**Export fails:**
- Check if user has credits
- Verify DOCX generation is working

## 📊 Success Metrics to Track

- Optimizations started
- Previews shown
- Checkouts started
- Payments succeeded
- Exports completed
- Drop-off points

## 🎯 Quick Wins to Add Later

1. **Role presets** - Software Engineer, Nurse, etc.
2. **Email capture** - "Send me my results"
3. **Social proof** - "Trusted by 127+ job seekers"
4. **Truth check** - Flag potential exaggerations
5. **Better error handling** - Retry buttons, friendly messages

## 🚨 Legal Checklist

- [ ] Privacy policy with your contact info
- [ ] Terms of service with disclaimers
- [ ] "No guarantees of interviews" disclaimer
- [ ] "We never fabricate experience" statement
- [ ] Data retention policy (24h default)

---

**You're ready to go live!** 🚀

The app is production-ready with:
- ✅ Two-step AI optimization
- ✅ ATS-safe exports
- ✅ Stripe payments
- ✅ Credit system
- ✅ Privacy controls
- ✅ Error handling
