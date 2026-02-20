import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: string;
  category?: string;
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
  siteName?: string;
  siteUrl?: string;
}

export function generateMetadata({
  title = 'Premium Online Shopping',
  description = 'Shop quality products at our store. Locally sourced and imported goods delivered to your doorstep.',
  keywords = [],
  ogImage = '',
  ogType = 'website',
  price,
  currency = 'GHS',
  availability,
  category,
  publishedTime,
  author,
  noindex = false,
  siteName = 'Online Store',
  siteUrl = 'https://example.com'
}: SEOProps): Metadata {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  const defaultKeywords = [
    'online shopping',
    'premium products',
    'buy online',
    'ecommerce',
    'fast delivery',
    'secure shopping'
  ];

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : [],
      type: ogType as any,
      siteName,
      locale: 'en_GH'
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : []
    },
    robots: noindex ? {
      index: false,
      follow: false
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: siteUrl
    }
  };

  if (ogType === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime
    };
  }

  return metadata;
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
  brand?: string;
  category?: string;
  siteName?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || product.siteName || 'Premium Store'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'GHS',
      availability: product.availability === 'in_stock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  };

  if (product.rating && product.reviewCount) {
    (schema as any).aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1
    };
  }

  if (product.category) {
    (schema as any).category = product.category;
  }

  return schema;
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateOrganizationSchema(settings: {
  siteName: string;
  siteUrl: string;
  siteLogo: string;
  siteDescription: string;
  contactPhone?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    url: settings.siteUrl,
    logo: settings.siteLogo,
    description: settings.siteDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.contactPhone || '',
      contactType: 'Customer Service',
      areaServed: 'GH',
      availableLanguage: ['English']
    }
  };
}

export function generateWebsiteSchema(settings: {
  siteName: string;
  siteUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    url: settings.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${settings.siteUrl}/shop?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function StructuredData({ data }: { data: any }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}