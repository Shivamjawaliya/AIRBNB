import React from 'react';
import { Star, Trophy } from 'lucide-react';
import { ListingDetail } from '@/types';

interface PropertyOverviewProps {
  listing: ListingDetail;
}

export function PropertyOverview({ listing }: PropertyOverviewProps) {
  return (
    <div className="py-6 border-b border-slate-200">
      
      {/* Property Title & Specs */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {listing.propertyType} in {listing.location.city}, {listing.location.country}
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          {listing.capacity.guests} guests · {listing.capacity.bedrooms} bedroom · {listing.capacity.beds} bed · {listing.capacity.bathrooms} bathroom
        </p>
      </div>

      {/* Guest Favorite / Rating Banner */}
      {listing.guestFavorite && (
        <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Guest favourite</div>
              <div className="text-xs text-slate-500">One of the most loved homes on Airbnb based on ratings, reviews, and reliability</div>
            </div>
          </div>

          <div className="text-right pl-4">
            <div className="text-base font-extrabold text-slate-900 flex items-center justify-end gap-1">
              <span>{listing.ratings.overall}</span>
              <Star className="w-4 h-4 fill-current text-slate-900" />
            </div>
            <div className="text-xs text-slate-600 underline font-medium cursor-pointer">
              {listing.ratings.reviewCount} reviews
            </div>
          </div>
        </div>
      )}

      {/* Host Profile Snippet */}
      <div className="mt-6 flex items-center gap-4">
        <img
          src={listing.host.avatarUrl}
          alt={listing.host.name}
          className="w-12 h-12 rounded-full object-cover border border-slate-200"
        />
        <div>
          <div className="text-sm font-bold text-slate-900">Hosted by {listing.host.name}</div>
          <div className="text-xs text-slate-500">
            {listing.host.isSuperhost && 'Superhost · '}
            {listing.host.yearsHosting} years hosting
          </div>
        </div>
      </div>

    </div>
  );
}
