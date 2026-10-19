'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { INSPIRATION_TABS } from '../data/homeData';

export function InspirationSection() {
  const tabs = Object.keys(INSPIRATION_TABS);
  const [activeTab, setActiveTab] = useState<string>('Popular');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const currentItems = INSPIRATION_TABS[activeTab] || [];
  const displayItems = isExpanded ? currentItems : currentItems.slice(0, 18);

  return (
    <section className="py-10 border-t border-slate-200 mt-8">
      {/* Title */}
      <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight mb-4">
        Inspiration for future getaways
      </h2>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 overflow-x-auto pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsExpanded(false);
            }}
            className={`text-sm font-semibold whitespace-nowrap pb-2 relative transition-colors ${
              activeTab === tab
                ? 'text-slate-900 font-bold border-b-2 border-slate-900 -mb-[2px]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Locations (Up to 6 columns on large screens) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-6 text-xs">
        {displayItems.map((item, idx) => (
          <div key={idx} className="cursor-pointer group">
            <div className="font-bold text-slate-900 group-hover:underline">
              {item.city}
            </div>
            <div className="text-slate-500 font-normal mt-0.5">
              {item.type}
            </div>
          </div>
        ))}

        {/* Show More / Show Less Button */}
        {currentItems.length > 12 && (
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 font-bold text-slate-900 cursor-pointer hover:underline"
          >
            <span>{isExpanded ? 'Show less' : 'Show more'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        )}
      </div>

    </section>
  );
}
