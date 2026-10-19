'use client';

import React, { useState } from 'react';
import { Share, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListingHeaderProps {
  title: string;
}

export function ListingHeader({ title }: ListingHeaderProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pt-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h1 className="text-[19px] sm:text-[21px] md:text-[23px] leading-[26px] font-semibold text-[#222222] tracking-[-0.015em]">
        {title}
      </h1>

      <div className="flex items-center gap-3 text-[13px] font-medium text-[#222222]">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 transition cursor-pointer select-none"
        >
          <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 fill-none stroke-[#222222] stroke-[2.2]" aria-hidden="true">
            <path d="M27 22v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6M16 2v20M8 10l8-8 8 8" />
          </svg>
          <span className="underline underline-offset-2">{copied ? 'Link Copied!' : 'Share'}</span>
        </button>

        {/* Save (Heart) Button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 transition cursor-pointer select-none"
        >
          <Heart
            className={cn(
              'w-3.5 h-3.5 stroke-[2.2] transition-colors',
              isSaved ? 'fill-[#FF385C] text-[#FF385C]' : 'text-[#222222]'
            )}
          />
          <span className="underline underline-offset-2">{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
}
