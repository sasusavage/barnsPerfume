'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ProductCard, { type ColorVariant, getColorHex } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import AnimatedSection, { AnimatedGrid } from '@/components/AnimatedSection';
import NewsletterSection from '@/components/NewsletterSection';
import { useCMS } from '@/context/CMSContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import CinematicCategory from '@/components/CinematicCategory';

export default function Home() {
  usePageTitle('');
  const { getSetting } = useCMS();
  const logo = getSetting('site_logo');

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroBanners, setHeroBanners] = useState<any[]>([]);

  // Config State - Managed in Code
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const config: {
    hero: {
      headline: string;
      subheadline: string;
      primaryButtonText: string;
      primaryButtonLink: string;
      secondaryButtonText: string;
      secondaryButtonLink: string;
      backgroundImage?: string;
    };
    banners?: Array<{ text: string; active: boolean }>;
  } = {
    hero: {
      headline: 'Dresses, Electronics, Bags & Shoes — Everything You Need, One Store',
      subheadline: 'Quality products locally sourced and imported directly from China. Unbeatable prices for individuals and resellers across Ghana.',
      primaryButtonText: 'Shop Collections',
      primaryButtonLink: '/shop',
      secondaryButtonText: 'Our Story',
      secondaryButtonLink: '/about',
      // backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' // Optional override
    },
    banners: [
      { text: '🚚 Free delivery on orders over GH₵ 500 within Accra!', active: false },
      { text: '✨ New stock arriving this weekend - Pre-order now!', active: false },
      { text: '💳 Secure payments via Mobile Money & Card', active: false }
    ]
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Banners
        const { data: bannersData } = await supabase
          .from('banners')
          .select('*')
          .eq('position', 'hero')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (bannersData) {
          setHeroBanners(bannersData.map(b => ({
            image: b.image_url,
            media_type: b.media_type,
            tag: b.name,
            heading: b.title,
            subtext: b.subtitle,
            cta: { text: b.button_text, href: b.button_url },
            cta2: { text: 'View All', href: '/shop' }
          })));
        }

        // Fetch featured products directly from Supabase
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, product_variants(*), product_images(*)')
          .eq('status', 'active')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (productsError) throw productsError;
        setFeaturedProducts(productsData || []);

        // Fetch featured categories (featured is stored in metadata JSONB)
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, slug, image_url, metadata')
          .eq('status', 'active')
          .order('name');

        if (categoriesError) throw categoriesError;

        // Filter by metadata.featured = true on client side
        const featuredCategories = (categoriesData || []).filter(
          (cat: any) => cat.metadata?.featured === true
        );
        setCategories(featuredCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getHeroImage = () => {
    if (config.hero.backgroundImage) return config.hero.backgroundImage;
    return logo || "/logo.png";
  };

  const renderBanners = () => {
    const activeBanners = config.banners?.filter(b => b.active) || [];
    if (activeBanners.length === 0) return null;

    return (
      <div className="bg-blue-900 text-white py-2 overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {activeBanners.concat(activeBanners).map((banner, index) => (
            <span key={index} className="mx-8 text-sm font-medium tracking-wide flex items-center">
              {banner.text}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-col items-center justify-between min-h-screen">
      {renderBanners()}

      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-black">

        {/* Background Slider + Per-Slide Content */}
        {/* Background Slider + Per-Slide Content */}
        {heroBanners.length > 0 ? (
          heroBanners.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {/* Background Media */}
              {slide.media_type === 'video' ? (
                <video
                  src={slide.image}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={slide.image || '/hero-1.png'}
                  alt={`Hero Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                />
              )}

              <div className="absolute inset-0 bg-black/20"></div> {/* 20% black overlay */}

              {/* Slide Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-[-50px]">
                <p
                  key={`tag-${currentSlide}`}
                  className="text-white/90 text-sm md:text-base tracking-[0.2em] uppercase font-medium mb-6 animate-fade-in-up"
                >
                  {slide.tag}
                </p>

                <h1
                  key={`heading-${currentSlide}`}
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight drop-shadow-lg animate-fade-in-up"
                  style={{ animationDelay: '0.1s' }}
                >
                  {slide.heading}
                </h1>

                <p
                  key={`sub-${currentSlide}`}
                  className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light tracking-wide animate-fade-in-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  {slide.subtext}
                </p>

                <div
                  key={`cta-${currentSlide}`}
                  className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 animate-fade-in-up"
                  style={{ animationDelay: '0.3s' }}
                >
                  <Link
                    href={slide.cta.href || '/shop'}
                    className="bg-white text-gray-900 px-8 py-3 sm:px-10 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300"
                  >
                    {slide.cta.text}
                  </Link>
                  <Link
                    href={slide.cta2.href}
                    className="px-8 py-3 sm:px-10 sm:py-4 rounded-full font-medium text-base sm:text-lg text-white border border-white/40 hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    {slide.cta2.text}
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Fallback/Loading State
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
        )}

        {/* Bottom Features (Desktop) */}
        <div className="absolute bottom-12 left-0 right-0 z-20 hidden md:flex justify-center items-center gap-16 text-white text-center">
          <div>
            <p className="font-serif text-lg font-medium">Direct Import</p>
            <p className="text-xs text-white/60 font-light tracking-wide uppercase mt-1">From China &amp; Local Suppliers</p>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div>
            <p className="font-serif text-lg font-medium">Verified Quality</p>
            <p className="text-xs text-white/60 font-light tracking-wide uppercase mt-1">Every Item Checked</p>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div>
            <p className="font-serif text-lg font-medium">Best Prices</p>
            <p className="text-xs text-white/60 font-light tracking-wide uppercase mt-1">Wholesale &amp; Retail</p>
          </div>
        </div>

        {/* Floating "Exclusive Offer" Card (Bottom Left) */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 bg-white rounded-xl p-6 shadow-2xl max-w-[280px] animate-fade-in hidden lg:block">
          <p className="font-serif text-blue-800 text-lg italic mb-0.5">Exclusive Offer</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">25% Off</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            On your first order. <br />
            <Link href="/shop" className="underline text-blue-700 hover:text-blue-900 mt-1 inline-block">Shop now</Link>
          </p>
        </div>

      </section>

      {/* Cinematic Categories Section */}
      <CinematicCategory categories={categories} />

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Top picks from our latest arrivals</p>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product) => {
                const variants = product.product_variants || [];
                const hasVariants = variants.length > 0;
                const minVariantPrice = hasVariants ? Math.min(...variants.map((v: any) => v.price || product.price)) : undefined;
                const totalVariantStock = hasVariants ? variants.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0) : 0;
                const effectiveStock = hasVariants ? totalVariantStock : product.quantity;

                // Extract unique colors from option2
                const colorVariants: ColorVariant[] = [];
                const seenColors = new Set<string>();
                for (const v of variants) {
                  const colorName = (v as any).option2;
                  if (colorName && !seenColors.has(colorName.toLowerCase().trim())) {
                    const hex = getColorHex(colorName);
                    if (hex) {
                      seenColors.add(colorName.toLowerCase().trim());
                      colorVariants.push({ name: colorName.trim(), hex });
                    }
                  }
                }

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.compare_at_price}
                    image={product.product_images?.[0]?.url || 'https://via.placeholder.com/400x500'}
                    rating={product.rating_avg || 5}
                    reviewCount={product.review_count || 0}
                    badge={product.featured ? 'Featured' : undefined}
                    inStock={effectiveStock > 0}
                    maxStock={effectiveStock || 50}
                    moq={product.moq || 1}
                    hasVariants={hasVariants}
                    minVariantPrice={minVariantPrice}
                    colorVariants={colorVariants}
                  />
                );
              })}
            </AnimatedGrid>
          )}

          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-gray-900 text-white px-10 py-4 rounded-full font-medium hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 btn-animate"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter - Homepage Only */}
      <NewsletterSection />

    </main>
  );
}
