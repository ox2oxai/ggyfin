'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@nbfc/shared';

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nbfc_staff_session');
      if (raw) {
        const session = JSON.parse(raw);
        if (session.role === UserRole.SUPER_ADMIN_IT) {
          router.replace('/dashboard/it-admin');
          return;
        }
      }
    } catch {}
    router.replace('/dashboard/workspace');
  }, [router]);

  return null;
}
