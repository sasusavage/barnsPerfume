import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    let siteName = 'Affordable perfumegh';
    let siteDescription = 'Affordable Luxury Scents & Quality products delivered across Ghana.';

    try {
        const { data: name } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'site_name')
            .single();
        if (name?.value) siteName = name.value;

        const { data: desc } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'site_description')
            .single();
        if (desc?.value) siteDescription = desc.value;
    } catch (e) { }

    return {
        name: siteName,
        short_name: siteName.split(' ')[0],
        description: siteDescription,
        start_url: '/?source=pwa',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
            {
                src: '/icons/icon-72x72.png',
                sizes: '72x72',
                type: 'image/png',
            },
            {
                src: '/icons/icon-96x96.png',
                sizes: '96x96',
                type: 'image/png',
            },
            {
                src: '/icons/icon-128x128.png',
                sizes: '128x128',
                type: 'image/png',
            },
            {
                src: '/icons/icon-144x144.png',
                sizes: '144x144',
                type: 'image/png',
            },
            {
                src: '/icons/icon-152x152.png',
                sizes: '152x152',
                type: 'image/png',
            },
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icons/icon-384x384.png',
                sizes: '384x384',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
