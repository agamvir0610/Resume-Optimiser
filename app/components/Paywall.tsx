"use client";
import React from 'react';

export default function Paywall({ onCheckout }: { onCheckout: () => void }) {
  return (
    <div className="bg-gradient-to-r from-sky-50 to-amber-50 border-2 border-sky-200 rounded-2xl p-8 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-amber-400 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Unlock Full Features</h3>
          <p className="text-gray-600 mb-6">
            Get unlimited exports, advanced AI optimization, and priority support with our premium plans.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800">5 ATS-Ready Exports</span>
            </div>
            <span className="text-2xl font-bold text-sky-600">$15</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800">30 Exports/Month</span>
            </div>
            <span className="text-2xl font-bold text-amber-600">$25</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full px-8 py-4 bg-gradient-to-r from-sky-400 to-amber-400 text-white font-bold text-lg rounded-xl hover:from-sky-500 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🚀 Get Started Now
        </button>

        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe • 7-day money-back guarantee
        </p>
      </div>
    </div>
  );
}


