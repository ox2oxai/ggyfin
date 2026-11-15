import { NextResponse } from 'next/server';
import { DEFAULT_MUTUAL_FUNDS } from '../../../lib/mutual-funds';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
  Pragma: 'no-cache'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q')?.toLowerCase();

    let schemes = DEFAULT_MUTUAL_FUNDS.schemes || [];
    if (category && category !== 'All') {
      schemes = schemes.filter(
        (s) => s.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (query) {
      schemes = schemes.filter(
        (s) =>
          s.schemeName?.toLowerCase().includes(query) ||
          s.amcName?.toLowerCase().includes(query) ||
          s.amfiCode?.includes(query)
      );
    }

    return NextResponse.json(
      {
        success: true,
        dataset: {
          ...DEFAULT_MUTUAL_FUNDS,
          schemes
        }
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('[API /api/mutual-funds] Error reading dataset:', err);
    return NextResponse.json(
      { success: false, message: 'Mutual funds catalog not available' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
