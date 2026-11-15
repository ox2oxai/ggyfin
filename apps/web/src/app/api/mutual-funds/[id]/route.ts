import { NextResponse } from 'next/server';
import { DEFAULT_MUTUAL_FUNDS } from '../../../../lib/mutual-funds';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const scheme = DEFAULT_MUTUAL_FUNDS.schemes.find(
      (s) => s.id === id || s.amfiCode === id
    );

    if (scheme) {
      return NextResponse.json({
        success: true,
        scheme,
        syncMetadata: DEFAULT_MUTUAL_FUNDS.syncMetadata
      });
    }

    return NextResponse.json(
      { success: false, message: `Mutual fund scheme '${id}' not found` },
      { status: 404 }
    );
  } catch (err: any) {
    console.error('[API /api/mutual-funds/[id]] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
