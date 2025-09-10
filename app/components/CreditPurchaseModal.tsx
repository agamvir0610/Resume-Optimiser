'use client';

import { useState } from 'react';

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
}

export default function CreditPurchaseModal({ isOpen, onClose, currentCredits }: CreditPurchaseModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('20');

  const creditPackages = [
    { credits: 20, price: 9.99, popular: false },
    { credits: 50, price: 19.99, popular: true },
    { credits: 100, price: 34.99, popular: false },
  ];

  const handlePurchase = async () => {
    const packageData = creditPackages.find(pkg => pkg.credits.toString() === selectedPackage);
    if (!packageData) return;

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credits: packageData.credits,
          price: packageData.price,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to start purchase process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Credits</h2>
          <p className="text-gray-600">
            You have <span className="font-semibold text-blue-600">{currentCredits}</span> credits remaining.
            <br />
            Each resume optimization costs <span className="font-semibold text-red-600">5 credits</span>.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.credits}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPackage === pkg.credits.toString()
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${pkg.popular ? 'ring-2 ring-yellow-400' : ''}`}
              onClick={() => setSelectedPackage(pkg.credits.toString())}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{pkg.credits} Credits</div>
                  <div className="text-sm text-gray-600">
                    {Math.floor(pkg.credits / 5)} resume optimizations
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">${pkg.price}</div>
                  <div className="text-sm text-gray-500">
                    ${(pkg.price / pkg.credits).toFixed(2)} per credit
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Purchase Credits'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Secure payment powered by Stripe. Credits are added instantly after payment.
          </p>
        </div>
      </div>
    </div>
  );
}
