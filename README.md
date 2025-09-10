# Role-Specific Resume Optimizer

A Next.js application that optimizes resumes for specific job roles using AI. Paste your resume + job ad → get an ATS-ready rewrite, tailored cover letter, and skill gap report in 60 seconds.

## Features

- **Two-Step AI Process**: Extracts job requirements, then scores and rewrites your resume
- **ATS-Safe Exports**: Generate DOCX and PDF files with ATS-friendly formatting
- **Comprehensive Analysis**: Get score, gaps, rewritten bullets, cover letter, and keyword suggestions
- **Privacy-First**: No data storage by default, optional encrypted session saving
- **Stripe Integration**: Credit-based payment system

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys in `.env.local`:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `STRIPE_PRICE_ID`: Your Stripe price ID

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Architecture

```
/app
  /api
    optimize.ts           # Two-step LLM orchestration
    export.ts             # DOCX/PDF generation
    checkout.ts           # Stripe Checkout sessions
    webhook.ts            # Stripe webhook → credits
  /components
    DropZone.tsx          # File upload component
    ResultTabs.tsx        # Tabbed results display
    Paywall.tsx           # Credit purchase UI
  page.tsx                # Main landing page
/lib
  llm.ts                  # OpenAI integration with retries
  schema.ts               # Zod validation schemas
  atsTemplates.ts         # ATS-safe document templates
  credits.ts              # Credit tracking system
  scrub.ts                # PII redaction for logs
```

## Data Flow

1. **User Input**: Resume text + Job ad text + Optional role
2. **Step 1 - Extraction**: AI extracts job requirements (skills, keywords, seniority)
3. **Step 2 - Optimization**: AI scores resume and generates:
   - ATS score (0-100)
   - Missing keywords
   - Skill gaps
   - Rewritten bullet points
   - Professional summary
   - Tailored cover letter
   - ATS keyword suggestions
4. **Export**: Generate ATS-safe DOCX/PDF files
5. **Payment**: Stripe integration for credit-based access

## API Endpoints

- `POST /api/optimize` - Main optimization endpoint
- `POST /api/export` - Generate DOCX/PDF exports
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhook` - Handle Stripe webhooks

## Privacy & Security

- **Data Minimization**: No resume storage by default
- **PII Scrubbing**: All logs redact sensitive information
- **Encrypted Storage**: Optional session saving with encryption
- **Truthfulness**: AI prompts prevent fabrication of experience

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Configure Stripe webhook endpoint

## Legal Compliance

- Clear disclaimers about accuracy responsibility
- No fabrication guarantees
- 7-day refund policy
- GDPR/CCPA compliant data handling

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## License

MIT License - see LICENSE file for details.
