"use client";
import React from 'react';

type Tab = { key: string; label: string; content: React.ReactNode };

export default function ResultTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = React.useState(tabs[0]?.key);
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-6 py-3 font-semibold text-sm transition-all duration-200 relative ${
              active === tab.key
                ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-amber-50'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {tab.label}
            {active === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[400px]">
        <div className="animate-fade-in">
          {tabs.find((t) => t.key === active)?.content}
        </div>
      </div>
    </div>
  );
}


