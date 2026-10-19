'use client';

import React from 'react';
import { Search, Globe, Menu, User } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Airbnb Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-[#FF385C] flex items-center gap-1.5 font-bold text-xl tracking-tight">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.397c0 4.94-3.582 8.724-8.5 8.724-2.822 0-5.183-1.258-6.5-3.342-1.317 2.084-3.678 3.342-6.5 3.342-4.918 0-8.5-3.784-8.5-8.724 0-1.196.347-2.455 1.116-4.146l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C9.037 1.963 10.492 1 12.5 1h3.5zm0 2.5h-3.5c-1.127 0-2.072.56-3.13 2.483l-.53 1.02c-1.928 3.777-6.046 12.404-7.03 14.698C1.19 23.09 1 24.083 1 25.124c0 3.65 2.585 6.224 6 6.224 2.41 0 4.412-1.332 5.378-3.528l.422-.962.422.962C14.188 30.016 16.19 31.348 18.6 31.348c3.415 0 6-2.574 6-6.224 0-1.041-.19-2.034-.81-3.419-.984-2.294-5.102-10.921-7.03-14.698l-.53-1.02C15.172 4.06 14.227 3.5 13.1 3.5H16zm0 13c2.485 0 4.5 2.015 4.5 4.5 0 2.656-1.748 4.5-4.5 4.5s-4.5-1.844-4.5-4.5c0-2.485 2.015-4.5 4.5-4.5zm0 2.5c-1.105 0-2 .895-2 2 0 1.258.832 2 2 2s2-.742 2-2c0-1.105-.895-2-2-2z"/>
            </svg>
            <span className="hidden md:inline">airbnb</span>
          </div>
        </div>

        {/* Center: Search Pill */}
        <div className="hidden sm:flex items-center border border-slate-300 rounded-full py-2 px-4 shadow-xs hover:shadow-md transition cursor-pointer gap-3 text-xs font-semibold text-slate-800">
          <span>Anywhere</span>
          <span className="h-4 w-px bg-slate-300"></span>
          <span>Any week</span>
          <span className="h-4 w-px bg-slate-300"></span>
          <span className="text-slate-500 font-normal">Add guests</span>
          <div className="w-8 h-8 rounded-full bg-[#FF385C] text-white flex items-center justify-center">
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-3">
          <button className="hidden min-[1138px]:block text-xs font-semibold text-slate-800 py-2.5 px-3.5 rounded-full hover:bg-slate-100 transition">
            Airbnb your home
          </button>
          <button className="p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition" aria-label="Language & Currency">
            <Globe className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2.5 border border-slate-300 rounded-full py-1.5 px-3 hover:shadow-md transition cursor-pointer">
            <Menu className="w-4 h-4 text-slate-700" />
            <div className="w-7 h-7 rounded-full bg-slate-500 text-white flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
