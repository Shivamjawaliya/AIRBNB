import React from 'react';
import { Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-16 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-200">
        <div>
          <h5 className="font-bold text-slate-900 mb-3">Support</h5>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:underline">Help Centre</a></li>
            <li><a href="#" className="hover:underline">AirCover</a></li>
            <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
            <li><a href="#" className="hover:underline">Disability support</a></li>
            <li><a href="#" className="hover:underline">Cancellation options</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-slate-900 mb-3">Hosting</h5>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:underline">Airbnb your home</a></li>
            <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
            <li><a href="#" className="hover:underline">Hosting resources</a></li>
            <li><a href="#" className="hover:underline">Community forum</a></li>
            <li><a href="#" className="hover:underline">Hosting responsibly</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-slate-900 mb-3">Airbnb</h5>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:underline">Newsroom</a></li>
            <li><a href="#" className="hover:underline">New features</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Investors</a></li>
            <li><a href="#" className="hover:underline">Emergency stays</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>© 2026 Airbnb, Inc.</span>
          <span>•</span>
          <a href="#" className="hover:underline">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Terms</a>
          <span>•</span>
          <a href="#" className="hover:underline">Sitemap</a>
          <span>•</span>
          <a href="#" className="hover:underline">Company details</a>
        </div>

        <div className="flex items-center gap-4 font-semibold text-slate-800">
          <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
            <Globe className="w-4 h-4" />
            <span>English (IN)</span>
          </div>
          <div className="cursor-pointer hover:underline">
            <span>₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
