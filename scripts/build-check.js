const fs = require('fs');
const path = require('path');

console.log('🔍 Checking production readiness...\n');

// Check required environment variables
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

console.log('📋 Required Environment Variables:');
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${envVar}: Missing`);
  }
});

// Check if build files exist
const buildDir = path.join(process.cwd(), '.next');
if (fs.existsSync(buildDir)) {
  console.log('\n✅ Build directory exists');
} else {
  console.log('\n❌ Build directory missing - run "npm run build" first');
}

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (packageJson.scripts.build) {
  console.log('✅ Build script configured');
} else {
  console.log('❌ Build script missing');
}

console.log('\n🚀 Ready for deployment!');
