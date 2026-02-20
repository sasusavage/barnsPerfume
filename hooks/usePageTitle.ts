'use client';

import { useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';

export function usePageTitle(title: string) {
  const { getSetting } = useCMS();
  const siteName = getSetting('site_name') || '';

  useEffect(() => {
    if (siteName) {
      document.title = title ? `${title} | ${siteName}` : `${siteName}`;
    } else {
      document.title = title || 'Store';
    }
  }, [title, siteName]);
}
