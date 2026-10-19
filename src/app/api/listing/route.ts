import { NextResponse } from 'next/server';
import { MOCK_LISTING_DATA } from '@/data/mockListingData';

export async function GET() {
  return NextResponse.json(MOCK_LISTING_DATA);
}
