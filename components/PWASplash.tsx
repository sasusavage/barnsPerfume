'use client';

import { useState, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';

export default function PWASplash() {
  const [showSplash, setShowSplash] = useState(false);
  const { getSetting } = useCMS();
  const siteName = getSetting('site_name') || '';
  const siteLogo = getSetting('site_logo') || '';
  const siteTagline = getSetting('site_tagline') || '';

  useEffect(() => {
    // Only show splash in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Only show on first load (not on subsequent navigations)
    const hasShownSplash = sessionStorage.getItem('splashShown');

    if (isStandalone && !hasShownSplash) {
      setShowSplash(true);
      sessionStorage.setItem('splashShown', 'true');

      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showSplash) return null;

  return (
    <div className="pwa-splash" aria-hidden="true">
      <div className="pwa-splash-logo mb-6">
        {siteLogo && (
          <img
            src={siteLogo}
            alt={siteName}
            className="w-24 h-24 object-contain brightness-0 invert"
          />
        )}
      </div>
      <h1 className="text-white text-xl font-bold font-serif mb-2">{siteName}</h1>
      <p className="text-blue-200 text-sm font-medium mb-8">{siteTagline}</p>
      <div className="pwa-splash-dots flex gap-1.5">
        <span className="w-2 h-2 bg-white rounded-full" />
        <span className="w-2 h-2 bg-white rounded-full" />
        <span className="w-2 h-2 bg-white rounded-full" />
      </div>
    </div>
  );
}

