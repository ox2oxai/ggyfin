import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
  Pragma: 'no-cache'
};

function resolvePath(): string {
  const p1 = path.join(process.cwd(), 'apps', 'web', 'data', 'mutual-funds.json');
  if (fs.existsSync(p1) || fs.existsSync(path.join(process.cwd(), 'apps', 'web'))) {
    return p1;
  }
  return path.join(process.cwd(), 'data', 'mutual-funds.json');
}

export async function GET(request: Request) {
  const filePath = resolvePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const dataset = JSON.parse(content);

      // Support optional query params for category filtering or search
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const query = searchParams.get('q')?.toLowerCase();

      let schemes = dataset.schemes || [];
      if (category && category !== 'All') {
        schemes = schemes.filter(
          (s: any) => s.category?.toLowerCase() === category.toLowerCase()
        );
      }
      if (query) {
        schemes = schemes.filter(
          (s: any) =>
            s.schemeName?.toLowerCase().includes(query) ||
            s.amcName?.toLowerCase().includes(query) ||
            s.amfiCode?.includes(query)
        );
      }

      return NextResponse.json(
        {
          success: true,
          dataset: {
            ...dataset,
            schemes
          }
        },
        { headers: NO_CACHE_HEADERS }
      );
    }
  } catch (err) {
    console.error('[API /api/mutual-funds] Error reading dataset:', err);
  }

  return NextResponse.json(
    { success: false, message: 'Mutual funds catalog not available' },
    { status: 500, headers: NO_CACHE_HEADERS }
  );
}
