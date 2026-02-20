'use client';

import { useState } from 'react';
import Link from 'next/link';
import LazyImage from './LazyImage';
import { useCart } from '@/context/CartContext';

// Map common color names to hex values
const COLOR_MAP: Record<string, string> = {
  black: '#000000', white: '#FFFFFF', red: '#EF4444', blue: '#3B82F6',
  navy: '#1E3A5F', green: '#22C55E', yellow: '#EAB308', orange: '#F97316',
  pink: '#EC4899', purple: '#A855F7', brown: '#92400E', beige: '#D4C5A9',
  grey: '#6B7280', gray: '#6B7280', cream: '#FFFDD0', teal: '#14B8A6',
  maroon: '#800000', coral: '#FF7F50', burgundy: '#800020', olive: '#808000',
  tan: '#D2B48C', khaki: '#C3B091', charcoal: '#36454F', ivory: '#FFFFF0',
  gold: '#FFD700', silver: '#C0C0C0', rose: '#FF007F', lavender: '#E6E6FA',
  mint: '#98FB98', peach: '#FFDAB9', wine: '#722F37', denim: '#1560BD',
  nude: '#E3BC9A', camel: '#C19A6B', sage: '#BCB88A', rust: '#B7410E',
  mustard: '#FFDB58', plum: '#8E4585', lilac: '#C8A2C8', stone: '#928E85',
  sand: '#C2B280', taupe: '#483C32', mauve: '#E0B0FF', sky: '#87CEEB',
  forest: '#228B22', cobalt: '#0047AB', emerald: '#50C878', scarlet: '#FF2400',
  aqua: '#00FFFF', turquoise: '#40E0D0', indigo: '#4B0082', crimson: '#DC143C',
  magenta: '#FF00FF', cyan: '#00FFFF', chocolate: '#7B3F00', coffee: '#6F4E37',
};

export function getColorHex(colorName: string): string | null {
  const lower = colorName.toLowerCase().trim();
  if (COLOR_MAP[lower]) return COLOR_MAP[lower];
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

export interface ColorVariant {
  name: string;
  hex: string;
}

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock?: boolean;
  maxStock?: number;
  moq?: number;
  hasVariants?: boolean;
  minVariantPrice?: number;
  colorVariants?: ColorVariant[];
  // New props for Glassmorphism design
  notes?: string;
  origin?: string;
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  image,
  rating = 5,
  reviewCount = 0,
  badge,
  inStock = true,
  maxStock = 50,
  moq = 1,
  hasVariants = false,
  minVariantPrice,
  colorVariants = [],
  notes = "Top: Citrus, Heart: Floral, Base: Musk", // Fallback Mock
  origin = "98% Locally Sourced - Accra"
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const displayPrice = hasVariants && minVariantPrice ? minVariantPrice : price;
  const discount = originalPrice ? Math.round((1 - displayPrice / originalPrice) * 100) : 0;
  const MAX_SWATCHES = 4;

  const formatPrice = (val: number) => `GH\u20B5${val.toFixed(2)}`;

  return (
    <div className="group relative w-full h-full">
      <div className="relative flex flex-col h-full bg-white/80 backdrop-blur-xl border border-white/40 rounded-[20px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">

        {/* Image Container with Overlay */}
        <Link href={`/product/${slug}`} className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-b from-transparent to-gray-50/30">
          <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-1">
            <LazyImage
              src={image}
              alt={name}
              className="w-full h-full object-contain drop-shadow-xl transition-all duration-500"
            />
          </div>

          {/* Scent Notes Overlay (Hover) */}
          <div className="absolute inset-0 bg-ebony/70 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center text-center p-6 text-white translate-y-4 group-hover:translate-y-0 z-10">
            <h4 className="font-serif text-2xl text-champagne-gold mb-3 italic">Notes</h4>
            <p className="text-sm font-light leading-relaxed opacity-90">{notes}</p>
            <div className="w-8 h-px bg-champagne-gold/50 my-4"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">View Scent Profile</span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {badge && (
              <span className="bg-white/90 backdrop-blur text-ebony text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-sm">
                {badge}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-50 text-red-700 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-sm">
                -{discount}%
              </span>
            )}
            {!inStock && (
              <span className="bg-ebony text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-sm">
                Out of Stock
              </span>
            )}
          </div>
        </Link>

        {/* Content Body */}
        <div className="flex flex-col flex-grow px-5 pb-5 pt-3 text-center">

          {/* Origin Label */}
          <div className="mb-2">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-gray-400 border border-gray-100 rounded-full px-2 py-0.5 bg-white/50">
              {origin}
            </span>
          </div>

          <Link href={`/product/${slug}`} className="group/title">
            <h3 className="font-serif text-lg text-ebony mb-1 group-hover/title:text-champagne-dark transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-3">
            <span className="text-ebony font-semibold">{formatPrice(displayPrice)}</span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>

          {/* Color Swatches */}
          {colorVariants.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 mb-4">
              {colorVariants.slice(0, MAX_SWATCHES).map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveColor(activeColor === color.name ? null : color.name);
                  }}
                  className={`w-3 h-3 rounded-full border transition-all duration-300 ${activeColor === color.name
                      ? 'scale-125 ring-1 ring-offset-2 ring-champagne-gold'
                      : 'hover:scale-125'
                    } ${color.hex === '#FFFFFF' ? 'border-gray-300' : 'border-transparent'}`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {colorVariants.length > MAX_SWATCHES && (
                <span className="text-[10px] text-gray-400">+{colorVariants.length - MAX_SWATCHES}</span>
              )}
            </div>
          )}

          {/* Add to Cart (Minimalist) */}
          <div className="mt-auto pt-2">
            {inStock ? (
              hasVariants ? (
                <Link
                  href={`/product/${slug}`}
                  className="w-full inline-block text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-ebony py-2 border-b border-gray-100 hover:border-ebony transition-all duration-300"
                >
                  Select Options
                </Link>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart({ id, name, price, image, quantity: moq, slug, maxStock, moq });
                  }}
                  className="w-full inline-block text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-ebony hover:text-champagne-dark py-2 border-b border-gray-100 hover:border-champagne-gold transition-all duration-300"
                >
                  Add to Cart
                </button>
              )
            ) : (
              <span className="text-xs text-gray-300 font-medium cursor-not-allowed">Unavailable</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
