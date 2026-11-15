import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function resolvePath(): string {
  const p1 = path.join(process.cwd(), 'apps', 'web', 'data', 'mutual-funds.json');
  if (fs.existsSync(p1) || fs.existsSync(path.join(process.cwd(), 'apps', 'web'))) {
    return p1;
  }
  return path.join(process.cwd(), 'data', 'mutual-funds.json');
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const filePath = resolvePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const dataset = JSON.parse(content);
      const scheme = (dataset.schemes || []).find(
        (s: any) => s.id === id || s.amfiCode === id
      );

      if (scheme) {
        return NextResponse.json({
          success: true,
          scheme,
          syncMetadata: dataset.syncMetadata
        });
      }

      return NextResponse.json(
        { success: false, message: `Mutual fund scheme '${id}' not found` },
        { status: 404 }
      );
    }
  } catch (err: any) {
    console.error('[API /api/mutual-funds/[id]] Error:', err);
  }

  return NextResponse.json(
    { success: false, message: 'Internal server error' },
    { status: 500 }
  );
}
