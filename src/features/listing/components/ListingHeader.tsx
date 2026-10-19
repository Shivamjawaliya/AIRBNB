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
    <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-4 text-xs font-semibold text-slate-800">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition underline"
        >
          <Share className="w-4 h-4" />
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>

        {/* Save (Heart) Button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition underline"
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors',
              isSaved ? 'fill-[#FF385C] text-[#FF385C]' : 'text-slate-800'
            )}
          />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
}
